import User from '../models/user.model.js';

/**
 * Tìm user theo email hoặc số điện thoại.
 * @param {String} email - Email người dùng
 * @param {String} phone - Số điện thoại người dùng
 * @returns {Object|null} User nếu tìm thấy, ngược lại trả về null
 */
const findByEmailOrPhone = async (email, phone) => {
  return await User.findOne({ $or: [{ email }, { phone }] });
};

/**
 * Tìm user theo số điện thoại.
 * @param {String} phone - Số điện thoại người dùng
 * @returns {Object|null} User nếu tìm thấy, ngược lại trả về null
 */
const findByPhone = async (phone) => {
  return await User.findOne({ phone });
};

/**
 * Tạo mới một user trong database.
 * @param {Object} userData - Dữ liệu user cần tạo
 * @returns {Object} User vừa được tạo
 */
const createUser = async (userData) => {
  return await User.create(userData);
};

/**
 * Cập nhật thông tin profile của user.
 * @param {String} userId - ID người dùng
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object|null} User đã cập nhật, hoặc null nếu không tìm thấy
 */
const updateProfile = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

/**
 * Tìm user theo ID.
 * @param {String} userId - ID người dùng
 * @returns {Object|null} User nếu tìm thấy, ngược lại trả về null
 */
const findById = async (userId) => {
  return await User.findById(userId);
};

export default { findByEmailOrPhone, findByPhone, createUser, updateProfile, findById };