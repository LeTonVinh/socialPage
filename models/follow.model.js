// models/follow.model.js
// Model quản lý mối quan hệ follow giữa các user
import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người follow
  following: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người được follow
  createdAt: { type: Date, default: Date.now }
});

// Đảm bảo một user không thể follow một người nhiều lần
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export default mongoose.model('Follow', followSchema);
