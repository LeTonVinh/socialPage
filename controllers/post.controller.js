import asyncHandler from 'express-async-handler';
import postService from '../services/post.service.js';
import Post from '../models/post.model.js';

/**
 * Tạo bài viết mới
 */
const createPost = asyncHandler(async (req, res) => {
  const post = await postService.createPost({ ...req.body, author: req.user.id });
  res.status(201).json({ message: 'Tạo bài viết thành công', post });
});

/**
 * Sửa bài viết
 */
const updatePost = asyncHandler(async (req, res) => {
  const post = await postService.updatePost(req.params.id, req.body, req.user.id);
  if (!post) return res.status(404).json({ message: 'Không tìm thấy hoặc không có quyền sửa' });
  res.json({ message: 'Cập nhật thành công', post });
});

/**
 * Xóa bài viết
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await postService.deletePost(req.params.id, req.user.id);
  if (!post) return res.status(404).json({ message: 'Không tìm thấy hoặc không có quyền xóa' });
  res.json({ message: 'Đã xóa bài viết', post });
});

/**
 * Lấy tất cả bài viết
 */
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await postService.getAllPosts();
  res.json({ posts });
});

/**
 * Like bài viết
 */
const likePost = asyncHandler(async (req, res) => {
  const post = await postService.likePost(req.params.id, req.user.id);
  res.json({ message: 'Đã like', post });
});

/**
 * Unlike bài viết
 */
const unlikePost = asyncHandler(async (req, res) => {
  const post = await postService.unlikePost(req.params.id, req.user.id);
  res.json({ message: 'Đã bỏ like', post });
});

/**
 * View bài viết
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
 * Share bài viết
 */
const sharePost = asyncHandler(async (req, res) => {
  const sharedPost = await postService.sharePost(req.params.id, req.user.id, req.body.content);
  const populatedPost = await Post.findById(sharedPost._id).populate('sharedPost');
  res.json({ message: 'Đã chia sẻ bài viết', post: populatedPost });
});

export default {
  createPost, updatePost, deletePost, getAllPosts,
  likePost, unlikePost, viewPost, sharePost
};