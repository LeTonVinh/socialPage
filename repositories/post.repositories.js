// Repository thao tác với collection Post
import Post from '../models/post.model.js';
import Follow from '../models/follow.model.js';
/**
 * Tạo mới một bài viết
 * @param {Object} data - Dữ liệu bài viết (content, images, author, ...)
 * @returns {Object} Bài viết vừa được tạo
 */
const create = async (data) => Post.create(data);

/**
 * Sửa bài viết (chỉ tác giả mới được sửa)
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID tác giả
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object|null} Bài viết đã cập nhật hoặc null nếu không tìm thấy
 */
const update = async (postId, userId, updateData) =>
  Post.findOneAndUpdate(
    { _id: postId, author: userId, status: 'active' },
    { ...updateData, updatedAt: new Date() },
    { new: true }
  );

/**
 * Xóa mềm bài viết (chuyển trạng thái sang deleted)
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID tác giả
 * @returns {Object|null} Bài viết đã xóa hoặc null nếu không tìm thấy
 */
const remove = async (postId, userId) =>
  Post.findOneAndUpdate(
    { _id: postId, author: userId, status: 'active' },
    { status: 'deleted', updatedAt: new Date() },
    { new: true }
  );

/**
 * Lấy bài viết theo ID
 * @param {String} postId - ID bài viết
 * @returns {Object|null} Bài viết nếu tìm thấy, ngược lại trả về null
 */
const findById = async (postId) => Post.findById(postId);

/**
 * Lấy tất cả bài viết active, public (có thể truyền thêm filter)
 * @param {Object} filter - Điều kiện lọc (ví dụ: theo author, tags, ...)
 * @returns {Array} Danh sách bài viết
 */
const findAll = async (filter = {}) =>
  Post.find({ status: 'active', privacy: 'public', ...filter })
    .populate('author', 'fullName avatar')
    .sort({ createdAt: -1 });

// Lấy tất cả bài viết (gốc và share) của chính user
const findAllByCurrentUser = async (userId) =>
  Post.find({ status: 'active', author: userId })
    .populate('sharedPost')
    .sort({ createdAt: -1 });

/**
 * Thêm lượt thích
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID user like
 * @returns {Object|null} Bài viết sau khi like
 */
const addLike = async (postId, userId) =>
  Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });

/**
 * Bỏ lượt thích
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID user bỏ like
 * @returns {Object|null} Bài viết sau khi bỏ like
 */
const removeLike = async (postId, userId) =>
  Post.findByIdAndUpdate(postId, { $pull: { likes: userId } }, { new: true });

/**
 * Thêm lượt xem
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID user xem
 * @returns {Object|null} Bài viết sau khi thêm view
 */
const addView = async (postId, userId) =>
  Post.findByIdAndUpdate(postId, { $addToSet: { views: userId } }, { new: true });

/**
 * Thêm lượt chia sẻ
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID user share
 * @returns {Object|null} Bài viết sau khi share
 */
const addShare = async (postId, userId) =>
  Post.findByIdAndUpdate(postId, { $addToSet: { shares: userId } }, { new: true });

/**
 * Đếm số bài viết của một author trong khoảng thời gian
 * @param {String} authorId - ID tác giả
 * @param {Date} fromTime - Thời gian bắt đầu
 * @returns {Number} Số lượng bài viết
 */
const countByAuthorAndTime = async (authorId, fromTime) =>
  Post.countDocuments({
    author: authorId,
    createdAt: { $gte: fromTime },
    status: 'active'
  });

  
/**
 * Kiểm tra quyền truy cập bài viết
 */
const checkPostAccess = async (postId, userId) => {
  const post = await Post.findById(postId).populate('author', '_id');
  
  if (!post || post.status !== 'active') {
    return { hasAccess: false, reason: 'Post not found or inactive' };
  }
  
  // Nếu là tác giả bài viết
  if (post.author._id.toString() === userId) {
    return { hasAccess: true, post };
  }
  
  // Nếu bài viết là public
  if (post.privacy === 'public') {
    return { hasAccess: true, post };
  }
  
  // Nếu bài viết là private
  if (post.privacy === 'private') {
    return { hasAccess: false, reason: 'Private post' };
  }
  
  // Nếu bài viết là follower only
  if (post.privacy === 'follower') {
    const isFollowing = await Follow.findOne({
      follower: userId,
      following: post.author._id
    });
    
    return { 
      hasAccess: !!isFollowing, 
      post,
      reason: !isFollowing ? 'Must follow author to view' : null
    };
  }
  
  return { hasAccess: false, reason: 'Unknown privacy setting' };
};
export default {
  create,
  update,
  remove,
  findById,
  findAll,
  findAllByCurrentUser,
  addLike,
  removeLike,
  addView,
  addShare,
  countByAuthorAndTime,
  checkPostAccess
};