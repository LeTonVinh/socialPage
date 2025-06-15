import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

/**
 * Tìm user theo email hoặc số điện thoại.
 * @param {String} emailOrPhone - Email hoặc số điện thoại của user.
 * @returns {Object|null} User nếu tìm thấy, ngược lại trả về null.
 */
const findByEmailOrPhone = async (emailOrPhone) => {
  return await User.findOne({
    $or: [
      { email: emailOrPhone },
      { phone: emailOrPhone }
    ]
  });
};

/**
 * Cập nhật mật khẩu mới cho user.
 * Mật khẩu sẽ được hash trước khi lưu vào database.
 * @param {String} userId - ID người dùng.
 * @param {String} newPassword - Mật khẩu mới (chưa hash).
 * @returns {Object|null} User đã cập nhật hoặc null nếu không tìm thấy.
 */
const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
};

/**
 * Tìm user theo ID.
 * @param {String} userId - ID người dùng.
 * @returns {Object|null} User nếu tìm thấy, ngược lại trả về null.
 */
const findById = async (userId) => {
  return await User.findById(userId);
};

export default {
  findByEmailOrPhone,
  updatePassword,
  findById
};