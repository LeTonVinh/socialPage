/**
 * Repository Quản lý Người dùng (User Repository)
 * Chứa các hàm truy vấn và thao tác với collection User trong database
 */
import User from '../models/user.model.js';

/**
 * Tìm người dùng theo email hoặc số điện thoại
 * @param {String} email - Email người dùng
 * @param {String} phone - Số điện thoại người dùng
 * @returns {Object|null} Người dùng nếu tìm thấy, ngược lại trả về null
 */
const findByEmailOrPhone = async(email, phone) => {
    return await User.findOne({ $or: [{ email }, { phone }] });
};

/**
 * Tìm người dùng theo số điện thoại
 * @param {String} phone - Số điện thoại người dùng
 * @returns {Object|null} Người dùng nếu tìm thấy, ngược lại trả về null
 */
const findByPhone = async(phone) => {
    return await User.findOne({ phone });
};

/**
 * Tạo mới một người dùng trong database
 * @param {Object} userData - Dữ liệu người dùng cần tạo
 * @returns {Object} Người dùng vừa được tạo
 */
const createUser = async(userData) => {
    return await User.create(userData);
};

/**
 * Cập nhật thông tin profile của người dùng
 * @param {String} userId - ID người dùng
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object|null} Người dùng đã cập nhật, hoặc null nếu không tìm thấy
 */
const updateProfile = async(userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

/**
 * Tìm người dùng theo ID
 * @param {String} userId - ID người dùng
 * @returns {Object|null} Người dùng nếu tìm thấy, ngược lại trả về null
 */
const findById = async(userId) => {
    return await User.findById(userId);
};

/**
 * Cập nhật mật khẩu cho người dùng
 * @param {String} userId - ID người dùng
 * @param {String} hashedPassword - Mật khẩu đã được hash
 * @returns {Object|null} Người dùng đã cập nhật hoặc null nếu không tìm thấy
 */
const updatePassword = async(userId, hashedPassword) => {
    return await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
};

/**
 * Kiểm tra mật khẩu hiện tại của người dùng
 * @param {String} userId - ID người dùng
 * @param {String} password - Mật khẩu cần kiểm tra (chưa hash)
 * @returns {Boolean} true nếu đúng, false nếu sai
 */
const checkPassword = async(userId, password) => {
    const user = await User.findById(userId);
    if (!user) return false;
    return await user.comparePassword(password);
};

/**
 * Tìm kiếm người dùng theo tên hoặc email
 * @param {String} query - Từ khóa tìm kiếm
 * @param {Number} limit - Số lượng kết quả tối đa (mặc định 10)
 * @returns {Array} Danh sách người dùng phù hợp
 */
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

/**
 * Lấy thông tin chi tiết người dùng theo ID
 * @param {String} id - ID người dùng
 * @returns {Object|null} Thông tin chi tiết người dùng
 */
const getUserById = async(id) => {
    return await User.findById(id)
        .select('_id fullName address birthday avatar coverImage gender bio occupation education relationshipStatus interests socialLinks');
};

/**
 * Cập nhật ảnh đại diện cho người dùng
 * @param {String} userId - ID người dùng
 * @param {String} avatarUrl - URL ảnh đại diện mới
 * @returns {Object|null} Người dùng đã cập nhật
 */
const updateAvatar = async(userId, avatarUrl) => {
    return await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true });
};

/**
 * Cập nhật ảnh bìa cho người dùng
 * @param {String} userId - ID người dùng
 * @param {String} coverUrl - URL ảnh bìa mới
 * @returns {Object|null} Người dùng đã cập nhật
 */
const updateCoverImage = async(userId, coverUrl) => {
    return await User.findByIdAndUpdate(userId, { coverImage: coverUrl }, { new: true });
};

export default {
    findByEmailOrPhone,
    findByPhone,
    createUser,
    updateProfile,
    findById,
    updatePassword,
    checkPassword,
    searchUsers,
    getUserById,
    updateAvatar,
    updateCoverImage
};