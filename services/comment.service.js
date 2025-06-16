// services/comment.service.js
// Service xử lý logic nghiệp vụ bình luận bài viết
import commentRepo from '../repositories/comment.repositories.js';

/**
 * Thêm bình luận cho bài viết
 * @param {String} postId - ID bài viết
 * @param {String} userId - ID người bình luận
 * @param {String} content - Nội dung bình luận
 * @returns {Object} Bình luận vừa được tạo
 */
const addComment = async (postId, userId, content) => {
  return await commentRepo.create({ post: postId, author: userId, content });
};

/**
 * Lấy danh sách bình luận của một bài viết
 * @param {String} postId - ID bài viết
 * @returns {Array} Danh sách bình luận
 */
const getComments = async (postId) => {
  return await commentRepo.findByPost(postId);
};

export default { addComment, getComments };