const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userService = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// POST /api/users
async function createUser(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { username, email, password, role } = req.body;
    const user = await userService.createUser({ username, email, password, role });
    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    next(err);
  }
}

// GET /api/users
async function listUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /api/users/:email
async function getUser(req, res, next) {
  try {
    const email = req.params.email;
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:email
async function updateUser(req, res, next) {
  try {
    const email = req.params.email;
    const updates = req.body;
    const user = await userService.updateUserByEmail(email, updates);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated', user });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:email
async function deleteUser(req, res, next) {
  try {
    const email = req.params.email;
    const user = await userService.deleteUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
}

// POST /api/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticate(email, password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: { username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

// GET /api/logout
function logout(req, res) {
  // For stateless JWT: instruct client to remove token.
  res.json({ message: 'Logged out (delete token client-side)' });
}

module.exports = {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
  login,
  logout
};
