// services/follow.service.js
import followRepo from '../repositories/follow.repositories.js';
import User from '../models/user.model.js';
import notificationService from './notification.service.js';

/**
 * Follow một user
 */
const followUser = async (followerId, followingId) => {
  // Không thể follow chính mình
  if (followerId === followingId) {
    throw new Error('Bạn không thể follow chính mình');
  }
  
  // Kiểm tra user được follow có tồn tại không
  const targetUser = await User.findById(followingId);
  if (!targetUser) {
    throw new Error('Người dùng không tồn tại');
  }
  
  // Kiểm tra đã follow chưa
  const existingFollow = await followRepo.checkFollowRelationship(followerId, followingId);
  if (existingFollow) {
    throw new Error('Bạn đã follow người này rồi');
  }
  
  // Tạo mối quan hệ follow
  const follow = await followRepo.createFollow(followerId, followingId);
  
  // Tạo thông báo
  await notificationService.createNotification({
    recipient: followingId,
    sender: followerId,
    type: 'follow',
    message: 'đã bắt đầu theo dõi bạn'
  });
  
  return follow;
};

/**
 * Unfollow một user
 */
const unfollowUser = async (followerId, followingId) => {
  // Kiểm tra có follow không
  const existingFollow = await followRepo.checkFollowRelationship(followerId, followingId);
  if (!existingFollow) {
    throw new Error('Bạn chưa follow người này');
  }
  
  // Xóa mối quan hệ follow
  await followRepo.removeFollow(followerId, followingId);
  
  return { message: 'Đã unfollow thành công' };
};

/**
 * Lấy danh sách followers
 */
const getFollowers = async (userId, page = 1, limit = 20) => {
  return await followRepo.getFollowers(userId, page, limit);
};

/**
 * Lấy danh sách following
 */
const getFollowing = async (userId, page = 1, limit = 20) => {
  return await followRepo.getFollowing(userId, page, limit);
};

/**
 * Lấy thống kê follow
 */
const getFollowStats = async (userId) => {
  return await followRepo.getFollowStats(userId);
};

/**
 * Kiểm tra trạng thái follow giữa 2 user
 */
const getFollowStatus = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    return { isOwnProfile: true };
  }
  
  const relationship = await followRepo.checkMutualFollow(currentUserId, targetUserId);
  
  return {
    isFollowing: relationship.user1FollowsUser2,
    isFollower: relationship.user2FollowsUser1,
    isMutual: relationship.isMutual
  };
};

export default {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStats,
  getFollowStatus
};
