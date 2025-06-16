// repositories/comment.repository.js - Enhanced version
import Comment from '../models/comment.model.js';

/**
 * Tạo comment mới (có thể là comment gốc hoặc reply)
 */
const create = async (data) => {
  const comment = await Comment.create(data);
  
  // Nếu là reply comment, tăng replyCount của parent comment
  if (data.parentComment) {
    await Comment.findByIdAndUpdate(
      data.parentComment, 
      { $inc: { replyCount: 1 } }
    );
  }
  
  return comment;
};

/**
 * Lấy comments gốc của một bài viết (không bao gồm replies)
 */
const findRootCommentsByPost = async (postId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  return await Comment.find({ 
    post: postId, 
    parentComment: null, // Chỉ lấy comment gốc
    status: 'active'
  })
  .populate('author', 'fullName avatar')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

/**
 * Lấy replies của một comment
 */
const findRepliesByComment = async (commentId, page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  
  return await Comment.find({ 
    parentComment: commentId,
    status: 'active'
  })
  .populate('author', 'fullName avatar')
  .sort({ createdAt: 1 }) // Replies sắp xếp theo thời gian tăng dần
  .skip(skip)
  .limit(limit);
};

/**
 * Lấy tổng số comments của một bài viết
 */
const countCommentsByPost = async (postId) => {
  return await Comment.countDocuments({ 
    post: postId, 
    status: 'active' 
  });
};

/**
 * Like/Unlike comment
 */
const toggleLike = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  
  if (comment.likes.includes(userId)) {
    // Unlike
    await Comment.findByIdAndUpdate(commentId, {
      $pull: { likes: userId }
    });
    return { action: 'unliked', likesCount: comment.likes.length - 1 };
  } else {
    // Like
    await Comment.findByIdAndUpdate(commentId, {
      $addToSet: { likes: userId }
    });
    return { action: 'liked', likesCount: comment.likes.length + 1 };
  }
};

/**
 * Xóa comment (soft delete)
 */
const softDelete = async (commentId) => {
  return await Comment.findByIdAndUpdate(
    commentId, 
    { 
      status: 'deleted',
      content: '[Bình luận đã bị xóa]',
      updatedAt: new Date()
    }
  );
};

export default { 
  create, 
  findRootCommentsByPost, 
  findRepliesByComment, 
  countCommentsByPost,
  toggleLike,
  softDelete
};
