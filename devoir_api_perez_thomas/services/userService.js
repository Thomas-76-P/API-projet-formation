const User = require('../models/userModel');

async function createUser({ username, email, password, role }) {
  const exists = await User.findOne({ email });
  if (exists) throw { status: 400, message: 'Email already in use' };
  const user = new User({ username, email, password, role });
  await user.save();
  return user.toJSON();
}

async function getAllUsers() {
  const users = await User.find().select('-password');
  return users;
}

async function getUserByEmail(email) {
  const user = await User.findOne({ email }).select('-password');
  return user;
}

async function updateUserByEmail(email, updates) {
  // prevent password change here (or handle separately)
  if (updates.password) delete updates.password;
  const user = await User.findOneAndUpdate({ email }, updates, { new: true }).select('-password');
  return user;
}

async function deleteUserByEmail(email) {
  const user = await User.findOneAndDelete({ email });
  return user;
}

async function authenticate(email, password) {
  const user = await User.findOne({ email });
  if (!user) return null;
  const ok = await user.comparePassword(password);
  if (!ok) return null;
  return user;
}

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  updateUserByEmail,
  deleteUserByEmail,
  authenticate
};
