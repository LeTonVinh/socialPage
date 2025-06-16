// repositories/follow.repository.js
// Repository quản lý follow relationships
import Follow from '../models/follow.model.js';

const checkFollowRelationship = async (followerId, followingId) => {
  return await Follow.findOne({ follower: followerId, following: followingId });
};

const getFollowers = async (userId) => {
  return await Follow.find({ following: userId }).populate('follower', 'fullName avatar');
};

const getFollowing = async (userId) => {
  return await Follow.find({ follower: userId }).populate('following', 'fullName avatar');
};

export default { checkFollowRelationship, getFollowers, getFollowing };