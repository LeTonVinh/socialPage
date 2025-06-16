
// routes/notification.routes.js
import express from 'express';
import notificationController from '../controllers/notification.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Lấy danh sách thông báo
router.get('/', authMiddleware, notificationController.getNotifications);

// Đánh dấu thông báo đã đọc
router.put('/:id/read', authMiddleware, notificationController.markNotificationAsRead);

export default router;
