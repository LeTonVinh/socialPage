import userRepo from '../repositories/user.repositories.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); // Load biến môi trường



// Đăng ký user mới với kiểm tra định dạng và trùng lặp
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

// Đăng nhập bằng số điện thoại và mật khẩu, trả về token JWT
const login = async ({ phone, password }) => {
  const user = await userRepo.findByPhone(phone);
  if (!user) throw new Error('Số điện thoại không tồn tại');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Sai mật khẩu');

  const expiresIn = process.env.JWT_EXPIRES_IN; // Lấy từ env

  const token = jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET, // Lấy từ env
    { expiresIn }
  );
  return { user, token };
};

// Đổi mật khẩu cho user, kiểm tra mật khẩu cũ và độ mạnh mật khẩu mới
const changePassword = async (userId, oldPassword, newPassword) => {
  // Hàm kiểm tra mật khẩu mạnh
  function isStrongPassword(password) {
  // Tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  }
  const user = await userRepo.findById(userId);
  if (!user) throw new Error('Không tìm thấy tài khoản');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Mật khẩu cũ không đúng');

  if (!isStrongPassword(newPassword)) {
    throw new Error('Mật khẩu mới phải tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số');
  }

  // Hash mật khẩu mới và tăng version token
  user.password = await bcrypt.hash(newPassword, 10);
  user.tokenVersion = (user.tokenVersion || 0) + 1; // Tăng version
  await user.save();
  return true;
};

// Cập nhật ảnh đại diện cho user
const updateAvatar = async (userId, avatar) => {
  if (!avatar) throw new Error('Thiếu dữ liệu avatar');
  return await userRepo.updateAvatar(userId, avatar);
};

// Cập nhật ảnh bìa cho user
const updateCoverImage = async (userId, coverImage) => {
  if (!coverImage) throw new Error('Thiếu dữ liệu coverImage');
  return await userRepo.updateCoverImage(userId, coverImage);
};

// Lấy thông tin profile của user theo userId(token)
const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error('Không tìm thấy user');
  return user;
};

// Cập nhật thông tin profile cho user với các trường cho phép(token)
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

/** Tìm kiếm user */
const searchUsers = async (query, limit) => {
  return await userRepo.searchUsers(query, limit);


};

/** Lấy chi tiết user */
const getUserDetail = async (id, currentUserId) => {
  const user = await userRepo.getUserById(id);
  if (!user) throw new Error('Không tìm thấy user');

  const isOwner = id === currentUserId;
  // Trả về thông tin public nếu không phải chủ tài khoản
  return isOwner
    ? user
    : {
        _id: user._id,
        fullName: user.fullName,
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

export default { register, login, changePassword, updateAvatar, updateCoverImage, getProfile, updateProfile, searchUsers, getUserDetail };