import User from '../models/user.model.js';

/**
 * Tìm user theo email hoặc số điện thoại.
 * @param {String} email - Email người dùng
 * @param {String} phone - Số điện thoại người dùng
 * @returns {Object|null} User nếu tìm thấy, ngược lại trả về null
 */
const findByEmailOrPhone = async(email, phone) => {
    return await User.findOne({ $or: [{ email }, { phone }] });
};

/**
 * Tìm user theo số điện thoại.
 * @param {String} phone - Số điện thoại người dùng
 * @returns {Object|null} User nếu tìm thấy, ngược lại trả về null
 */
const findByPhone = async(phone) => {
    return await User.findOne({ phone });
};

/**
 * Tạo mới một user trong database.
 * @param {Object} userData - Dữ liệu user cần tạo
 * @returns {Object} User vừa được tạo
 */
const createUser = async(userData) => {
    return await User.create(userData);
};

/**
 * Cập nhật thông tin profile của user.
 * @param {String} userId - ID người dùng
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object|null} User đã cập nhật, hoặc null nếu không tìm thấy
 */
const updateProfile = async(userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

/**
 * Tìm user theo ID.
 * @param {String} userId - ID người dùng.
 * @returns {Object|null} User nếu tìm thấy, ngược lại trả về null.
 */
const findById = async(userId) => {
    return await User.findById(userId);
};

/**
 * Cập nhật mật khẩu cho user.
 * @param {String} userId - ID người dùng.
 * @param {String} hashedPassword - Mật khẩu đã được hash.
 * @returns {Object|null} User đã cập nhật hoặc null nếu không tìm thấy.
 */
const updatePassword = async(userId, hashedPassword) => {
    return await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
};

/**
 * Kiểm tra mật khẩu hiện tại của user.
 * @param {String} userId - ID người dùng.
 * @param {String} password - Mật khẩu cần kiểm tra (chưa hash).
 * @returns {Boolean} true nếu đúng, false nếu sai.
 */
const checkPassword = async(userId, password) => {
    const user = await User.findById(userId);
    if (!user) return false;
    return await user.comparePassword(password);
};

/** Tìm kiếm user theo tên/email */
const searchUsers = async(query, limit = 10) => {
    if (!query) return [];
    return await User.find({
            $or: [
                { fullName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        })
        .select('_id fullName avatar email')
        .limit(limit);
};

/** Lấy chi tiết user */
const getUserById = async(id) => {
    return await User.findById(id)
        .select('_id fullName address birthday avatar coverImage gender bio occupation education relationshipStatus interests socialLinks');
};

/** Cập nhật ảnh đại diện */
const updateAvatar = async(userId, avatarUrl) => {
    return await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
};


/** Cập nhật ảnh bìa */
const updateCoverImage = async(userId, coverUrl) => {
    return await User.findByIdAndUpdate(userId, { coverImage: coverUrl }, { new: true });
};


export default { findByEmailOrPhone, findByPhone, createUser, updateProfile, findById, updatePassword, checkPassword, searchUsers, getUserById, updateAvatar, updateCoverImage };