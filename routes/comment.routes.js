/**
 * Routes Quản lý Bình luận (Comment Routes)
 * Định nghĩa các endpoint liên quan đến bình luận: thêm, xóa, like, reply
 */
import express from 'express';
import commentController from '../controllers/comment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Thêm bình luận vào bài viết
 * @route POST /api/posts/:id/comments
 * @access Private
 */
router.post('/:id/comments', authMiddleware, commentController.addComment);

/**
 * Trả lời một bình luận (tạo reply)
 * @route POST /api/comments/:id/replies
 * @access Private
 */
router.post('/comments/:id/replies', authMiddleware, commentController.replyToComment);

/**
 * Lấy danh sách bình luận của bài viết
 * @route GET /api/posts/:id/comments
 * @access Private
 */
router.get('/:id/comments', authMiddleware, commentController.getPostComments);

/**
 * Lấy danh sách replies của một bình luận
 * @route GET /api/comments/:id/replies
 * @access Private
 */
router.get('/comments/:id/replies', authMiddleware, commentController.getCommentReplies);

/**
 * Thích/Bỏ thích bình luận
 * @route POST /api/comments/:id/like
 * @access Private
 */
router.post('/comments/:id/like', authMiddleware, commentController.toggleCommentLike);

/**
 * Xóa bình luận
 * @route DELETE /api/comments/:id
 * @access Private (chỉ tác giả bình luận)
 */
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);

export default router;