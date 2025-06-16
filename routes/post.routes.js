import express from 'express';
import postController from '../controllers/post.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Đăng bài viết mới
router.route('/')
  .post(authMiddleware, postController.createPost) // Tạo bài viết
  .get(postController.getAllPosts); // Lấy tất cả bài viết
  

// Sửa, xóa bài viết theo id
router.route('/:id')
  .put(authMiddleware, postController.updatePost) // Sửa bài viết
  .delete(authMiddleware, postController.deletePost); // Xóa bài viết

// Like/Unlike bài viết
router.route('/:id/like')
  .post(authMiddleware, postController.likePost);

router.route('/:id/unlike')
  .post(authMiddleware, postController.unlikePost);

// View bài viết
router.route('/:id/view')
  .post(authMiddleware, postController.viewPost);

// Share bài viết
router.route('/:id/share')
  .post(authMiddleware, postController.sharePost);

export default router;