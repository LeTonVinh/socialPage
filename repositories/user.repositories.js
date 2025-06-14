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

export default { findByEmailOrPhone, createUser, findByPhone, findById };