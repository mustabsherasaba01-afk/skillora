const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null }
}, { timestamps: { createdAt: true, updatedAt: true } });
conversationSchema.index({ participants: 1, project: 1 });
module.exports = mongoose.model('Conversation', conversationSchema);
