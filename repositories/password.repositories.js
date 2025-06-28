/**
 * Repository Quản lý Mật khẩu (Password Repository)
 * Chứa các hàm truy vấn và thao tác liên quan đến đặt lại mật khẩu
 */
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

/**
 * Tìm người dùng theo email hoặc số điện thoại
 * @param {String} emailOrPhone - Email hoặc số điện thoại của người dùng
 * @returns {Object|null} Người dùng nếu tìm thấy, ngược lại trả về null
 */
const findByEmailOrPhone = async(emailOrPhone) => {
    return await User.findOne({
        $or: [
            { email: emailOrPhone },
            { phone: emailOrPhone }
        ]
    });
};

/**
 * Cập nhật mật khẩu mới cho người dùng
 * Mật khẩu sẽ được hash trước khi lưu vào database
 * @param {String} userId - ID người dùng
 * @param {String} newPassword - Mật khẩu mới (chưa hash)
 * @returns {Object|null} Người dùng đã cập nhật hoặc null nếu không tìm thấy
 */
const updatePassword = async(userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
};

/**
 * Tìm người dùng theo ID
 * @param {String} userId - ID người dùng
 * @returns {Object|null} Người dùng nếu tìm thấy, ngược lại trả về null
 */
const findById = async(userId) => {
    return await User.findById(userId);
};

export default {
    findByEmailOrPhone,
    updatePassword,
    findById
};