const mongoose = require('mongoose');
const Review = require('../models/Review');
const Project = require('../models/Project');
const User = require('../models/User');
const Notification = require('../models/Notification');

const refreshRating = async (userId) => {
  const stats = await Review.aggregate([{ $match: { reviewee: new mongoose.Types.ObjectId(userId) } }, { $group: { _id: '$reviewee', average: { $avg: '$rating' }, count: { $sum: 1 } } }]);
  const values = stats[0] || { average: 0, count: 0 };
  await User.findByIdAndUpdate(userId, { rating: Math.round(values.average * 100) / 100, reviewCount: values.count });
};

const createReview = async (req, res, next) => {
  try {
    const project = await Project.findById(req.body.project);
    if (!project || project.status !== 'completed') return res.status(400).json({ success: false, message: 'Reviews are available only for completed projects' });
    const participants = [String(project.client), String(project.hiredFreelancer)];
    if (!participants.includes(String(req.user._id)) || String(req.body.reviewee) === String(req.user._id) || !participants.includes(String(req.body.reviewee))) return res.status(403).json({ success: false, message: 'Only project participants can review each other' });
    const review = await Review.create({ ...req.body, reviewer: req.user._id });
    await refreshRating(req.body.reviewee);
    await Notification.create({ recipient: req.body.reviewee, sender: req.user._id, type: 'review', message: `You received a new review for "${project.title}"`, relatedProject: project._id });
    res.status(201).json({ success: true, message: 'Review submitted successfully', data: await review.populate('reviewer reviewee', 'name username profileImage') });
  } catch (error) { next(error); }
};

const listReviews = async (req, res, next) => {
  try { res.json({ success: true, message: 'Reviews retrieved', data: await Review.find({ reviewee: req.params.userId }).populate('reviewer', 'name username profileImage').populate('project', 'title').sort({ createdAt: -1 }) }); } catch (error) { next(error); }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate({ _id: req.params.id, reviewer: req.user._id }, req.body, { new: true, runValidators: true });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await refreshRating(review.reviewee);
    res.json({ success: true, message: 'Review updated successfully', data: review });
  } catch (error) { next(error); }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, reviewer: req.user._id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await refreshRating(review.reviewee);
    res.json({ success: true, message: 'Review deleted successfully', data: {} });
  } catch (error) { next(error); }
};
module.exports = { createReview, listReviews, updateReview, deleteReview };
