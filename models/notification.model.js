
// models/notification.model.js
// Model thông báo cho các hoạt động comment
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người nhận thông báo
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người gửi thông báo
  type: {   
    type: String, 
    enum: ['comment', 'reply', 'like_comment', 'mention', 'follow'], // Các loại thông báo
    required: true 
  },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Bài viết liên quan (nếu có)
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // Bình luận liên quan (nếu có)
  message: { type: String, required: true }, // Nội dung thông báo
  isRead: { type: Boolean, default: false }, // Trạng thái đã đọc
  createdAt: { type: Date, default: Date.now }  // Thời gian tạo thông báo
});

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 }); // Tạo index cho việc tìm kiếm thông báo chưa đọc

export default mongoose.model('Notification', notificationSchema);