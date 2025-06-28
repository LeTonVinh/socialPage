/**
 * Routes Quản lý Bài viết (Post Routes)
 * Định nghĩa các endpoint liên quan đến bài viết: tạo, sửa, xóa, like, share
 */
import express from 'express';
import postController from '../controllers/post.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js'; // Giả sử bạn đã cấu hình multer để upload ảnh

const router = express.Router();

/**
 * Quản lý bài viết chính
 * @route POST /api/posts - Tạo bài viết mới
 * @route GET /api/posts - Lấy danh sách bài viết công khai
 * @access Private
 */
router.route('/')
    .post(authMiddleware, upload.array('images'), postController.createPost)
    .get(authMiddleware, postController.getAllPosts);

/**
 * Lấy tất cả bài viết của người dùng hiện tại
 * @route GET /api/posts/my
 * @access Private
 */
router.route('/my')
    .get(authMiddleware, postController.getMyPosts);

/**
 * Lấy danh sách bài viết của một người dùng cụ thể
 * @route GET /api/posts/user/:userId
 * @access Private
 */
router.route('/user/:userId')
    .get(authMiddleware, postController.getPostsByUser);

/**
 * Quản lý bài viết theo ID
 * @route PUT /api/posts/:id - Cập nhật bài viết
 * @route DELETE /api/posts/:id - Xóa bài viết
 * @route GET /api/posts/:id - Lấy thông tin bài viết
 * @access Private (chỉ tác giả mới được sửa/xóa)
 */
router.route('/:id')
    .put(authMiddleware, upload.array('images'), postController.updatePost)
    .delete(authMiddleware, postController.deletePost)
    .get(authMiddleware, postController.getPostById);

/**
 * Thích bài viết
 * @route POST /api/posts/:id/like
 * @access Private
 */
router.route('/:id/like')
    .post(authMiddleware, postController.likePost);

/**
 * Bỏ thích bài viết
 * @route POST /api/posts/:id/unlike
 * @access Private
 */
router.route('/:id/unlike')
    .post(authMiddleware, postController.unlikePost);

/**
 * Xem bài viết (tăng lượt xem)
 * @route POST /api/posts/:id/view
 * @access Private
 */
router.route('/:id/view')
    .post(authMiddleware, postController.viewPost);

/**
 * Chia sẻ bài viết
 * @route POST /api/posts/:id/share
 * @access Private
 */
router.route('/:id/share')
    .post(authMiddleware, postController.sharePost);

export default router;