// services/comment.service.js - Enhanced version
import commentRepo from '../repositories/comment.repositories.js';
import postRepo from '../repositories/post.repositories.js';
import notificationService from './notification.service.js';
import Comment from '../models/comment.model.js';

/**
 * Thêm comment vào bài viết
 */
const addComment = async (postId, userId, content, parentCommentId = null) => {
  // Kiểm tra quyền truy cập bài viết
  const { hasAccess, post, reason } = await postRepo.checkPostAccess(postId, userId);
  
  if (!hasAccess) {
    throw new Error(reason || 'Không có quyền truy cập bài viết này');
  }
  
  // Nếu là reply comment, kiểm tra parent comment có tồn tại không
  if (parentCommentId) {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment || parentComment.post.toString() !== postId) {
      throw new Error('Bình luận gốc không tồn tại');
    }
  }
  
  // Tạo comment
  const commentData = {
    content,
    author: userId,
    post: postId,
    parentComment: parentCommentId
  };
  
  const comment = await commentRepo.create(commentData);
  
  // Populate thông tin author
  await comment.populate('author', 'fullName avatar');
  
  // Tạo thông báo
  if (parentCommentId) {
    // Nếu là reply, thông báo cho tác giả comment gốc
    const parentComment = await Comment.findById(parentCommentId);
    if (parentComment.author.toString() !== userId) {
      await notificationService.createNotification({
        recipient: parentComment.author,
        sender: userId,
        type: 'reply',
        post: postId,
        comment: comment._id,
        message: `đã trả lời bình luận của bạn`
      });
    }
  } else {
    // Nếu là comment gốc, thông báo cho tác giả bài viết
    if (post.author._id.toString() !== userId) {
      await notificationService.createNotification({
        recipient: post.author._id,
        sender: userId,
        type: 'comment',
        post: postId,
        comment: comment._id,
        message: `đã bình luận về bài viết của bạn`
      });
    }
  }
  
  return comment;
};

/**
 * Lấy comments của bài viết (chỉ comments gốc, không bao gồm replies)
 */
// Sửa hàm này ở comment.service.js
const getPostComments = async (postId, userId, page = 1, limit) => { // <- bỏ = 10
  // Kiểm tra quyền truy cập bài viết
  const { hasAccess, reason } = await postRepo.checkPostAccess(postId, userId);
  
  if (!hasAccess) {
    throw new Error(reason || 'Không có quyền truy cập bài viết này');
  }
  
  const comments = await commentRepo.findRootCommentsByPost(postId, page, limit); // <- limit có thể undefined

  // Đếm tổng số comment vẫn được, vì count ko bị limit
  const totalComments = await commentRepo.countCommentsByPost(postId);

  // Nếu không có limit thì trả về pagination rỗng hoặc null, hoặc tùy bạn
  let pagination = null;
  if (limit) {
    pagination = {
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments,
      hasNext: page * limit < totalComments
    };
  }

  return { comments, pagination };
};


/**
 * Lấy replies của một comment
 */
const getCommentReplies = async (commentId, userId, page = 1, limit = 5) => {
  // Lấy thông tin comment gốc để kiểm tra quyền truy cập post
  const parentComment = await Comment.findById(commentId);
  if (!parentComment) {
    throw new Error('Bình luận không tồn tại');
  }
  
  // Kiểm tra quyền truy cập bài viết
  const { hasAccess, reason } = await postRepo.checkPostAccess(parentComment.post, userId);
  
  if (!hasAccess) {
    throw new Error(reason || 'Không có quyền truy cập bài viết này');
  }
  
  const replies = await commentRepo.findRepliesByComment(commentId, page, limit);
  
  return {
    replies,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(parentComment.replyCount / limit),
      totalReplies: parentComment.replyCount,
      hasNext: page * limit < parentComment.replyCount
    }
  };
};

/**
 * Like/Unlike comment
 */
const toggleCommentLike = async (commentId, userId) => {
  // Lấy thông tin comment để kiểm tra quyền truy cập post
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new Error('Bình luận không tồn tại');
  }
  
  // Kiểm tra quyền truy cập bài viết
  const { hasAccess, reason } = await postRepo.checkPostAccess(comment.post, userId);
  
  if (!hasAccess) {
    throw new Error(reason || 'Không có quyền truy cập bài viết này');
  }
  
  const result = await commentRepo.toggleLike(commentId, userId);
  
  // Tạo thông báo nếu like (không tạo thông báo khi unlike)
  if (result.action === 'liked' && comment.author.toString() !== userId) {
    await notificationService.createNotification({
      recipient: comment.author,
      sender: userId,
      type: 'like_comment',
      post: comment.post,
      comment: commentId,
      message: `đã thích bình luận của bạn`
    });
  }
  
  return result;
};

/**
 * Xóa comment
 */
const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  
  if (!comment) {
    throw new Error('Bình luận không tồn tại');
  }
  
  // Chỉ tác giả comment hoặc admin mới có thể xóa
  if (comment.author.toString() !== userId) {
    // TODO: Kiểm tra quyền admin nếu cần
    throw new Error('Bạn không có quyền xóa bình luận này');
  }
  
  await commentRepo.softDelete(commentId);
  
  return { message: 'Đã xóa bình luận' };
};


const replyToComment = async (userId, parentCommentId, content) => {
  // Validate
  if (!content || !content.trim()) {
    throw new Error('Nội dung bình luận không được để trống');
  }

  // Lấy comment gốc
  const parentComment = await Comment.findById(parentCommentId);
  if (!parentComment) {
    throw new Error('Không tìm thấy comment gốc');
  }

  // Kiểm tra quyền truy cập post
  const { hasAccess, post, reason } = await postRepo.checkPostAccess(parentComment.post, userId);
  if (!hasAccess) {
    throw new Error(reason || 'Không có quyền truy cập bài viết này');
  }

  // Tạo reply (dùng lại repo cũ)
  const reply = await commentRepo.create({
    content,
    author: userId,
    post: parentComment.post,
    parentComment: parentCommentId
  });

  // Populate author để trả về cho client
  await reply.populate('author', 'fullName avatar');

  // Gửi notification (nếu muốn)
  if (parentComment.author.toString() !== userId) {
    await notificationService.createNotification({
      recipient: parentComment.author,
      sender: userId,
      type: 'reply',
      post: parentComment.post,
      comment: reply._id,
      message: 'đã trả lời bình luận của bạn'
    });
  }

  return {
    message: 'Đã trả lời bình luận',
    comment: reply
  };
};


const getCommentById = async (commentId) => {
  return await Comment.findById(commentId);
};
export default { 
  addComment, 
  getPostComments, 
  getCommentReplies, 
  toggleCommentLike,
  deleteComment,
  replyToComment
};
