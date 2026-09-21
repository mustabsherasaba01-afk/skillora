const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const User = require('../models/User');
const Notification = require('../models/Notification');

const listProjects = async (req, res, next) => {
  try {
    const { search, category, skill, minBudget, maxBudget, experience, sort = 'newest' } = req.query;
    const filter = { status: 'open' };
    if (search) filter.$or = [{ title: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
    if (category) filter.category = category;
    if (skill) filter.skills = { $regex: skill, $options: 'i' };
    if (experience) filter.experienceLevel = experience;
    if (minBudget || maxBudget) filter.budget = { ...(minBudget && { $gte: Number(minBudget) }), ...(maxBudget && { $lte: Number(maxBudget) }) };
    const projects = await Project.find(filter).populate('client', 'name username profileImage').populate('hiredFreelancer', 'name username').sort(sort === 'budget-high' ? { budget: -1 } : { createdAt: -1 });
    res.json({ success: true, message: 'Projects retrieved', data: projects });
  } catch (error) { next(error); }
};

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('client', 'name username profileImage').populate('hiredFreelancer', 'name username');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, message: 'Project retrieved', data: project });
  } catch (error) { next(error); }
};

const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({ ...req.body, client: req.user._id, attachments: req.files?.map((file) => `/uploads/${file.filename}`) || [] });
    res.status(201).json({ success: true, message: 'Project created successfully', data: await project.populate('client', 'name username') });
  } catch (error) { next(error); }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (!project.client.equals(req.user._id)) return res.status(403).json({ success: false, message: 'Only the project client can update it' });
    if (project.status !== 'open') return res.status(400).json({ success: false, message: 'Only open projects can be updated' });
    Object.assign(project, req.body);
    if (req.files?.length) project.attachments.push(...req.files.map((file) => `/uploads/${file.filename}`));
    await project.save();
    res.json({ success: true, message: 'Project updated successfully', data: project });
  } catch (error) { next(error); }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, client: req.user._id, status: 'open' });
    if (!project) return res.status(404).json({ success: false, message: 'Open project not found for this client' });
    await Proposal.deleteMany({ project: project._id });
    res.json({ success: true, message: 'Project deleted successfully', data: {} });
  } catch (error) { next(error); }
};

const myProjects = async (req, res, next) => {
  try { res.json({ success: true, message: 'Your projects retrieved', data: await Project.find({ client: req.user._id }).populate('hiredFreelancer', 'name username').sort({ createdAt: -1 }) }); } catch (error) { next(error); }
};

const recommendedProjects = async (req, res, next) => {
  try { res.json({ success: true, message: 'Recommended projects retrieved', data: await Project.find({ status: 'open', skills: { $in: req.user.skills || [] } }).populate('client', 'name username').sort({ createdAt: -1 }).limit(20) }); } catch (error) { next(error); }
};

const completeProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || !project.hiredFreelancer) return res.status(404).json({ success: false, message: 'Active hired project not found' });
    if (!project.client.equals(req.user._id) && !project.hiredFreelancer.equals(req.user._id)) return res.status(403).json({ success: false, message: 'Only project participants can complete it' });
    if (project.status !== 'in-progress') return res.status(400).json({ success: false, message: 'Project is not in progress' });
    project.status = 'completed';
    await project.save();
    await User.findByIdAndUpdate(project.hiredFreelancer, { $inc: { completedProjects: 1, totalEarnings: project.budget } });
    await Notification.create([
      { recipient: project.client, sender: req.user._id, type: 'projectCompleted', message: `Project "${project.title}" was completed`, relatedProject: project._id },
      { recipient: project.hiredFreelancer, sender: req.user._id, type: 'projectCompleted', message: `Project "${project.title}" was completed`, relatedProject: project._id }
    ]);
    res.json({ success: true, message: 'Project completed successfully', data: project });
  } catch (error) { next(error); }
};

module.exports = { listProjects, getProject, createProject, updateProject, deleteProject, myProjects, recommendedProjects, completeProject };
