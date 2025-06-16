// models/comment.model.js
// Định nghĩa schema cho bình luận bài viết
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Nội dung bình luận
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người bình luận
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },   // Bài viết được bình luận
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo
  updatedAt: { type: Date, default: Date.now }  // Thời gian cập nhật
});

export default mongoose.model('Comment', commentSchema);