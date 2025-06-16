// routes/comment.routes.js
// Router quản lý các endpoint bình luận bài viết
import express from 'express';
import commentController from '../controllers/comment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Thêm bình luận cho bài viết (yêu cầu đăng nhập)
router.post('/:id/comments', authMiddleware, commentController.addComment);
// Lấy danh sách bình luận của bài viết
router.get('/:id/comments', commentController.getComments);

export default router;