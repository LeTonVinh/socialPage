import express from 'express';
import { register, login, changePassword } from '../controllers/user.controller.js';
import validateRegister from '../middlewares/validateRegister.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register')
  .post(register, validateRegister); // Thêm middleware validateRegister

router.route('/login')
  .post(login);

router.route('/change-password')
  .post(authMiddleware, changePassword); // Đổi mật khẩu cần đăng nhập

export default router;