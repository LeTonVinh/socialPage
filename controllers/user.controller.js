/**
 * Controller Quản lý Người dùng (User Controller)
 * Xử lý các request liên quan đến người dùng: đăng ký, đăng nhập, cập nhật thông tin
 */
import asyncHandler from 'express-async-handler';
import authService from '../services/user.service.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import userService from '../services/user.service.js';

/**
 * Đăng ký tài khoản mới
 * @route POST /api/auth/register
 * @access Public
 * @param {Object} req.body - Dữ liệu đăng ký (fullName, email, phone, birthday, password)
 * @returns {Object} Thông tin người dùng đã đăng ký
 */
const register = asyncHandler(async(req, res) => {
    const user = await authService.register(req.body);
    res.status(201).json({
        message: 'Đăng ký thành công',
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            role: user.role
        }
    });
});

/**
 * Đăng nhập vào hệ thống
 * @route POST /api/auth/login
 * @access Public
 * @param {Object} req.body - Dữ liệu đăng nhập (email, password)
 * @returns {Object} Token và thông tin người dùng
 */
const login = asyncHandler(async(req, res) => {
    const { user, token } = await authService.login(req.body);
    res.json({
        message: 'Đăng nhập thành công',
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            role: user.role
        }
    });
});

/**
 * Thay đổi mật khẩu người dùng
 * @route POST /api/auth/change-password
 * @access Private
 * @param {Object} req.body - Dữ liệu thay đổi mật khẩu (oldPassword, newPassword)
 * @returns {Object} Thông báo thành công
 */
const changePassword = asyncHandler(async(req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    await authService.changePassword(userId, oldPassword, newPassword);
    res.json({ message: 'Đổi mật khẩu thành công' });
});

/**
 * Cập nhật ảnh đại diện người dùng
 * @route POST /api/users/avatar
 * @access Private
 * @param {File} req.file - File ảnh đại diện
 * @returns {Object} URL ảnh đại diện mới
 */
const updateAvatar = async(req, res, next) => {
    try {
        const userId = req.user.id;
        // Lấy đường dẫn file từ multer upload
        const avatarUrl = req.file ? req.file.path : null; // hoặc req.file.location nếu dùng S3
        if (!avatarUrl) throw new Error('Không nhận được file avatar');

        const user = await userService.updateAvatar(userId, avatarUrl);
        res.json({
            message: 'Cập nhật avatar thành công',
            avatar: user.avatar
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Cập nhật ảnh bìa người dùng
 * @route POST /api/users/cover-image
 * @access Private
 * @param {File} req.file - File ảnh bìa
 * @returns {Object} URL ảnh bìa mới
 */
const updateCoverImage = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const coverUrl = req.file ? req.file.path : null; // hoặc req.file?.location nếu dùng S3, Cloudinary
        if (!coverUrl) throw new Error('Không nhận được file coverImage');

        const user = await userService.updateCoverImage(userId, coverUrl);
        res.json({
            message: 'Cập nhật ảnh bìa thành công',
            coverImage: user.coverImage
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Lấy thông tin chi tiết người dùng hiện tại
 * @route GET /api/users/profile
 * @access Private
 * @returns {Object} Thông tin đầy đủ của người dùng
 */
const getProfile = asyncHandler(async(req, res) => {
    const userId = req.user.id;
    const user = await userService.getProfile(userId);
    res.json({
        message: 'Lấy thông tin người dùng thành công',
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            avatar: user.avatar,
            coverImage: user.coverImage,
            role: user.role,
            gender: user.gender,
            address: user.address,
            bio: user.bio,
            occupation: user.occupation,
            education: user.education,
            relationshipStatus: user.relationshipStatus,
            interests: user.interests,
            socialLinks: user.socialLinks,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});

/**
 * Cập nhật thông tin cá nhân người dùng
 * @route PUT /api/users/profile
 * @access Private
 * @param {Object} req.body - Dữ liệu cập nhật
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const updateProfile = asyncHandler(async(req, res) => {
    const userId = req.user.id;
    const user = await userService.updateProfile(userId, req.body);
    res.json({
        message: 'Cập nhật thông tin thành công',
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            avatar: user.avatar,
            coverImage: user.coverImage,
            role: user.role,
            gender: user.gender,
            address: user.address,
            bio: user.bio,
            occupation: user.occupation,
            education: user.education,
            relationshipStatus: user.relationshipStatus,
            interests: user.interests,
            socialLinks: user.socialLinks,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});

/**
 * Tìm kiếm người dùng theo từ khóa
 * @route GET /api/users/search?query=abc
 * @access Private
 * @param {string} req.query.query - Từ khóa tìm kiếm
 * @returns {Array} Danh sách người dùng phù hợp
 */
const searchUsers = asyncHandler(async(req, res) => {
    const { query } = req.query;
    const users = await userService.searchUsers(query);
    res.json({ users });
});

/**
 * Lấy thông tin chi tiết của một người dùng khác
 * @route GET /api/users/:id
 * @access Private
 * @param {string} req.params.id - ID người dùng cần xem
 * @returns {Object} Thông tin người dùng
 */
const getUserDetail = asyncHandler(async(req, res) => {
    const user = await userService.getUserDetail(req.params.id, req.user.id);
    res.json({ user });
});

export {
    register,
    login,
    changePassword,
    updateAvatar,
    updateCoverImage,
    getProfile,
    updateProfile,
    searchUsers,
    getUserDetail
};