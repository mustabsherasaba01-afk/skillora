const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const userResponse = (user) => {
  const data = user.toObject ? user.toObject() : user;
  delete data.password;
  return data;
};

const setAuthCookie = (res, token) => res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

const register = async (req, res, next) => {
  try {
    const { name, username, email, password, role } = req.body;
    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }] });
    if (existing) return res.status(409).json({ success: false, message: 'Email or username is already in use' });
    const user = await User.create({ name, username, email, password, role });
    const token = generateToken(user._id);
    setAuthCookie(res, token);
    res.status(201).json({ success: true, message: 'Registration successful', data: { user: userResponse(user), token } });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(req.body.password))) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    user.isOnline = true;
    await user.save();
    const token = generateToken(user._id);
    setAuthCookie(res, token);
    res.json({ success: true, message: 'Login successful', data: { user: userResponse(user), token } });
  } catch (error) { next(error); }
};

const me = (req, res) => res.json({ success: true, message: 'Current user', data: { user: req.user } });

const logout = async (req, res, next) => {
  try {
    if (req.user) await User.findByIdAndUpdate(req.user._id, { isOnline: false });
    res.clearCookie('token');
    res.json({ success: true, message: 'Logged out successfully', data: {} });
  } catch (error) { next(error); }
};

module.exports = { register, login, me, logout };
