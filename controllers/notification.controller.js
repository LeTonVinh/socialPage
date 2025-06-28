// controllers/notification.controller.js
import asyncHandler from 'express-async-handler';
import notificationService from '../services/notification.service.js';

/**
 * Controller Quản lý Thông báo (Notification Controller)
 * Xử lý các request liên quan đến thông báo: lấy danh sách, đánh dấu đã đọc
 */

/**
 * Lấy danh sách thông báo của người dùng với phân trang
 * @route GET /api/notifications
 * @access Private
 * @param {number} [req.query.page=1] - Số trang (mặc định 1)
 * @param {number} [req.query.limit=20] - Số lượng thông báo mỗi trang (mặc định 20)
 * @returns {Object} Danh sách thông báo và thông tin phân trang
 */
const getNotifications = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await notificationService.getUserNotifications(req.user.id, page, limit);
    res.json(result);
});

/**
 * Đánh dấu một thông báo cụ thể là đã đọc
 * @route PUT /api/notifications/:id/read
 * @access Private
 * @param {string} req.params.id - ID thông báo
 * @returns {Object} Thông báo đã đánh dấu đọc thành công
 */
const markNotificationAsRead = asyncHandler(async(req, res) => {
    await notificationService.markAsRead(req.params.id, req.user.id);
    res.json({ message: 'Đã đánh dấu thông báo đã đọc' });
});

/**
 * Đánh dấu tất cả thông báo của người dùng là đã đọc
 * @route PUT /api/notifications/read-all
 * @access Private
 * @returns {Object} Thông báo đã đánh dấu tất cả đã đọc
 */
const markAllNotificationsAsRead = asyncHandler(async(req, res) => {
    await notificationService.markAllAsRead(req.user.id);
    res.json({ message: 'Đã đánh dấu tất cả thông báo đã đọc' });
});

/**
 * Lấy số lượng thông báo chưa đọc của người dùng
 * @route GET /api/notifications/unread-count
 * @access Private
 * @returns {Object} Số lượng thông báo chưa đọc
 */
const getUnreadCount = asyncHandler(async(req, res) => {
    const count = await notificationService.getUnreadCount(req.user.id);
    res.json({ unreadCount: count });
});

export default {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadCount
};