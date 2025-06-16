// Controller quản lý các thao tác với bài viết
import asyncHandler from 'express-async-handler';
import postService from '../services/post.service.js';
import Post from '../models/post.model.js';

/**
 * Tạo bài viết mới
 * @route POST /posts
 * @access Private
 */
const createPost = asyncHandler(async (req, res) => {
  // Gọi service để tạo bài viết, truyền thêm author từ token
  const post = await postService.createPost({ ...req.body, author: req.user.id });
  res.status(201).json({ message: 'Tạo bài viết thành công', post });
});

/**
 * Sửa bài viết
 * @route PUT /posts/:id
 * @access Private (chỉ tác giả)
 */
const updatePost = asyncHandler(async (req, res) => {
  // Chỉ tác giả mới được sửa bài viết
  const post = await postService.updatePost(req.params.id, req.body, req.user.id);
  if (!post) return res.status(404).json({ message: 'Không tìm thấy hoặc không có quyền sửa' });
  res.json({ message: 'Cập nhật thành công', post });
});

/**
 * Xóa bài viết (soft delete)
 * @route DELETE /posts/:id
 * @access Private (chỉ tác giả)
 */
const deletePost = asyncHandler(async (req, res) => {
  // Chỉ tác giả mới được xóa bài viết
  const post = await postService.deletePost(req.params.id, req.user.id);
  if (!post) return res.status(404).json({ message: 'Không tìm thấy hoặc không có quyền xóa' });
  res.json({ message: 'Đã xóa bài viết', post });
});

/**
 * Lấy tất cả bài viết (chỉ lấy bài active, public)
 * @route GET /posts
 * @access Public
 */
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getAllPosts();
  res.json({ posts });
});

/**
 * Lấy tất cả bài viết của tôi
 * @route GET /posts/my
 * @access Private
 */
const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getMyPosts(req.user.id);
  res.json({ posts });
});

/**
 * Like bài viết
 * @route POST /posts/:id/like
 * @access Private
 */
const likePost = asyncHandler(async (req, res) => {
  const post = await postService.likePost(req.params.id, req.user.id);
  res.json({ message: 'Đã like', post });
});

/**
 * Unlike bài viết
 * @route POST /posts/:id/unlike
 * @access Private
 */
const unlikePost = asyncHandler(async (req, res) => {
  const post = await postService.unlikePost(req.params.id, req.user.id);
  res.json({ message: 'Đã bỏ like', post });
});

/**
 * View bài viết (tăng lượt xem)
 * @route POST /posts/:id/view
 * @access Private
 */
const viewPost = asyncHandler(async (req, res) => {
  try {
    const post = await postService.viewPost(req.params.id, req.user.id);
    res.json({ message: 'Đã xem bài viết', views: post.views.length });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
});

/**
 * Share bài viết (tạo bài share mới, trả về cả bài gốc)
 * @route POST /posts/:id/share
 * @access Private
 */
const sharePost = asyncHandler(async (req, res) => {
  const sharedPost = await postService.sharePost(req.params.id, req.user.id, req.body.content);
  // Populate trường sharedPost để trả về cả bài gốc
  const populatedPost = await Post.findById(sharedPost._id).populate('sharedPost');
  res.json({ message: 'Đã chia sẻ bài viết', post: populatedPost });
});

export default {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getMyPosts,
  likePost,
  unlikePost,
  viewPost,
  sharePost
};