const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const isParticipant = (conversation, userId) => conversation.participants.some((participant) => participant.equals(userId));

const createConversation = async (req, res, next) => {
  try {
    const { participantId, project } = req.body;
    if (!participantId || participantId === String(req.user._id)) return res.status(400).json({ success: false, message: 'A different participant is required' });
    const other = await User.findById(participantId);
    if (!other) return res.status(404).json({ success: false, message: 'Participant not found' });
    let conversation = await Conversation.findOne({ participants: { $all: [req.user._id, participantId] }, ...(project ? { project } : {}) });
    if (!conversation) conversation = await Conversation.create({ participants: [req.user._id, participantId], project: project || null });
    res.status(201).json({ success: true, message: 'Conversation ready', data: await conversation.populate('participants', 'name username profileImage isOnline') });
  } catch (error) { next(error); }
};

const conversations = async (req, res, next) => {
  try { res.json({ success: true, message: 'Conversations retrieved', data: await Conversation.find({ participants: req.user._id }).populate('participants', 'name username profileImage isOnline').populate('project', 'title').populate('lastMessage').sort({ updatedAt: -1 }) }); } catch (error) { next(error); }
};

const conversationMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    if (!conversation || !isParticipant(conversation, req.user._id)) return res.status(404).json({ success: false, message: 'Conversation not found' });
    await Message.updateMany({ conversation: conversation._id, receiver: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'Messages retrieved', data: await Message.find({ conversation: conversation._id }).populate('sender', 'name username profileImage').sort({ createdAt: 1 }) });
  } catch (error) { next(error); }
};

const sendMessage = async ({ conversationId, text, attachment, receiver }, senderId) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !isParticipant(conversation, senderId) || !conversation.participants.some((participant) => participant.equals(receiver))) throw new Error('Conversation or receiver is invalid');
  const message = await Message.create({ conversation: conversationId, sender: senderId, receiver, text, attachment });
  conversation.lastMessage = message._id;
  await conversation.save();
  return message.populate('sender', 'name username profileImage');
};

module.exports = { createConversation, conversations, conversationMessages, sendMessage };
