/**
 * Repository Quản lý Theo dõi (Follow Repository)
 * Chứa các hàm truy vấn và thao tác với collection Follow trong database
 */
import Follow from '../models/follow.model.js';

/**
 * Tạo mối quan hệ theo dõi
 * @param {String} followerId - ID người thực hiện theo dõi
 * @param {String} followingId - ID người được theo dõi
 * @returns {Object} Mối quan hệ follow vừa được tạo
 */
const createFollow = async(followerId, followingId) => {
    return await Follow.create({
        follower: followerId,
        following: followingId
    });
};

/**
 * Xóa mối quan hệ theo dõi
 * @param {String} followerId - ID người thực hiện theo dõi
 * @param {String} followingId - ID người được theo dõi
 * @returns {Object|null} Mối quan hệ follow đã xóa hoặc null
 */
const removeFollow = async(followerId, followingId) => {
    return await Follow.findOneAndDelete({
        follower: followerId,
        following: followingId
    });
};

/**
 * Kiểm tra quan hệ theo dõi giữa hai người dùng
 * @param {String} followerId - ID người thực hiện theo dõi
 * @param {String} followingId - ID người được theo dõi
 * @returns {Object|null} Mối quan hệ follow nếu tồn tại
 */
const checkFollowRelationship = async(followerId, followingId) => {
    return await Follow.findOne({
        follower: followerId,
        following: followingId
    });
};

/**
 * Lấy danh sách người theo dõi của một người dùng
 * @param {String} userId - ID người dùng
 * @param {Number} page - Số trang (mặc định 1)
 * @param {Number} limit - Số lượng mỗi trang (mặc định 20)
 * @returns {Object} Danh sách followers và thông tin phân trang
 */
const getFollowers = async(userId, page = 1, limit = 20) => {
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
 * Lấy danh sách người được theo dõi của một người dùng
 * @param {String} userId - ID người dùng
 * @param {Number} page - Số trang (mặc định 1)
 * @param {Number} limit - Số lượng mỗi trang (mặc định 20)
 * @returns {Object} Danh sách following và thông tin phân trang
 */
const getFollowing = async(userId, page = 1, limit = 20) => {
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
 * Lấy thống kê theo dõi của người dùng
 * @param {String} userId - ID người dùng
 * @returns {Object} Thống kê số lượng followers và following
 */
const getFollowStats = async(userId) => {
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
 * Kiểm tra quan hệ theo dõi qua lại (mutual follow)
 * @param {String} userId1 - ID người dùng thứ nhất
 * @param {String} userId2 - ID người dùng thứ hai
 * @returns {Object} Thông tin quan hệ theo dõi qua lại
 */
const checkMutualFollow = async(userId1, userId2) => {
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