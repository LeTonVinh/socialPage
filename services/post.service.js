import postRepo from '../repositories/post.repositories.js';
import dotenv from 'dotenv';
dotenv.config();

const MAX_CONTENT_LENGTH = parseInt(process.env.MAX_CONTENT_LENGTH); // Giới hạn độ dài nội dung bài viết lấy từ biến môi trường
const MAX_IMAGES = parseInt(process.env.MAX_IMAGES); // Giới hạn số lượng ảnh đính kèm lấy từ biến môi trường
const MAX_POSTS_PER_HOUR = parseInt(process.env.MAX_POSTS_PER_HOUR); // Giới hạn số bài đăng trong 1 giờ lấy từ biến môi trường
/**
 * Thêm bài viết mới
 * @param {Object} postData - Dữ liệu bài viết
 * @returns {Object} Bài viết đã tạo
 */
const createPost = async (postData) => {
  // Giới hạn độ dài content
  if (!postData.content || postData.content.length > MAX_CONTENT_LENGTH) {
    throw new Error(`Nội dung bài viết tối đa ${MAX_CONTENT_LENGTH} ký tự.`);
  }

  // Giới hạn số lượng ảnh
  if (postData.images && postData.images.length > MAX_IMAGES) {
    throw new Error(`Chỉ được đính kèm tối đa ${MAX_IMAGES} ảnh.`);
  }

  // Giới hạn số lần đăng bài trong 1 giờ
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const count = await postRepo.countByAuthorAndTime(postData.author, oneHourAgo);
  if (count >= MAX_POSTS_PER_HOUR) {
    throw new Error(`Bạn chỉ được đăng tối đa ${MAX_POSTS_PER_HOUR} bài/giờ.`);
  }

  return await postRepo.create(postData);
};

/**
 * Sửa bài viết
 * @param {String} postId - ID bài viết
 * @param {Object} updateData - Dữ liệu cập nhật
 * @param {String} userId - ID người dùng (kiểm tra quyền sửa)
 * @returns {Object|null} Bài viết đã cập nhật hoặc null nếu không tìm thấy/quyền không hợp lệ
 */
const updatePost = async (postId, updateData, userId) =>
  postRepo.update(postId, userId, updateData);

/**
 * Xóa bài viết (chuyển trạng thái sang deleted)
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng (kiểm tra quyền xóa)
 * @returns {Object|null} Bài viết đã xóa hoặc null nếu không tìm thấy/quyền không hợp lệ
 */
const deletePost = async (postId, userId) => postRepo.remove(postId, userId);

/**
 * Lấy tất cả bài viết (chỉ lấy bài active)
 * @param {Object} filter - Bộ lọc (nếu cần)
 * @returns {Array} Danh sách bài viết
 */
const getAllPosts = async (filter = {}) => postRepo.findAll(filter);

/**
 * Thích bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng
 * @returns {Object|null} Bài viết đã cập nhật (thêm lượt thích) hoặc null nếu không tìm thấy
 */
const likePost = async (postId, userId) => {
  const post = await postRepo.addLike(postId, userId);
  /*if (post && post.author.toString() !== userId) {
    await notificationService.create({
      user: post.author,
      type: 'like',
      from: userId,
      post: postId
    });
  }*/
  return post;
};

/**
 * Bỏ thích bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng
 * @returns {Object|null} Bài viết đã cập nhật (bỏ lượt thích) hoặc null nếu không tìm thấy
 */
const unlikePost = async (postId, userId) => postRepo.removeLike(postId, userId);

/**
 * Xem bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng
 * @returns {Object|null} Bài viết đã cập nhật (thêm lượt xem) hoặc null nếu không tìm thấy
 */
const viewPost = async (postId, userId) => {
  const post = await postRepo.findById(postId);
  if (!post || post.status !== 'active') throw new Error('Bài viết không tồn tại');
  if (post.privacy === 'private' && post.author.toString() !== userId)
    throw new Error('Không có quyền xem bài viết này');
  if (post.privacy === 'follower' && post.author.toString() !== userId) {
    // TODO: Kiểm tra userId có phải follower của author không
    // Nếu chưa có logic này, tạm thời chỉ cho phép author xem
    throw new Error('Chỉ follower mới được xem bài viết này');
  }
  return await postRepo.addView(postId, userId);
};

/**
 * Chia sẻ bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người dùng
 * @returns {Object|null} Bài viết đã chia sẻ hoặc null nếu không tìm thấy
 */
const sharePost = async (postId, userId) => {
  const post = await postRepo.findById(postId);
  if (!post || post.status !== 'active') throw new Error('Bài viết không tồn tại hoặc đã bị xóa');
  if (post.privacy !== 'public') throw new Error('Chỉ có thể chia sẻ bài viết công khai');
  // Nếu qua kiểm tra, mới cho phép share
  return await postRepo.addShare(postId, userId);
};

export default {
  createPost, updatePost, deletePost, getAllPosts,
  likePost, unlikePost, viewPost, sharePost
};