
// controllers/notification.controller.js
import asyncHandler from 'express-async-handler';
import notificationService from '../services/notification.service.js';

/**
 * Lấy danh sách thông báo của user
 * @route GET /notifications
 * @access Private
 */
const getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  
  const result = await notificationService.getUserNotifications(req.user.id, page, limit);
  res.json(result);
});

/**
 * Đánh dấu thông báo đã đọc
 * @route PUT /notifications/:id/read
 * @access Private
 */
const markNotificationAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  res.json({ message: 'Đã đánh dấu thông báo đã đọc' });
});

export default { getNotifications, markNotificationAsRead };