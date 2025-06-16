// controllers/comment.controller.js
// Controller quản lý các thao tác bình luận bài viết
import asyncHandler from 'express-async-handler';
import commentService from '../services/comment.service.js';

/**
 * Thêm bình luận cho bài viết
 * @route POST /posts/:id/comments
 * @access Private
 */
const addComment = asyncHandler(async (req, res) => {
  const comment = await commentService.addComment(req.params.id, req.user.id, req.body.content);
  res.status(201).json({ message: 'Đã bình luận', comment });
});

/**
 * Lấy danh sách bình luận của một bài viết
 * @route GET /posts/:id/comments
 * @access Public
 */
const getComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getComments(req.params.id);
  res.json({ comments });
});

export default { addComment, getComments };