import asyncHandler from 'express-async-handler';
import authService from '../services/user.service.js';

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

export { register, login };