const express = require('express');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();
const userController = require('../controllers/userController');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// simple protect middleware for routes that need auth
function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

/**
 * Routes:
 * POST   /api/users        -> create user (open)
 * GET    /api/users        -> list users (protected)
 * GET    /api/users/:email -> get user by email (protected)
 * PUT    /api/users/:email -> update user (protected)
 * DELETE /api/users/:email -> delete user (protected)
 * POST   /api/login        -> login (open)
 * GET    /api/logout       -> logout (open)
 */

// Create user (validate email, password)
router.post('/users',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('username').notEmpty(),
  userController.createUser
);

// List users
router.get('/users', protect, userController.listUsers);

// Get user by email
router.get('/users/:email', protect, userController.getUser);

// Update user (protected)
router.put('/users/:email', protect, userController.updateUser);

// Delete user
router.delete('/users/:email', protect, userController.deleteUser);

// Auth
router.post('/login', userController.login);
router.get('/logout', userController.logout);

module.exports = router;
