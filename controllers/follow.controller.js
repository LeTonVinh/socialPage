// controllers/follow.controller.js
import asyncHandler from 'express-async-handler';
import followService from '../services/follow.service.js';

/**
 * Controller Quản lý Theo dõi (Follow Controller)
 * Xử lý các request liên quan đến mối quan hệ theo dõi giữa người dùng
 */

/**
 * Theo dõi một người dùng
 * @route POST /api/users/:id/follow
 * @access Private
 * @param {string} req.params.id - ID người dùng cần theo dõi
 * @returns {Object} Thông báo theo dõi thành công
 */
const followUser = asyncHandler(async(req, res) => {
    await followService.followUser(req.user.id, req.params.id);
    res.status(201).json({ message: 'Đã follow thành công' });
});

/**
 * Bỏ theo dõi một người dùng
 * @route DELETE /api/users/:id/follow
 * @access Private
 * @param {string} req.params.id - ID người dùng cần bỏ theo dõi
 * @returns {Object} Thông báo bỏ theo dõi thành công
 */
const unfollowUser = asyncHandler(async(req, res) => {
    const result = await followService.unfollowUser(req.user.id, req.params.id);
    res.json(result);
});

/**
 * Lấy danh sách người theo dõi của một người dùng
 * @route GET /api/users/:id/followers
 * @access Public
 * @param {string} req.params.id - ID người dùng
 * @param {number} [req.query.page=1] - Số trang (mặc định 1)
 * @param {number} [req.query.limit=20] - Số lượng mỗi trang (mặc định 20)
 * @returns {Object} Danh sách followers và thông tin phân trang
 */
const getFollowers = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await followService.getFollowers(req.params.id, page, limit);
    res.json(result);
});

/**
 * Lấy danh sách người được theo dõi của một người dùng
 * @route GET /api/users/:id/following
 * @access Public
 * @param {string} req.params.id - ID người dùng
 * @param {number} [req.query.page=1] - Số trang (mặc định 1)
 * @param {number} [req.query.limit=20] - Số lượng mỗi trang (mặc định 20)
 * @returns {Object} Danh sách following và thông tin phân trang
 */
const getFollowing = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await followService.getFollowing(req.params.id, page, limit);
    res.json(result);
});

/**
 * Lấy thống kê theo dõi của người dùng
 * @route GET /api/users/:id/follow-stats
 * @access Public
 * @param {string} req.params.id - ID người dùng
 * @returns {Object} Thống kê số lượng followers và following
 */
const getFollowStats = asyncHandler(async(req, res) => {
    const stats = await followService.getFollowStats(req.params.id);
    res.json(stats);
});

/**
 * Kiểm tra trạng thái theo dõi giữa hai người dùng
 * @route GET /api/users/:id/follow-status
 * @access Private
 * @param {string} req.params.id - ID người dùng cần kiểm tra
 * @returns {Object} Trạng thái theo dõi (đang follow hay chưa)
 */
const getFollowStatus = asyncHandler(async(req, res) => {
    const status = await followService.getFollowStatus(req.user.id, req.params.id);
    res.json(status);
});

export default {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowStats,
    getFollowStatus
};