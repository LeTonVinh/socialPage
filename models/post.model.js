import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: { type: String, required: true }, // Nội dung bài viết
  images: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người đăng bài viết
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo bài viết
  updatedAt: { type: Date, default: Date.now }, // Thời gian cập nhật bài viết
  likes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ], // Người thích bài viết
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Bình luận liên quan đến bài viết
  privacy: { type: String, enum: ['public', 'follower', 'private'], default: 'public' }, // Quyền riêng tư bài viết
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Thẻ gắn với bài viết (có thể là người dùng hoặc chủ đề)
  status: { type: String, enum: ['active', 'deleted', 'hidden'], default: 'active' }, // Trạng thái bài viết
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Người đã xem bài viết
  sharedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Bài viết gốc nếu đây là bài viết chia sẻ
});

export default mongoose.model('Post', postSchema);