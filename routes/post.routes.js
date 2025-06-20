import express from 'express';
import postController from '../controllers/post.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Đăng bài viết mới
router.route('/')
    .post(authMiddleware, postController.createPost) // Tạo bài viết
    .get(authMiddleware, postController.getAllPosts); // Lấy tất cả bài viết
// Láy tất cả bài viết của tôi
router.route('/my')
    .get(authMiddleware, postController.getMyPosts); // Lấy tất cả bài viết của tôi 

// Sửa, xóa bài viết theo id
router.route('/:id')
    .put(authMiddleware, postController.updatePost) // Sửa bài viết
    .delete(authMiddleware, postController.deletePost) // Xóa bài viết
    .get(authMiddleware, postController.getPostById); // Lấy bài viết theo id
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