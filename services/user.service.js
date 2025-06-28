import userRepo from '../repositories/user.repositories.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load biến môi trường
dotenv.config();

/**
 * Service xử lý các thao tác liên quan đến người dùng
 * Bao gồm: đăng ký, đăng nhập, cập nhật thông tin, quản lý mật khẩu
 */

/**
 * Đăng ký tài khoản người dùng mới
 * @param {Object} userData - Dữ liệu người dùng
 * @param {string} userData.fullName - Họ và tên
 * @param {string} userData.email - Email
 * @param {string} userData.phone - Số điện thoại
 * @param {Date} userData.birthday - Ngày sinh
 * @param {string} userData.password - Mật khẩu
 * @param {string} userData.role - Vai trò (mặc định: 'user')
 * @returns {Object} Thông tin người dùng đã tạo
 */
const register = async({ fullName, email, phone, birthday, password, role }) => {
    // Kiểm tra dữ liệu đầu vào bắt buộc
    if (!fullName || !email || !phone || !birthday || !password) {
        throw new Error('Vui lòng nhập đầy đủ thông tin');
    }

    // Kiểm tra định dạng email hợp lệ
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Email không hợp lệ');
    }

    // Kiểm tra định dạng số điện thoại Việt Nam
    if (!/^(0|\+84)[0-9]{9,10}$/.test(phone)) {
        throw new Error('Số điện thoại không hợp lệ');
    }

    // Kiểm tra độ mạnh của mật khẩu (ít nhất 8 ký tự, có chữ hoa, thường, số)
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
        throw new Error('Mật khẩu phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số');
    }

    // Kiểm tra trùng lặp email hoặc số điện thoại
    const existingUser = await userRepo.findByEmailOrPhone(email, phone);
    if (existingUser) {
        throw new Error('Email hoặc số điện thoại đã tồn tại');
    }

    // Mã hóa mật khẩu với salt rounds = 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo tài khoản người dùng mới
    const user = await userRepo.createUser({
        fullName,
        email,
        phone,
        birthday,
        password: hashedPassword,
        role: role || 'user'
    });

    return user;
};

/**
 * Đăng nhập tài khoản người dùng
 * @param {Object} loginData - Dữ liệu đăng nhập
 * @param {string} loginData.phone - Số điện thoại
 * @param {string} loginData.password - Mật khẩu
 * @returns {Object} Thông tin người dùng và token JWT
 */
const login = async({ phone, password }) => {
    // Tìm người dùng theo số điện thoại
    const user = await userRepo.findByPhone(phone);
    if (!user) {
        throw new Error('Số điện thoại không tồn tại');
    }

    // Xác thực mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Sai mật khẩu');
    }

    // Lấy thời gian hết hạn token từ biến môi trường
    const expiresIn = process.env.JWT_EXPIRES_IN;

    // Tạo token JWT với thông tin người dùng
    const token = jwt.sign({
            id: user._id,
            role: user.role,
            tokenVersion: user.tokenVersion
        },
        process.env.JWT_SECRET, { expiresIn }
    );

    return { user, token };
};

/**
 * Thay đổi mật khẩu cho người dùng
 * @param {string} userId - ID người dùng
 * @param {string} oldPassword - Mật khẩu cũ
 * @param {string} newPassword - Mật khẩu mới
 * @returns {boolean} Kết quả thay đổi mật khẩu
 */
const changePassword = async(userId, oldPassword, newPassword) => {
    /**
     * Kiểm tra độ mạnh của mật khẩu
     * @param {string} password - Mật khẩu cần kiểm tra
     * @returns {boolean} Kết quả kiểm tra
     */
    const isStrongPassword = (password) => {
        // Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };

    // Tìm người dùng theo ID
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new Error('Không tìm thấy tài khoản');
    }

    // Xác thực mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error('Mật khẩu cũ không đúng');
    }

    // Kiểm tra độ mạnh của mật khẩu mới
    if (!isStrongPassword(newPassword)) {
        throw new Error('Mật khẩu mới phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số');
    }

    // Cập nhật mật khẩu mới và tăng version token để vô hiệu hóa token cũ
    user.password = await bcrypt.hash(newPassword, 10);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    return true;
};

/**
 * Cập nhật ảnh đại diện cho người dùng
 * @param {string} userId - ID người dùng
 * @param {string} avatarUrl - URL ảnh đại diện
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const updateAvatar = async(userId, avatarUrl) => {
    if (!avatarUrl) {
        throw new Error('Thiếu dữ liệu avatar');
    }
    return await userRepo.updateAvatar(userId, avatarUrl);
};

/**
 * Cập nhật ảnh bìa cho người dùng
 * @param {string} userId - ID người dùng
 * @param {string} coverImage - URL ảnh bìa
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const updateCoverImage = async(userId, coverImage) => {
    if (!coverImage) {
        throw new Error('Thiếu dữ liệu coverImage');
    }
    return await userRepo.updateCoverImage(userId, coverImage);
};

/**
 * Lấy thông tin profile của người dùng hiện tại
 * @param {string} userId - ID người dùng
 * @returns {Object} Thông tin profile đầy đủ
 */
const getProfile = async(userId) => {
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new Error('Không tìm thấy user');
    }
    return user;
};

/**
 * Cập nhật thông tin profile cho người dùng
 * @param {string} userId - ID người dùng
 * @param {Object} updateData - Dữ liệu cập nhật
 * @returns {Object} Thông tin người dùng đã cập nhật
 */
const updateProfile = async(userId, updateData) => {
    // Danh sách các trường được phép cập nhật
    const allowedFields = [
        'fullName',
        'birthday',
        'gender',
        'address',
        'bio',
        'occupation',
        'education',
        'relationshipStatus',
        'interests',
        'socialLinks'
    ];

    // Lọc và chỉ lấy các trường được phép cập nhật
    const data = {};
    allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
            data[field] = updateData[field];
        }
    });

    if (Object.keys(data).length === 0) {
        throw new Error('Không có dữ liệu cập nhật');
    }

    // Cập nhật thời gian chỉnh sửa
    data.updatedAt = new Date();

    const user = await userRepo.updateProfile(userId, data);
    if (!user) {
        throw new Error('Không tìm thấy user');
    }
    return user;
};

/**
 * Tìm kiếm người dùng theo từ khóa
 * @param {string} query - Từ khóa tìm kiếm
 * @param {number} limit - Giới hạn số kết quả
 * @returns {Array} Danh sách người dùng tìm được
 */
const searchUsers = async(query, limit) => {
    return await userRepo.searchUsers(query, limit);
};

/**
 * Lấy thông tin chi tiết người dùng
 * @param {string} id - ID người dùng cần xem
 * @param {string} currentUserId - ID người dùng hiện tại
 * @returns {Object} Thông tin người dùng (public hoặc private tùy theo quyền)
 */
const getUserDetail = async(id, currentUserId) => {
    const user = await userRepo.getUserById(id);
    if (!user) {
        throw new Error('Không tìm thấy user');
    }

    const isOwner = id === currentUserId;

    // Trả về thông tin đầy đủ nếu là chủ tài khoản, ngược lại chỉ trả về thông tin public
    return isOwner ? user : {
        _id: user._id,
        fullName: user.fullName,
        address: user.address,
        birthday: user.birthday,
        avatar: user.avatar,
        coverImage: user.coverImage,
        gender: user.gender,
        bio: user.bio,
        occupation: user.occupation,
        education: user.education,
        relationshipStatus: user.relationshipStatus,
        interests: user.interests,
        socialLinks: user.socialLinks,
    };
};

export default {
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