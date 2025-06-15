import Post from '../models/post.model.js';

/**
 * Tạo mới một bài viết trong database.
 * @param {Object} data - Dữ liệu bài viết (content, images, author, ...)
 * @returns {Object} Bài viết vừa được tạo.
 */
const create = async (data) => {
  return await Post.create(data);
};

/**
 * Tìm và cập nhật bài viết theo ID và author.
 * Chỉ cho phép tác giả sửa bài viết của mình.
 * @param {String} postId - ID bài viết.
 * @param {String} userId - ID tác giả.
 * @param {Object} updateData - Dữ liệu cập nhật.
 * @returns {Object|null} Bài viết đã cập nhật hoặc null nếu không tìm thấy.
 */
const update = async (postId, userId, updateData) => {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId, status: 'active' },
    { ...updateData, updatedAt: new Date() },
    { new: true }
  );
};

/**
 * Xóa mềm bài viết (chuyển trạng thái sang deleted).
 * Chỉ cho phép tác giả xóa bài viết của mình.
 * @param {String} postId - ID bài viết.
 * @param {String} userId - ID tác giả.
 * @returns {Object|null} Bài viết đã xóa hoặc null nếu không tìm thấy.
 */
const remove = async (postId, userId) => {
  return await Post.findOneAndUpdate(
    { _id: postId, author: userId, status: 'active' },
    { status: 'deleted', updatedAt: new Date() },
    { new: true }
  );
};

/**
 * Lấy bài viết theo ID.
 * @param {String} postId - ID bài viết.
 * @returns {Object|null} Bài viết nếu tìm thấy, ngược lại trả về null.
 */
const findById = async (postId) => {
  return await Post.findById(postId);
};

/**
 * Lấy tất cả bài viết active theo bộ lọc.
 * @param {Object} filter - Điều kiện lọc (ví dụ: theo author, tags, ...)
 * @returns {Array} Danh sách bài viết.
 */
const findAll = async (filter = {}) => {
  return await Post.find({ status: 'active', ...filter })
    .populate('author', 'fullName avatar')
    .sort({ createdAt: -1 });
};

/**
 * Thêm lượt thích cho bài viết.
 * @param {String} postId - ID bài viết.
 * @param {String} userId - ID người dùng thích.
 * @returns {Object|null} Bài viết đã cập nhật hoặc null nếu không tìm thấy.
 */
const addLike = async (postId, userId) => {
  return await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
};

/**
 * Bỏ lượt thích cho bài viết.
 * @param {String} postId - ID bài viết.
 * @param {String} userId - ID người dùng bỏ thích.
 * @returns {Object|null} Bài viết đã cập nhật hoặc null nếu không tìm thấy.
 */
const removeLike = async (postId, userId) => {
  return await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });
};

/**
 * Thêm lượt xem cho bài viết.
 * @param {String} postId - ID bài viết.
 * @param {String} userId - ID người dùng xem.
 * @returns {Object|null} Bài viết đã cập nhật hoặc null nếu không tìm thấy.
 */
const addView = async (postId, userId) => {
  return await Post.findByIdAndUpdate(postId, { $addToSet: { views: userId } }, { new: true });
};

/**
 * Thêm lượt chia sẻ cho bài viết.
 * @param {String} postId - ID bài viết.
 * @param {String} userId - ID người dùng chia sẻ.
 * @returns {Object|null} Bài viết đã cập nhật hoặc null nếu không tìm thấy.
 */
const addShare = async (postId, userId) => {
  return await Post.findByIdAndUpdate(postId, { $addToSet: { shares: userId } }, { new: true });
};

/**
 * Đếm số bài viết của một author trong khoảng thời gian.
 * Dùng để giới hạn số lần đăng bài trong 1 giờ.
 * @param {String} authorId - ID tác giả.
 * @param {Date} fromTime - Thời gian bắt đầu tính.
 * @returns {Number} Số lượng bài viết.
 */
const countByAuthorAndTime = async (authorId, fromTime) => {
  return await Post.countDocuments({
    author: authorId,
    createdAt: { $gte: fromTime },
    status: 'active'
  });
};

export default {
  create,
  update,
  remove,
  findById,
  findAll,
  addLike,
  removeLike,
  addView,
  addShare,
  countByAuthorAndTime
};