const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

const createProposal = async (req, res, next) => {
  try {
    const project = await Project.findById(req.body.project);
    if (!project || project.status !== 'open') return res.status(400).json({ success: false, message: 'Project is not open for proposals' });
    if (project.client.equals(req.user._id)) return res.status(403).json({ success: false, message: 'Clients cannot submit proposals to their own projects' });
    const proposal = await Proposal.create({ ...req.body, freelancer: req.user._id, attachments: req.files?.map((file) => `/uploads/${file.filename}`) || [] });
    await Project.findByIdAndUpdate(project._id, { $inc: { proposalsCount: 1 } });
    await Notification.create({ recipient: project.client, sender: req.user._id, type: 'proposal', message: `New proposal for "${project.title}"`, relatedProject: project._id, relatedProposal: proposal._id });
    res.status(201).json({ success: true, message: 'Proposal submitted successfully', data: await proposal.populate('freelancer', 'name username profileImage rating') });
  } catch (error) { next(error); }
};

const projectProposals = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, client: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found for this client' });
    res.json({ success: true, message: 'Proposals retrieved', data: await Proposal.find({ project: project._id }).populate('freelancer', '-password').sort({ createdAt: -1 }) });
  } catch (error) { next(error); }
};

const myProposals = async (req, res, next) => {
  try { res.json({ success: true, message: 'Your proposals retrieved', data: await Proposal.find({ freelancer: req.user._id }).populate('project').sort({ createdAt: -1 }) }); } catch (error) { next(error); }
};

const acceptProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('project');
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });
    if (!proposal.project.client.equals(req.user._id)) return res.status(403).json({ success: false, message: 'Only the project client can accept proposals' });
    if (proposal.status !== 'pending' || proposal.project.status !== 'open') return res.status(400).json({ success: false, message: 'Proposal is no longer available' });
    proposal.status = 'accepted';
    await proposal.save();
    proposal.project.status = 'in-progress';
    proposal.project.hiredFreelancer = proposal.freelancer;
    await proposal.project.save();
    const rejected = await Proposal.updateMany({ project: proposal.project._id, _id: { $ne: proposal._id }, status: 'pending' }, { status: 'rejected' });
    await Notification.create([
      { recipient: proposal.freelancer, sender: req.user._id, type: 'proposalAccepted', message: `Your proposal for "${proposal.project.title}" was accepted`, relatedProject: proposal.project._id, relatedProposal: proposal._id },
      { recipient: req.user._id, sender: req.user._id, type: 'proposalAccepted', message: `You accepted a proposal for "${proposal.project.title}"`, relatedProject: proposal.project._id, relatedProposal: proposal._id }
    ]);
    const rejectedProposals = await Proposal.find({ project: proposal.project._id, status: 'rejected', _id: { $ne: proposal._id } }).select('freelancer');
    if (rejected.modifiedCount) await Notification.insertMany(rejectedProposals.map((item) => ({ recipient: item.freelancer, sender: req.user._id, type: 'proposalRejected', message: `Your proposal for "${proposal.project.title}" was not selected`, relatedProject: proposal.project._id })));
    res.json({ success: true, message: 'Proposal accepted successfully', data: proposal });
  } catch (error) { next(error); }
};

const rejectProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('project');
    if (!proposal || !proposal.project.client.equals(req.user._id)) return res.status(404).json({ success: false, message: 'Proposal not found for this client' });
    proposal.status = 'rejected';
    await proposal.save();
    await Notification.create({ recipient: proposal.freelancer, sender: req.user._id, type: 'proposalRejected', message: `Your proposal for "${proposal.project.title}" was rejected`, relatedProject: proposal.project._id, relatedProposal: proposal._id });
    res.json({ success: true, message: 'Proposal rejected', data: proposal });
  } catch (error) { next(error); }
};

const withdrawProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findOneAndUpdate({ _id: req.params.id, freelancer: req.user._id, status: 'pending' }, { status: 'withdrawn' }, { new: true });
    if (!proposal) return res.status(404).json({ success: false, message: 'Pending proposal not found' });
    await Project.findByIdAndUpdate(proposal.project, { $inc: { proposalsCount: -1 } });
    res.json({ success: true, message: 'Proposal withdrawn', data: proposal });
  } catch (error) { next(error); }
};

module.exports = { createProposal, projectProposals, myProposals, acceptProposal, rejectProposal, withdrawProposal };
