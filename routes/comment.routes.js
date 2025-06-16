
// routes/comment.routes.js - Enhanced version
import express from 'express';
import commentController from '../controllers/comment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// === POST COMMENTS ===
// Thêm comment vào bài viết và trả lời comment
router.post('/:id/comments', authMiddleware, commentController.addComment);

// Lấy danh sách comments của bài viết
router.get('/:id/comments', authMiddleware, commentController.getPostComments);

// === COMMENT ACTIONS ===
// Lấy replies của một comment
router.get('/comments/:id/replies', authMiddleware, commentController.getCommentReplies);

// Like/Unlike comment
router.post('/comments/:id/like', authMiddleware, commentController.toggleCommentLike);

// Xóa comment
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);

export default router;
