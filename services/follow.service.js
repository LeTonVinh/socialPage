// services/follow.service.js
import followRepo from '../repositories/follow.repositories.js';
import User from '../models/user.model.js';
import notificationService from './notification.service.js';

/**
 * Service xử lý các thao tác liên quan đến follow/unfollow
 * Bao gồm: follow, unfollow, lấy danh sách followers/following, thống kê
 */

/**
 * Follow một người dùng
 * @param {string} followerId - ID người dùng thực hiện follow
 * @param {string} followingId - ID người dùng được follow
 * @returns {Object} Mối quan hệ follow đã tạo
 */
const followUser = async(followerId, followingId) => {
    // Không thể follow chính mình
    if (followerId === followingId) {
        throw new Error('Bạn không thể follow chính mình');
    }

    // Kiểm tra người dùng được follow có tồn tại không
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

    // Tạo thông báo với message rõ ràng hơn
    await notificationService.createNotification({
        recipient: followingId,
        sender: followerId,
        type: 'new_follower',
        message: 'đã bắt đầu theo dõi bạn'
    });

    return follow;
};

/**
 * Unfollow một người dùng
 * @param {string} followerId - ID người dùng thực hiện unfollow
 * @param {string} followingId - ID người dùng được unfollow
 * @returns {Object} Thông báo kết quả
 */
const unfollowUser = async(followerId, followingId) => {
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
 * Lấy danh sách followers của một người dùng
 * @param {string} userId - ID người dùng
 * @param {number} page - Trang hiện tại (mặc định: 1)
 * @param {number} limit - Số followers mỗi trang (mặc định: 20)
 * @returns {Object} Danh sách followers và thông tin phân trang
 */
const getFollowers = async(userId, page = 1, limit = 20) => {
    return await followRepo.getFollowers(userId, page, limit);
};

/**
 * Lấy danh sách following của một người dùng
 * @param {string} userId - ID người dùng
 * @param {number} page - Trang hiện tại (mặc định: 1)
 * @param {number} limit - Số following mỗi trang (mặc định: 20)
 * @returns {Object} Danh sách following và thông tin phân trang
 */
const getFollowing = async(userId, page = 1, limit = 20) => {
    return await followRepo.getFollowing(userId, page, limit);
};

/**
 * Lấy thống kê follow của một người dùng
 * @param {string} userId - ID người dùng
 * @returns {Object} Thống kê số lượng followers và following
 */
const getFollowStats = async(userId) => {
    return await followRepo.getFollowStats(userId);
};

/**
 * Kiểm tra trạng thái follow giữa 2 người dùng
 * @param {string} currentUserId - ID người dùng hiện tại
 * @param {string} targetUserId - ID người dùng mục tiêu
 * @returns {Object} Trạng thái follow giữa 2 người dùng
 */
const getFollowStatus = async(currentUserId, targetUserId) => {
    // Nếu xem profile của chính mình
    if (currentUserId === targetUserId) {
        return { isOwnProfile: true };
    }

    // Kiểm tra mối quan hệ follow hai chiều
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