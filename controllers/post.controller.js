import postService from '../services/post.service.js';

/**
 * Tạo bài viết mới
 */
const createPost = async (req, res) => {
  const post = await postService.createPost({ ...req.body, author: req.user.id });
  res.status(201).json({ message: 'Tạo bài viết thành công', post });
};

/**
 * Sửa bài viết
 */
const updatePost = async (req, res) => {
  const post = await postService.updatePost(req.params.id, req.body, req.user.id);
  if (!post) return res.status(404).json({ message: 'Không tìm thấy hoặc không có quyền sửa' });
  res.json({ message: 'Cập nhật thành công', post });
};

/**
 * Xóa bài viết
 */
const deletePost = async (req, res) => {
  const post = await postService.deletePost(req.params.id, req.user.id);
  if (!post) return res.status(404).json({ message: 'Không tìm thấy hoặc không có quyền xóa' });
  res.json({ message: 'Đã xóa bài viết', post });
};

/**
 * Lấy tất cả bài viết
 */
const getAllPosts = async (req, res) => {
  const posts = await postService.getAllPosts();
  res.json({ posts });
};

/**
 * Like bài viết
 */
const likePost = async (req, res) => {
  const post = await postService.likePost(req.params.id, req.user.id);
  res.json({ message: 'Đã like', post });
};

/**
 * Unlike bài viết
 */
const unlikePost = async (req, res) => {
  const post = await postService.unlikePost(req.params.id, req.user.id);
  res.json({ message: 'Đã bỏ like', post });
};

/**
 * View bài viết
 */
const viewPost = async (req, res) => {
  await postService.viewPost(req.params.id, req.user.id);
  res.json({ message: 'Đã xem bài viết' });
};

/**
 * Share bài viết
 */
const sharePost = async (req, res) => {
  const post = await postService.sharePost(req.params.id, req.user.id);
  res.json({ message: 'Đã chia sẻ', post });
};

export default {
  createPost, updatePost, deletePost, getAllPosts,
  likePost, unlikePost, viewPost, sharePost
};