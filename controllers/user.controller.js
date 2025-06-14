import asyncHandler from 'express-async-handler';
import authService from '../services/user.service.js';
import authMiddleware from '../middlewares/auth.middleware.js';

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

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(userId, oldPassword, newPassword);
  res.json({ message: 'Đổi mật khẩu thành công' });
});



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

export { register, login, changePassword, updateAvatar, updateCoverImage };