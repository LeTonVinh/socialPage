
// services/notification.service.js
import Notification from '../models/notification.model.js';

/**
 * Tạo thông báo mới
 */
const createNotification = async (data) => {
  return await Notification.create(data);
};

/**
 * Lấy danh sách thông báo của user
 */
const getUserNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const notifications = await Notification.find({ recipient: userId })
    .populate('sender', 'fullName avatar')
    .populate('post', 'content')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const unreadCount = await Notification.countDocuments({ 
    recipient: userId, 
    isRead: false 
  });
  
  return { notifications, unreadCount };
};

/**
 * Đánh dấu thông báo đã đọc
 */
const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true }
  );
};

export default { createNotification, getUserNotifications, markAsRead };