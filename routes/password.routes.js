/**
 * Routes Quản lý Mật khẩu (Password Routes)
 * Định nghĩa các endpoint liên quan đến đặt lại mật khẩu: gửi OTP, xác thực và đặt lại
 */
import express from 'express';
import { requestResetPassword, resetPassword } from '../controllers/password.controller.js';

const router = express.Router();

/**
 * Yêu cầu gửi OTP để đặt lại mật khẩu
 * @route POST /api/password/request-reset
 * @access Public
 */
router.post('/request-reset', requestResetPassword);

/**
 * Xác thực OTP và đặt lại mật khẩu
 * @route POST /api/password/reset
 * @access Public
 */
router.post('/reset', resetPassword);

export default router;