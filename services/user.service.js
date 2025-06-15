import userRepo from '../repositories/user.repositories.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Đăng ký user mới với kiểm tra định dạng
const register = async ({ fullName, email, phone, birthday, password, role }) => {
  // Kiểm tra dữ liệu đầu vào
  if (!fullName || !email || !phone || !birthday || !password)
    throw new Error('Vui lòng nhập đầy đủ thông tin');

  // Kiểm tra định dạng email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error('Email không hợp lệ');

  // Kiểm tra định dạng số điện thoại (Việt Nam)
  if (!/^(0|\+84)[0-9]{9,10}$/.test(phone))
    throw new Error('Số điện thoại không hợp lệ');

  // Kiểm tra mật khẩu mạnh (ít nhất 8 ký tự, có chữ hoa, thường, số)
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password))
    throw new Error('Mật khẩu phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số');

  // Kiểm tra trùng lặp
  const existingUser = await userRepo.findByEmailOrPhone(email, phone);
  if (existingUser) throw new Error('Email hoặc số điện thoại đã tồn tại');

  // Hash mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo user mới
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

const login = async ({ phone, password }) => {
  const user = await userRepo.findByPhone(phone);
  if (!user) throw new Error('Số điện thoại không tồn tại');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Sai mật khẩu');

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'; // Lấy từ env, mặc định 7d

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET ,
    { expiresIn }
  );
  return { user, token };
};

const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error('Không tìm thấy tài khoản');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Mật khẩu cũ không đúng');

  if (!isStrongPassword(newPassword)) {
    throw new Error('Mật khẩu mới phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  return true;
};

const updateAvatar = async (userId, avatar) => {
  if (!avatar) throw new Error('Thiếu dữ liệu avatar');
  return await userRepo.updateAvatar(userId, avatar);
};

const updateCoverImage = async (userId, coverImage) => {
  if (!coverImage) throw new Error('Thiếu dữ liệu coverImage');
  return await userRepo.updateCoverImage(userId, coverImage);
};

const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error('Không tìm thấy user');
  return user;
};

const updateProfile = async (userId, updateData) => {
  // Danh sách các trường cho phép cập nhật
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
    'socialLinks',
    'avatar',
    'coverImage'
  ];
  const data = {};
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) data[field] = updateData[field];
  });
  if (Object.keys(data).length === 0) throw new Error('Không có dữ liệu cập nhật');

  // Cập nhật thời gian
  data.updatedAt = new Date();

  const user = await userRepo.updateProfile(userId, data);
  if (!user) throw new Error('Không tìm thấy user');
  return user;
};

export default { register, login, changePassword, updateAvatar, updateCoverImage, getProfile, updateProfile };