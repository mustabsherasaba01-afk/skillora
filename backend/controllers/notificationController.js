const Notification = require('../models/Notification');

const listNotifications = async (req, res, next) => {
  try { res.json({ success: true, message: 'Notifications retrieved', data: await Notification.find({ recipient: req.user._id }).populate('sender', 'name username').populate('relatedProject', 'title').sort({ createdAt: -1 }) }); } catch (error) { next(error); }
};
const markRead = async (req, res, next) => {
  try { const item = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true }, { new: true }); if (!item) return res.status(404).json({ success: false, message: 'Notification not found' }); res.json({ success: true, message: 'Notification marked as read', data: item }); } catch (error) { next(error); }
};
const markAllRead = async (req, res, next) => { try { await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true }); res.json({ success: true, message: 'Notifications marked as read', data: {} }); } catch (error) { next(error); } };
const deleteNotification = async (req, res, next) => { try { const item = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id }); if (!item) return res.status(404).json({ success: false, message: 'Notification not found' }); res.json({ success: true, message: 'Notification deleted', data: {} }); } catch (error) { next(error); } };
module.exports = { listNotifications, markRead, markAllRead, deleteNotification };
