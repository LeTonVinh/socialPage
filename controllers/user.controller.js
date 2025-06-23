import asyncHandler from 'express-async-handler';
import authService from '../services/user.service.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import userService from '../services/user.service.js';

// Đăng ký tài khoản
const register = asyncHandler(async (req, res) => {
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
// Đăng nhập
const login = asyncHandler(async (req, res) => {
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
// Đổi mật khẩu
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(userId, oldPassword, newPassword);
  res.json({ message: 'Đổi mật khẩu thành công' });
});
// Cập nhật ảnh đại diện
const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { avatar } = req.body;
    const user = await userService.updateAvatar(userId, avatar);
    res.json({
      message: 'Cập nhật avatar thành công',
      avatar: user.avatar
    });
  } catch (error) {
    next(error);
  }
};
// Cập nhật ảnh bìa
const updateCoverImage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { coverImage } = req.body;
    const user = await userService.updateCoverImage(userId, coverImage);
    res.json({
      message: 'Cập nhật ảnh bìa thành công',
      coverImage: user.coverImage
    });
  } catch (error) {
    next(error);
  }
};
// Lấy thông tin người dùng
const getProfile = asyncHandler(async (req, res) => {
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
// Cập nhật thông tin người dùng
const updateProfile = asyncHandler(async (req, res) => {
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

/** GET /api/users/search?query=abc */
const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const users = await userService.searchUsers(query);
  res.json({ users });
});

/** GET /api/users/:id */
const getUserDetail = asyncHandler(async (req, res) => {
  const user = await userService.getUserDetail(req.params.id, req.user.id);
  res.json({ user });
});

export { register, login, changePassword, updateAvatar, updateCoverImage, getProfile, updateProfile, searchUsers, getUserDetail };