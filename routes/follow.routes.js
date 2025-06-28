/**
 * Routes Quản lý Theo dõi (Follow Routes)
 * Định nghĩa các endpoint liên quan đến mối quan hệ theo dõi giữa người dùng
 */
import express from 'express';
import followController from '../controllers/follow.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Theo dõi một người dùng
 * @route POST /api/users/:id/follow
 * @access Private
 */
router.post('/:id/follow', authMiddleware, followController.followUser);

/**
 * Bỏ theo dõi một người dùng
 * @route DELETE /api/users/:id/follow
 * @access Private
 */
router.delete('/:id/follow', authMiddleware, followController.unfollowUser);

/**
 * Lấy danh sách người theo dõi của một người dùng
 * @route GET /api/users/:id/followers
 * @access Public
 */
router.get('/:id/followers', followController.getFollowers);

/**
 * Lấy danh sách người được theo dõi của một người dùng
 * @route GET /api/users/:id/following
 * @access Public
 */
router.get('/:id/following', followController.getFollowing);

/**
 * Lấy thống kê theo dõi của người dùng
 * @route GET /api/users/:id/follow-stats
 * @access Public
 */
router.get('/:id/follow-stats', followController.getFollowStats);

/**
 * Kiểm tra trạng thái theo dõi giữa hai người dùng
 * @route GET /api/users/:id/follow-status
 * @access Private
 */
router.get('/:id/follow-status', authMiddleware, followController.getFollowStatus);

export default router;