// repositories/comment.repositories.js
// Repository thao tác với collection Comment
import Comment from '../models/comment.model.js';

/**
 * Tạo mới một bình luận
 * @param {Object} data - Dữ liệu bình luận (content, author, post)
 * @returns {Object} Bình luận vừa được tạo
 */
const create = async (data) => Comment.create(data);

/**
 * Lấy danh sách bình luận của một bài viết
 * @param {String} postId - ID bài viết
 * @returns {Array} Danh sách bình luận, đã populate thông tin author
 */
const findByPost = async (postId) =>
  Comment.find({ post: postId })
    .populate('author', 'fullName avatar')
    .sort({ createdAt: 1 });

export default { create, findByPost };