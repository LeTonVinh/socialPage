/**
 * Routes Quản lý Người dùng (User Routes)
 * Định nghĩa các endpoint liên quan đến người dùng: đăng ký, đăng nhập, cập nhật thông tin
 */
import express from 'express';
import {
    register,
    login,
    changePassword,
    updateAvatar,
    updateCoverImage,
    getProfile,
    updateProfile,
    getUserDetail,
    searchUsers
} from '../controllers/user.controller.js';
import validateRegister from '../middlewares/validateRegister.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';

const router = express.Router();

/**
 * Đăng ký tài khoản mới
 * @route POST /api/auth/register
 * @access Public
 */
router.route('/register')
    .post(validateRegister, register);

/**
 * Đăng nhập vào hệ thống
 * @route POST /api/auth/login
 * @access Public
 */
router.route('/login')
    .post(login);

/**
 * Thay đổi mật khẩu người dùng
 * @route POST /api/auth/change-password
 * @access Private
 */
router.route('/change-password')
    .post(authMiddleware, changePassword);

/**
 * Cập nhật ảnh đại diện người dùng
 * @route PUT /api/users/avatar
 * @access Private
 */
router.route('/avatar')
    .put(authMiddleware, upload.single('avatar'), updateAvatar);

/**
 * Cập nhật ảnh bìa người dùng
 * @route PUT /api/users/cover-image
 * @access Private
 */
router.route('/cover-image')
    .put(authMiddleware, upload.single('coverImage'), updateCoverImage);

/**
 * Quản lý thông tin profile người dùng
 * @route GET /api/users/profile - Lấy thông tin profile
 * @route PUT /api/users/profile - Cập nhật thông tin profile
 * @access Private
 */
router.route('/profile')
    .get(authMiddleware, getProfile)
    .put(authMiddleware, updateProfile);

/**
 * Tìm kiếm người dùng theo từ khóa
 * @route GET /api/users/search?query=abc
 * @access Private
 */
router.route('/search')
    .get(authMiddleware, searchUsers);

/**
 * Lấy thông tin chi tiết của một người dùng khác
 * @route GET /api/users/:id
 * @access Private
 */
router.route('/:id')
    .get(authMiddleware, getUserDetail);

export default router;