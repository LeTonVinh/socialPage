import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  images: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  likes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  privacy: { type: String, enum: ['public', 'follower', 'private'], default: 'public' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'deleted', 'hidden'], default: 'active' },
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Post', postSchema);