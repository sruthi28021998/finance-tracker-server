const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const respond = (res, user, code = 200) =>
  res.status(code).json({
    token: sign(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    res.status(409);
    throw new Error('Email already registered');
  }
  const user = await User.create({ name, email, password });
  respond(res, user, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password || ''))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  respond(res, user);
});

exports.me = asyncHandler(async (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ id: _id, name, email });
});