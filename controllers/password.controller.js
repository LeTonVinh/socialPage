import asyncHandler from 'express-async-handler';
import passwordService from '../services/password.service.js';

// Bước 1: Yêu cầu gửi OTP (quên mật khẩu)
const requestResetPassword = asyncHandler(async (req, res) => {
  const { emailOrPhone } = req.body;
  const { userId, otp } = await passwordService.requestResetPassword(emailOrPhone);
  // TODO: Gửi otp qua email/SMS, hiện tại trả về otp để test
  res.json({ message: 'Đã gửi OTP đặt lại mật khẩu', userId, otp });
});

// Bước 2: Xác thực OTP và đặt lại mật khẩu
const resetPassword = asyncHandler(async (req, res) => {
  const { userId, otp, newPassword } = req.body;
  await passwordService.resetPassword(userId, otp, newPassword);
  res.json({ message: 'Đặt lại mật khẩu thành công' });
});

export { requestResetPassword, resetPassword };
