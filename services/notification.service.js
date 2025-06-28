// services/notification.service.js
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

/**
 * Service xử lý các thao tác liên quan đến thông báo
 * Bao gồm: tạo, lấy, đánh dấu đã đọc thông báo
 */

/**
 * Tạo thông báo mới
 * @param {Object} data - Dữ liệu thông báo
 * @param {string} data.recipient - ID người nhận
 * @param {string} data.sender - ID người gửi
 * @param {string} data.type - Loại thông báo
 * @param {string} data.message - Nội dung thông báo
 * @param {string} data.post - ID bài viết (nếu có)
 * @param {string} data.comment - ID bình luận (nếu có)
 * @returns {Object} Thông báo đã tạo
 */
const createNotification = async(data) => {
    return await Notification.create(data);
};

/**
 * Lấy danh sách thông báo của người dùng với phân trang
 * @param {string} userId - ID người dùng
 * @param {number} page - Trang hiện tại (mặc định: 1)
 * @param {number} limit - Số thông báo mỗi trang (mặc định: 20)
 * @returns {Object} Danh sách thông báo và thông tin phân trang
 */
const getUserNotifications = async(userId, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    // Lấy thông báo và populate thông tin người gửi, bài viết
    const notifications = await Notification
        .find({ recipient: userId })
        .populate('sender', 'fullName avatar', User) // Chỉ lấy path + fields cần thiết
        .populate('post', 'content') // Lấy excerpt của bài viết nếu cần
        .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
        .skip(skip)
        .limit(limit);

    // Đếm tổng số thông báo
    const total = await Notification.countDocuments({ recipient: userId });

    // Đếm số thông báo chưa đọc
    const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false
    });

    return {
        notifications,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        unreadCount
    };
};

/**
 * Đánh dấu một thông báo đã đọc
 * @param {string} notificationId - ID thông báo
 * @param {string} userId - ID người dùng
 * @returns {Object} Thông báo đã cập nhật
 */
const markAsRead = async(notificationId, userId) => {
    return await Notification.findOneAndUpdate({ _id: notificationId, recipient: userId }, { isRead: true });
};

/**
 * Đánh dấu tất cả thông báo đã đọc
 * @param {string} userId - ID người dùng
 * @returns {Object} Kết quả cập nhật
 */
const markAllAsRead = async(userId) => {
    return await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
};

/**
 * Lấy số lượng thông báo chưa đọc
 * @param {string} userId - ID người dùng
 * @returns {number} Số lượng thông báo chưa đọc
 */
const getUnreadCount = async(userId) => {
    return await Notification.countDocuments({
        recipient: userId,
        isRead: false
    });
};

export default {
    createNotification,
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount
};