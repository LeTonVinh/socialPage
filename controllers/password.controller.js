/**
 * Controller Quản lý Mật khẩu (Password Controller)
 * Xử lý các request liên quan đến đặt lại mật khẩu: gửi OTP, xác thực và đặt lại
 */
import asyncHandler from 'express-async-handler';
import passwordService from '../services/password.service.js';

/**
 * Yêu cầu gửi OTP để đặt lại mật khẩu
 * @route POST /api/password/request-reset
 * @access Public
 * @param {string} req.body.emailOrPhone - Email hoặc số điện thoại
 * @returns {Object} Thông tin userId và OTP (để test)
 */
const requestResetPassword = asyncHandler(async(req, res) => {
    const { emailOrPhone } = req.body;
    const { userId, otp } = await passwordService.requestResetPassword(emailOrPhone);

    // TODO: Gửi OTP qua email/SMS, hiện tại trả về OTP để test
    res.json({
        message: 'Đã gửi OTP đặt lại mật khẩu',
        userId,
        otp
    });
});

/**
 * Xác thực OTP và đặt lại mật khẩu
 * @route POST /api/password/reset
 * @access Public
 * @param {string} req.body.userId - ID người dùng
 * @param {string} req.body.otp - Mã OTP
 * @param {string} req.body.newPassword - Mật khẩu mới
 * @returns {Object} Thông báo đặt lại mật khẩu thành công
 */
const resetPassword = asyncHandler(async(req, res) => {
    const { userId, otp, newPassword } = req.body;
    await passwordService.resetPassword(userId, otp, newPassword);
    res.json({ message: 'Đặt lại mật khẩu thành công' });
});

export { requestResetPassword, resetPassword };