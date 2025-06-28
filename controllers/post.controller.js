/**
 * Controller Quản lý Bài viết (Post Controller)
 * Xử lý các request liên quan đến bài viết: tạo, sửa, xóa, like, share
 */
import asyncHandler from 'express-async-handler';
import postService from '../services/post.service.js';
import Post from '../models/post.model.js';

/**
 * Tạo bài viết mới
 * @route POST /api/posts
 * @access Private
 * @param {Object} req.body - Dữ liệu bài viết (content, privacy, tags)
 * @param {Array} req.files - Danh sách file hình ảnh
 * @returns {Object} Bài viết vừa được tạo
 */
const createPost = asyncHandler(async(req, res) => {
    let images = [];
    if (req.files && req.files.length > 0) {
        // Lấy đường dẫn các file hình ảnh từ multer upload
        images = req.files.map(f => f.path);
    }

    const post = await postService.createPost({
        ...req.body,
        images, // Lưu mảng URL ảnh
        author: req.user.id
    });

    res.status(201).json({ message: 'Tạo bài viết thành công', post });
});

/**
 * Cập nhật bài viết
 * @route PUT /api/posts/:id
 * @access Private (chỉ tác giả)
 * @param {string} req.params.id - ID bài viết
 * @param {Object} req.body - Dữ liệu cập nhật
 * @param {Array} req.files - Danh sách file hình ảnh mới
 * @returns {Object} Bài viết đã được cập nhật
 */
const updatePost = asyncHandler(async(req, res) => {
    let images = [];
    if (req.files && req.files.length > 0) {
        images = req.files.map(f => f.path);
    }

    // Chỉ tác giả mới được sửa bài viết
    const post = await postService.updatePost(req.params.id, req.body, req.user.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy hoặc không có quyền sửa' });
    res.json({ message: 'Cập nhật thành công', post });
});

/**
 * Xóa bài viết (soft delete)
 * @route DELETE /api/posts/:id
 * @access Private (chỉ tác giả)
 * @param {string} req.params.id - ID bài viết
 * @returns {Object} Bài viết đã được xóa
 */
const deletePost = asyncHandler(async(req, res) => {
    // Chỉ tác giả mới được xóa bài viết
    const post = await postService.deletePost(req.params.id, req.user.id);
    if (!post) return res.status(404).json({ message: 'Không tìm thấy hoặc không có quyền xóa' });
    res.json({ message: 'Đã xóa bài viết', post });
});

/**
 * Lấy danh sách bài viết công khai với phân trang
 * @route GET /api/posts
 * @access Public
 * @param {number} [req.query.page=1] - Số trang (mặc định 1)
 * @param {number} [req.query.limit=10] - Số lượng bài viết mỗi trang (mặc định 10)
 * @returns {Object} Danh sách bài viết và thông tin phân trang
 */
const getAllPosts = asyncHandler(async(req, res) => {
    const { page, limit } = req.query;
    const result = await postService.getPaginatedPosts({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
    });
    res.status(200).json(result);
});

/**
 * Lấy tất cả bài viết của người dùng hiện tại
 * @route GET /api/posts/my
 * @access Private
 * @returns {Array} Danh sách bài viết của người dùng
 */
const getMyPosts = asyncHandler(async(req, res) => {
    const posts = await postService.getMyPosts(req.user.id);
    res.json({ posts });
});

/**
 * Thích bài viết
 * @route POST /api/posts/:id/like
 * @access Private
 * @param {string} req.params.id - ID bài viết
 * @returns {Object} Bài viết đã được thích
 */
const likePost = asyncHandler(async(req, res) => {
    const post = await postService.likePost(req.params.id, req.user.id);
    res.json({ message: 'Đã like', post });
});

/**
 * Bỏ thích bài viết
 * @route POST /api/posts/:id/unlike
 * @access Private
 * @param {string} req.params.id - ID bài viết
 * @returns {Object} Bài viết đã bỏ thích
 */
const unlikePost = asyncHandler(async(req, res) => {
    const post = await postService.unlikePost(req.params.id, req.user.id);
    res.json({ message: 'Đã bỏ like', post });
});

/**
 * Xem bài viết (tăng lượt xem)
 * @route POST /api/posts/:id/view
 * @access Private
 * @param {string} req.params.id - ID bài viết
 * @returns {Object} Số lượt xem hiện tại
 */
const viewPost = asyncHandler(async(req, res) => {
    try {
        const post = await postService.viewPost(req.params.id, req.user.id);
        res.json({ message: 'Đã xem bài viết', views: post.views.length });
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
});

/**
 * Chia sẻ bài viết (tạo bài viết mới tham chiếu đến bài gốc)
 * @route POST /api/posts/:id/share
 * @access Private
 * @param {string} req.params.id - ID bài viết gốc
 * @param {string} req.body.content - Nội dung chia sẻ
 * @returns {Object} Bài viết chia sẻ với thông tin bài gốc
 */
const sharePost = asyncHandler(async(req, res) => {
    const sharedPost = await postService.sharePost(req.params.id, req.user.id, req.body.content);
    // Populate trường sharedPost để trả về cả bài gốc
    const populatedPost = await Post.findById(sharedPost._id).populate('sharedPost');
    res.json({ message: 'Đã chia sẻ bài viết', post: populatedPost });
});

/**
 * Lấy thông tin chi tiết bài viết theo ID
 * @route GET /api/posts/:id
 * @access Private
 * @param {string} req.params.id - ID bài viết
 * @returns {Object} Thông tin chi tiết bài viết
 */
const getPostById = asyncHandler(async(req, res) => {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
        res.status(404);
        throw new Error('Không tìm thấy bài viết');
    }
    res.json(post);
});

/**
 * Lấy danh sách bài viết của một người dùng cụ thể
 * @route GET /api/posts/user/:userId
 * @access Private
 * @param {string} req.params.userId - ID người dùng
 * @returns {Array} Danh sách bài viết đã được lọc theo quyền riêng tư
 */
const getPostsByUser = asyncHandler(async(req, res) => {
    const targetUserId = req.params.userId;
    const viewerId = req.user.id; // từ authMiddleware
    const posts = await postService.getPostsByUser(targetUserId, viewerId);
    res.json({ posts });
});

export default {
    createPost,
    getAllPosts,
    getMyPosts,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    viewPost,
    sharePost,
    getPostById,
    getPostsByUser
};