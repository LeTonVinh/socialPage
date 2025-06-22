// controllers/comment.controller.js - Enhanced version
import asyncHandler from 'express-async-handler';
import commentService from '../services/comment.service.js';

/**
 * Thêm comment vào bài viết
 * @route POST /posts/:id/comments
 * @access Private
 */
const addComment = asyncHandler(async (req, res) => {
  const { content, parentCommentId } = req.body;
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
  }
  
  const comment = await commentService.addComment(
    req.params.id, 
    req.user.id, 
    content.trim(),
    parentCommentId
  );
  
  res.status(201).json({ 
    message: parentCommentId ? 'Đã trả lời bình luận' : 'Đã bình luận',
    comment 
  });
});

/**
 * Lấy danh sách comments của bài viết
 * @route GET /posts/:id/comments
 * @access Private (cần đăng nhập để kiểm tra quyền truy cập)
 */
const getPostComments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) ;
  const limit = parseInt(req.query.limit) ;
  
  const result = await commentService.getPostComments(req.params.id, req.user.id, page, limit);
  
  res.json(result);
});

/**
 * Lấy replies của một comment
 * @route GET /comments/:id/replies
 * @access Private
 */
const getCommentReplies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  
  const result = await commentService.getCommentReplies(req.params.id, req.user.id, page, limit);
  
  res.json(result);
});

/**
 * Like/Unlike comment
 * @route POST /comments/:id/like
 * @access Private
 */
const toggleCommentLike = asyncHandler(async (req, res) => {
  const result = await commentService.toggleCommentLike(req.params.id, req.user.id);
  
  res.json({
    message: result.action === 'liked' ? 'Đã thích bình luận' : 'Đã bỏ thích bình luận',
    ...result
  });
});

/**
 * Xóa comment
 * @route DELETE /comments/:id
 * @access Private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const result = await commentService.deleteComment(req.params.id, req.user.id);
  res.json(result);
});

export default { 
  addComment, 
  getPostComments, 
  getCommentReplies, 
  toggleCommentLike,
  deleteComment
};