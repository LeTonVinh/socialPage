/**
 * Routes Quản lý Thông báo (Notification Routes)
 * Định nghĩa các endpoint liên quan đến thông báo: lấy danh sách, đánh dấu đã đọc
 */
import express from 'express';
import notificationController from '../controllers/notification.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Lấy danh sách thông báo của người dùng
 * @route GET /api/notifications
 * @access Private
 */
router.get('/', authMiddleware, notificationController.getNotifications);

/**
 * Đánh dấu một thông báo cụ thể là đã đọc
 * @route PUT /api/notifications/:id/read
 * @access Private
 */
router.put('/:id/read', authMiddleware, notificationController.markNotificationAsRead);

/**
 * Đánh dấu tất cả thông báo của người dùng là đã đọc
 * @route PUT /api/notifications/read-all
 * @access Private
 */
router.put('/read-all', authMiddleware, notificationController.markAllNotificationsAsRead);

/**
 * Lấy số lượng thông báo chưa đọc của người dùng
 * @route GET /api/notifications/unread-count
 * @access Private
 */
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);

export default router;