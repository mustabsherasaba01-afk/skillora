const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  type: { type: String, enum: ['proposal', 'proposalAccepted', 'proposalRejected', 'message', 'projectCompleted', 'review', 'deadline', 'system'], required: true },
  message: { type: String, required: true },
  relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  relatedProposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', default: null },
  isRead: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false } });
module.exports = mongoose.model('Notification', notificationSchema);
