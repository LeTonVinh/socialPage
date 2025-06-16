// repositories/follow.repository.js - Complete version
import Follow from '../models/follow.model.js';

/**
 * Tạo mối quan hệ follow
 */
const createFollow = async (followerId, followingId) => {
  return await Follow.create({
    follower: followerId,
    following: followingId
  });
};

/**
 * Xóa mối quan hệ follow
 */
const removeFollow = async (followerId, followingId) => {
  return await Follow.findOneAndDelete({
    follower: followerId,
    following: followingId
  });
};

/**
 * Kiểm tra quan hệ follow
 */
const checkFollowRelationship = async (followerId, followingId) => {
  return await Follow.findOne({ 
    follower: followerId, 
    following: followingId 
  });
};

/**
 * Lấy danh sách followers của một user
 */
const getFollowers = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const followers = await Follow.find({ following: userId })
    .populate('follower', 'fullName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const totalFollowers = await Follow.countDocuments({ following: userId });
  
  return {
    followers: followers.map(f => f.follower),
    totalFollowers,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalFollowers / limit),
      hasNext: page * limit < totalFollowers
    }
  };
};

/**
 * Lấy danh sách following của một user
 */
const getFollowing = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const following = await Follow.find({ follower: userId })
    .populate('following', 'fullName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const totalFollowing = await Follow.countDocuments({ follower: userId });
  
  return {
    following: following.map(f => f.following),
    totalFollowing,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalFollowing / limit),
      hasNext: page * limit < totalFollowing
    }
  };
};

/**
 * Lấy thống kê follow của user
 */
const getFollowStats = async (userId) => {
  const [followerCount, followingCount] = await Promise.all([
    Follow.countDocuments({ following: userId }),
    Follow.countDocuments({ follower: userId })
  ]);
  
  return {
    followers: followerCount,
    following: followingCount
  };
};

/**
 * Kiểm tra quan hệ follow qua lại (mutual follow)
 */
const checkMutualFollow = async (userId1, userId2) => {
  const [follow1, follow2] = await Promise.all([
    Follow.findOne({ follower: userId1, following: userId2 }),
    Follow.findOne({ follower: userId2, following: userId1 })
  ]);
  
  return {
    user1FollowsUser2: !!follow1,
    user2FollowsUser1: !!follow2,
    isMutual: !!follow1 && !!follow2
  };
};

export default { 
  createFollow,
  removeFollow,
  checkFollowRelationship, 
  getFollowers, 
  getFollowing,
  getFollowStats,
  checkMutualFollow
};