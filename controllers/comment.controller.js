/**
 * Controller Quản lý Bình luận (Comment Controller)
 * Xử lý các request liên quan đến bình luận: thêm, xóa, like, reply
 */
import asyncHandler from 'express-async-handler';
import commentService from '../services/comment.service.js';

/**
 * Thêm bình luận vào bài viết
 * @route POST /api/posts/:id/comments
 * @access Private
 * @param {string} req.params.id - ID bài viết
 * @param {string} req.body.content - Nội dung bình luận
 * @param {string} [req.body.parentCommentId] - ID bình luận cha (nếu là reply)
 * @returns {Object} Bình luận vừa được tạo
 */
const addComment = asyncHandler(async(req, res) => {
    const { content, parentCommentId } = req.body;

    // Kiểm tra nội dung bình luận không được để trống
    if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
    }

    const comment = await commentService.addComment(
        req.params.id,
        req.user.id,
        content.trim(),
        parentCommentId
    );

    res.status(201).json({
        message: parentCommentId ? 'Đã trả lời bình luận' : 'Đã bình luận',
        comment
    });
});

/**
 * Lấy danh sách bình luận của bài viết với phân trang
 * @route GET /api/posts/:id/comments
 * @access Private (cần đăng nhập để kiểm tra quyền truy cập)
 * @param {string} req.params.id - ID bài viết
 * @param {number} [req.query.page] - Số trang
 * @param {number} [req.query.limit] - Số lượng bình luận mỗi trang
 * @returns {Object} Danh sách bình luận và thông tin phân trang
 */
const getPostComments = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const result = await commentService.getPostComments(req.params.id, req.user.id, page, limit);

    res.json(result);
});

/**
 * Lấy danh sách replies của một bình luận
 * @route GET /api/comments/:id/replies
 * @access Private
 * @param {string} req.params.id - ID bình luận cha
 * @param {number} [req.query.page] - Số trang
 * @param {number} [req.query.limit] - Số lượng reply mỗi trang
 * @returns {Object} Danh sách replies và thông tin phân trang
 */
const getCommentReplies = asyncHandler(async(req, res) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const result = await commentService.getCommentReplies(req.params.id, req.user.id, page, limit);

    res.json(result);
});

/**
 * Thích/Bỏ thích bình luận
 * @route POST /api/comments/:id/like
 * @access Private
 * @param {string} req.params.id - ID bình luận
 * @returns {Object} Kết quả thao tác like/unlike
 */
const toggleCommentLike = asyncHandler(async(req, res) => {
    const result = await commentService.toggleCommentLike(req.params.id, req.user.id);

    res.json({
        message: result.action === 'liked' ? 'Đã thích bình luận' : 'Đã bỏ thích bình luận',
        ...result
    });
});

/**
 * Xóa bình luận (soft delete)
 * @route DELETE /api/comments/:id
 * @access Private (chỉ tác giả bình luận)
 * @param {string} req.params.id - ID bình luận
 * @returns {Object} Thông báo xóa thành công
 */
const deleteComment = asyncHandler(async(req, res) => {
    const result = await commentService.deleteComment(req.params.id, req.user.id);
    res.json(result);
});

/**
 * Trả lời một bình luận (tạo reply)
 * @route POST /api/comments/:id/reply
 * @access Private
 * @param {string} req.params.id - ID bình luận cha
 * @param {string} req.body.content - Nội dung reply
 * @returns {Object} Reply vừa được tạo
 */
const replyToComment = asyncHandler(async(req, res) => {
    const { content } = req.body;
    const result = await commentService.replyToComment(req.user.id, req.params.id, content);
    res.status(201).json(result);
});

export default {
    addComment,
    getPostComments,
    getCommentReplies,
    toggleCommentLike,
    deleteComment,
    replyToComment
};