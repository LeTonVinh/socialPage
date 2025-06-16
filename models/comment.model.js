// models/comment.model.js - Enhanced version
// Model bình luận với khả năng reply (nested comments)
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Nội dung bình luận
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người bình luận
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Bài viết liên quan
  
  // Thêm khả năng reply comment
  parentComment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment', 
    default: null // null = comment gốc, có giá trị = reply comment
  },
  
  // Đếm số lượng replies
  replyCount: { type: Number, default: 0 },
  
  // Likes cho comment
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Trạng thái comment
  status: { type: String, enum: ['active', 'deleted', 'hidden'], default: 'active' },
  
  // Thời gian
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index để tối ưu query
commentSchema.index({ post: 1, parentComment: 1, createdAt: 1 });
commentSchema.index({ author: 1 });

export default mongoose.model('Comment', commentSchema);