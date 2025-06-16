// routes/follow.routes.js
import express from 'express';
import followController from '../controllers/follow.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Follow/Unfollow user
router.post('/:id/follow', authMiddleware, followController.followUser);
router.delete('/:id/follow', authMiddleware, followController.unfollowUser);

// Lấy danh sách followers/following
router.get('/:id/followers', followController.getFollowers);
router.get('/:id/following', followController.getFollowing);

// Thống kê và trạng thái follow
router.get('/:id/follow-stats', followController.getFollowStats);
router.get('/:id/follow-status', authMiddleware, followController.getFollowStatus);

export default router;