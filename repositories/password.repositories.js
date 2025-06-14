import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// Tìm user theo email hoặc phone
const findByEmailOrPhone = async (emailOrPhone) => {
  return await User.findOne({
    $or: [
      { email: emailOrPhone },
      { phone: emailOrPhone }
    ]
  });
};

// Cập nhật mật khẩu mới cho user
const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
};

// Tìm user theo id
const findById = async (userId) => {
  return await User.findById(userId);
};

export default {
  findByEmailOrPhone,
  updatePassword,
  findById
};
