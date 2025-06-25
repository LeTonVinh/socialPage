// services/notification.service.js
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

/**
 * Tạo thông báo mới
 */
const createNotification = async(data) => {
    return await Notification.create(data);
};

/**
 * Lấy danh sách thông báo của user
 */
const getUserNotifications = async(userId, page = 1, limit = 20) => {
        const skip = (page - 1) * limit

        // Lấy notifications và populate đúng sender, post
        const notifications = await Notification
            .find({ recipient: userId })
            .populate('sender', 'fullName avatar', User) // chỉ path + fields
            .populate('post', 'content') // nếu cần hiện excerpt của post
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const total = await Notification.countDocuments({ recipient: userId })
        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        })

        return {
            notifications,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            unreadCount
        }
    }
    /**
     * Đánh dấu thông báo đã đọc
     */
const markAsRead = async(notificationId, userId) => {
    return await Notification.findOneAndUpdate({ _id: notificationId, recipient: userId }, { isRead: true });
};

/**
 * Đánh dấu tất cả thông báo đã đọc
 */
const markAllAsRead = async(userId) => {
    return await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
};

/**
 * Lấy số lượng thông báo chưa đọc
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