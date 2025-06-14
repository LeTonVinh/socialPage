import User from '../models/user.model.js';

const findByEmailOrPhone = async (email, phone) => {
  return await User.findOne({ $or: [{ email }, { phone }] });
};

const createUser = async (userData) => {
  return await User.create(userData);
};

const findByPhone = async (phone) => {
  return await User.findOne({ phone });
};

const findById = async (userId) => {
  return await User.findById(userId);
};

const updateImages = async (id, avatar, coverImage) => {
  const update = {};
  if (avatar !== undefined) update.avatar = avatar;
  if (coverImage !== undefined) update.coverImage = coverImage;
  return await User.findByIdAndUpdate(id, update, { new: true });
};

const updateAvatar = async (id, avatar) =>
  User.findByIdAndUpdate(id, { avatar }, { new: true });

const updateCoverImage = async (id, coverImage) =>
  User.findByIdAndUpdate(id, { coverImage }, { new: true });

const updateProfile = async (id, updateData) =>
  await User.findByIdAndUpdate(id, updateData, { new: true });

export default {
  findByEmailOrPhone,
  createUser,
  findByPhone,
  findById,
  updateImages,
  updateAvatar,
  updateCoverImage,
  updateProfile
};