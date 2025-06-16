// controllers/follow.controller.js
import asyncHandler from 'express-async-handler';
import followService from '../services/follow.service.js';

/**
 * Follow một user
 * @route POST /users/:id/follow
 * @access Private
 */
const followUser = asyncHandler(async (req, res) => {
  await followService.followUser(req.user.id, req.params.id);
  res.status(201).json({ message: 'Đã follow thành công' });
});

/**
 * Unfollow một user
 * @route DELETE /users/:id/follow
 * @access Private
 */
const unfollowUser = asyncHandler(async (req, res) => {
  const result = await followService.unfollowUser(req.user.id, req.params.id);
  res.json(result);
});

/**
 * Lấy danh sách followers của một user
 * @route GET /users/:id/followers
 * @access Public
 */
const getFollowers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  const result = await followService.getFollowers(req.params.id, page, limit);
  res.json(result);
});

/**
 * Lấy danh sách following của một user
 * @route GET /users/:id/following
 * @access Public
 */
const getFollowing = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  const result = await followService.getFollowing(req.params.id, page, limit);
  res.json(result);
});

/**
 * Lấy thống kê follow của user
 * @route GET /users/:id/follow-stats
 * @access Public
 */
const getFollowStats = asyncHandler(async (req, res) => {
  const stats = await followService.getFollowStats(req.params.id);
  res.json(stats);
});

/**
 * Kiểm tra trạng thái follow
 * @route GET /users/:id/follow-status
 * @access Private
 */
const getFollowStatus = asyncHandler(async (req, res) => {
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