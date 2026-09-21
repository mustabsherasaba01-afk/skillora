const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const User = require('../models/User');

const clientDashboard = async (req, res, next) => {
  try {
    const [counts, spending, recentProjects, recentProposals] = await Promise.all([
      Project.aggregate([{ $match: { client: req.user._id } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Project.aggregate([{ $match: { client: req.user._id, status: 'completed' } }, { $group: { _id: null, total: { $sum: '$budget' } } }]),
      Project.find({ client: req.user._id }).sort({ createdAt: -1 }).limit(5),
      Proposal.find({ project: { $in: await Project.find({ client: req.user._id }).distinct('_id') } }).populate('project', 'title').populate('freelancer', 'name username').sort({ createdAt: -1 }).limit(5)
    ]);
    const byStatus = Object.fromEntries(counts.map((item) => [item._id, item.count]));
    res.json({ success: true, message: 'Client dashboard retrieved', data: { totalProjects: Object.values(byStatus).reduce((sum, value) => sum + value, 0), activeProjects: (byStatus.open || 0) + (byStatus['in-progress'] || 0), completedProjects: byStatus.completed || 0, totalSpending: spending[0]?.total || 0, recentProjects, recentProposals, spendingStatistics: spending } });
  } catch (error) { next(error); }
};

const freelancerDashboard = async (req, res, next) => {
  try {
    const [user, activeProjects, completedProjects, proposalStats, recommendedProjects] = await Promise.all([
      User.findById(req.user._id).select('totalEarnings completedProjects rating reviewCount'),
      Project.find({ hiredFreelancer: req.user._id, status: 'in-progress' }).populate('client', 'name username'),
      Project.find({ hiredFreelancer: req.user._id, status: 'completed' }).select('title budget createdAt'),
      Proposal.aggregate([{ $match: { freelancer: req.user._id } }, { $group: { _id: null, total: { $sum: 1 }, accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } } } }]),
      Project.find({ status: 'open', skills: { $in: req.user.skills || [] } }).sort({ createdAt: -1 }).limit(5)
    ]);
    const stats = proposalStats[0] || { total: 0, accepted: 0 };
    res.json({ success: true, message: 'Freelancer dashboard retrieved', data: { totalEarnings: user.totalEarnings, activeProjects, completedProjects, averageRating: user.rating, proposalSuccessRate: stats.total ? Math.round((stats.accepted / stats.total) * 100) : 0, recommendedProjects, earningsStatistics: completedProjects } });
  } catch (error) { next(error); }
};
module.exports = { clientDashboard, freelancerDashboard };
