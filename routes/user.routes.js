import express from 'express';
import { register, login, changePassword, updateAvatar, updateCoverImage } from '../controllers/user.controller.js';
import validateRegister from '../middlewares/validateRegister.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register')// Đăng ký tài khoản
  .post(register, validateRegister); // Thêm middleware validateRegister

router.route('/login')
  .post(login);// Đăng nhập 

router.route('/change-password')
  .post(authMiddleware, changePassword); // Đổi mật khẩu cần đăng nhập

router.patch('/avatar', authMiddleware, updateAvatar);// Cập nhật ảnh đại diện
router.patch('/cover-image', authMiddleware, updateCoverImage);// Cập nhật ảnh bìa

export default router;