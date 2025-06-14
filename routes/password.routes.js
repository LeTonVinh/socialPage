import express from 'express';
import { requestResetPassword, resetPassword } from '../controllers/password.controller.js';

const router = express.Router();

// Yêu cầu reset mật khẩu
router.post('/request-reset', requestResetPassword);
// Đặt lại mật khẩu mới
router.post('/reset', resetPassword);

export default router;
