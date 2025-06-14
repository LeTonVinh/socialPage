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


export { register, login, changePassword };