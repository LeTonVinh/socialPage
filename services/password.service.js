import passwordRepo from '../repositories/password.repositories.js';
import userRepo from '../repositories/user.repositories.js';
import bcrypt from 'bcryptjs';
import { sendOTPEmail } from '../utils/sendMail.js';

/**
 * Service xử lý các thao tác liên quan đến mật khẩu
 * Bao gồm: yêu cầu reset mật khẩu, xác thực OTP, đặt lại mật khẩu
 */

/**
 * Sinh mã OTP 6 số ngẫu nhiên
 * @returns {string} Mã OTP 6 số
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Kiểm tra độ mạnh của mật khẩu
 * @param {string} password - Mật khẩu cần kiểm tra
 * @returns {boolean} Kết quả kiểm tra
 */
const isStrongPassword = (password) => {
    // Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
};

/**
 * Bước 1: Yêu cầu reset mật khẩu - gửi OTP về email/phone
 * @param {string} emailOrPhone - Email hoặc số điện thoại
 * @returns {Object} Thông tin user ID (không trả về OTP cho client)
 */
const requestResetPassword = async(emailOrPhone) => {
    // Tìm người dùng theo email hoặc số điện thoại
    const user = await passwordRepo.findByEmailOrPhone(emailOrPhone);
    if (!user) {
        throw new Error('Không tìm thấy tài khoản với thông tin đã nhập');
    }

    // Tạo mã OTP và thời gian hết hạn (10 phút)
    const otp = generateOTP();
    const expire = new Date(Date.now() + 10 * 60 * 1000); // OTP hết hạn sau 10 phút

    // Lưu OTP vào database
    user.resetOTP = otp;
    user.resetOTPExpire = expire;
    await user.save();

    // Gửi OTP qua email nếu có email
    if (user.email) {
        await sendOTPEmail(user.email, otp);
    }
    // TODO: Gửi OTP qua SMS nếu có phone (có thể tích hợp sau)

    return { userId: user._id }; // Không trả về OTP cho client để bảo mật
};

/**
 * Bước 2: Xác thực OTP và đặt lại mật khẩu
 * @param {string} userId - ID người dùng
 * @param {string} otp - Mã OTP đã nhập
 * @param {string} newPassword - Mật khẩu mới
 * @returns {boolean} Kết quả đặt lại mật khẩu
 */
const resetPassword = async(userId, otp, newPassword) => {
    // Tìm người dùng theo ID
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new Error('Không tìm thấy tài khoản');
    }

    // Kiểm tra đã yêu cầu OTP chưa
    if (!user.resetOTP || !user.resetOTPExpire) {
        throw new Error('Bạn chưa yêu cầu OTP');
    }

    // Kiểm tra OTP có đúng không
    if (user.resetOTP !== otp) {
        throw new Error('OTP không đúng');
    }

    // Kiểm tra OTP có hết hạn chưa
    if (user.resetOTPExpire < new Date()) {
        throw new Error('OTP đã hết hạn');
    }

    // Kiểm tra độ mạnh của mật khẩu mới
    if (!isStrongPassword(newPassword)) {
        throw new Error('Mật khẩu phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số');
    }

    // Mã hóa mật khẩu mới và xóa OTP
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