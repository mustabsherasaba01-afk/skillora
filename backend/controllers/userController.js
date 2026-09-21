const User = require('../models/User');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const listUsers = async (req, res, next) => {
  try {
    const users = await User.find(req.query.role ? { role: req.query.role } : {}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, message: 'Users retrieved', data: users });
  } catch (error) { next(error); }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User retrieved', data: user });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'bio', 'title', 'location', 'skills', 'hourlyRate', 'experience', 'portfolio', 'profileImage'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (req.file) updates.profileImage = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) { next(error); }
};

const listFreelancers = async (req, res, next) => {
  try {
    const { skill, minRating, maxHourlyRate, experience, search } = req.query;
    const filter = { role: 'freelancer' };
    if (skill) filter.skills = { $in: [new RegExp(`^${escapeRegExp(skill)}$`, 'i')] };
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (maxHourlyRate) filter.hourlyRate = { $lte: Number(maxHourlyRate) };
    if (experience) filter.experience = experience;
    if (search) filter.$or = [{ name: new RegExp(search, 'i') }, { title: new RegExp(search, 'i') }, { bio: new RegExp(search, 'i') }];
    const users = await User.find(filter).select('-password').sort({ rating: -1 });
    res.json({ success: true, message: 'Freelancers retrieved', data: users });
  } catch (error) { next(error); }
};

module.exports = { listUsers, getUser, updateProfile, listFreelancers };
