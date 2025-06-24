import express from 'express';
import { register, login, changePassword, updateAvatar, updateCoverImage, getProfile, updateProfile, getUserDetail, searchUsers } from '../controllers/user.controller.js';
import validateRegister from '../middlewares/validateRegister.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.route('/register') // Đăng ký tài khoản
    .post(register, validateRegister); // Thêm middleware validateRegister

router.route('/login')
    .post(login); // Đăng nhập

router.route('/change-password')
    .post(authMiddleware, changePassword); // Đổi mật khẩu cần đăng nhập

router.route('/avatar')
    .put(authMiddleware, upload.single('avatar'), updateAvatar);
router.route('/cover-image')
    .put(authMiddleware, upload.single('coverImage'), updateCoverImage); // Cập nhật ảnh bìa


router.route('/profile')
    .get(authMiddleware, getProfile) // Lấy thông tin profile user
    .put(authMiddleware, updateProfile); // Cập nhật thông tin profile user


router.route('/search')
    .get(authMiddleware, searchUsers); // Tìm kiếm người dùng

router.route('/:id')
    .get(authMiddleware, getUserDetail); // Lấy thông tin user theo ID
export default router;