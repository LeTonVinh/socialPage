import passwordRepo from '../repositories/password.repositories.js';
import userRepo from '../repositories/user.repositories.js';
import bcrypt from 'bcryptjs';
import { sendOTPEmail } from '../utils/sendMail.js';

// Sinh OTP 6 số
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Bước 1: Gửi OTP về email/phone
const requestResetPassword = async (emailOrPhone) => {
  const user = await passwordRepo.findByEmailOrPhone(emailOrPhone);
  if (!user) throw new Error('Không tìm thấy tài khoản với thông tin đã nhập');

  const otp = generateOTP();
  const expire = new Date(Date.now() + 10 * 60 * 1000); // OTP hết hạn sau 10 phút
  user.resetOTP = otp;
  user.resetOTPExpire = expire;
  await user.save();

  // Gửi OTP qua email nếu có email
  if (user.email) {
    await sendOTPEmail(user.email, otp);
  }
  // TODO: Gửi OTP qua SMS nếu có phone (có thể tích hợp sau)

  return { userId: user._id }; // Không trả về otp cho client nữa
};

// Kiểm tra mật khẩu mới hợp lệ
const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);

// Bước 2: Xác thực OTP và đặt lại mật khẩu
const resetPassword = async (userId, otp, newPassword) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error('Không tìm thấy tài khoản');
  if (!user.resetOTP || !user.resetOTPExpire) throw new Error('Bạn chưa yêu cầu OTP');
  if (user.resetOTP !== otp) throw new Error('OTP không đúng');
  if (user.resetOTPExpire < new Date()) throw new Error('OTP đã hết hạn');

  if (!isStrongPassword(newPassword)) {
    throw new Error('Mật khẩu phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số');
  }
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;
  await user.save();
  return true;
};

export default {
  requestResetPassword,
  resetPassword
};
