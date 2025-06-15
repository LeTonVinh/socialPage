import Post from '../models/post.model.js';

/**
 * Tạo mới bài viết
 */
const create = async (data) => {
  return await Post.create(data);
};

/**
 * Tìm và cập nhật bài viết theo id và author
 */
const update = async (postId, userId, updateData) => {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId, status: 'active' },
    { ...updateData, updatedAt: new Date() },
    { new: true }
  );
};

/**
 * Xóa mềm bài viết (chuyển trạng thái)
 */
const remove = async (postId, userId) => {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId, status: 'active' },
    { status: 'deleted', updatedAt: new Date() },
    { new: true }
  );
};

/**
 * Lấy bài viết theo id
 */
const findById = async (postId) => {
  return await Post.findById(postId);
};

/**
 * Lấy tất cả bài viết active
 */
const findAll = async (filter = {}) => {
  return await Post.find({ status: 'active', ...filter })
    .populate('author', 'fullName avatar')
    .sort({ createdAt: -1 });
};

/**
 * Thêm lượt thích
 */
const addLike = async (postId, userId) => {
  return await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
};

/**
 * Bỏ lượt thích
 */
const removeLike = async (postId, userId) => {
  return await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
};

/**
 * Thêm lượt xem
 */
const addView = async (postId, userId) => {
  return await Post.findByIdAndUpdate(postId, { $addToSet: { views: userId } }, { new: true });
};

/**
 * Thêm lượt chia sẻ
 */
const addShare = async (postId, userId) => {
  return await Post.findByIdAndUpdate(postId, { $addToSet: { shares: userId } }, { new: true });
};

/**
 * Đếm số bài viết của author trong khoảng thời gian
 */
const countByAuthorAndTime = async (authorId, fromTime) => {
  return await Post.countDocuments({
    author: authorId,
    createdAt: { $gte: fromTime },
    status: 'active'
  });
};

export default {
  create, update, remove, findById, findAll, addLike, removeLike, addView, addShare, countByAuthorAndTime
};