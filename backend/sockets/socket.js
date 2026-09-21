const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendMessage } = require('../controllers/messageController');

const initializeSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers.cookie?.split(';').map((item) => item.trim()).find((item) => item.startsWith('token='))?.split('=')[1];
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = await User.findById(decoded.id).select('-password');
      if (!socket.user) return next(new Error('User not found'));
      next();
    } catch (error) { next(new Error('Invalid socket token')); }
  });

  io.on('connection', async (socket) => {
    const userId = String(socket.user._id);
    socket.join(`user:${userId}`);
    await User.findByIdAndUpdate(userId, { isOnline: true });
    io.emit('userOnline', { userId });

    socket.on('joinConversation', (conversationId) => socket.join(`conversation:${conversationId}`));
    socket.on('sendMessage', async (payload, callback) => {
      try {
        const message = await sendMessage(payload, userId);
        const messageData = message.toObject();
        io.to(`conversation:${payload.conversationId}`).emit('receiveMessage', messageData);
        io.to(`user:${payload.receiver}`).emit('message', messageData);
        await Notification.create({ recipient: payload.receiver, sender: userId, type: 'message', message: 'You have received a new message' });
        if (callback) callback({ success: true, data: messageData });
      } catch (error) { if (callback) callback({ success: false, message: error.message }); }
    });
    socket.on('typing', ({ conversationId, receiver }) => io.to(`user:${receiver}`).emit('typing', { conversationId, userId }));
    socket.on('stopTyping', ({ conversationId, receiver }) => io.to(`user:${receiver}`).emit('stopTyping', { conversationId, userId }));
    socket.on('messageRead', async ({ messageId, conversationId }) => { const Message = require('../models/Message'); await Message.findOneAndUpdate({ _id: messageId, receiver: userId }, { read: true }); io.to(`conversation:${conversationId}`).emit('messageRead', { messageId }); });
    socket.on('disconnect', async () => { await User.findByIdAndUpdate(userId, { isOnline: false }); io.emit('userOffline', { userId }); });
  });
};
module.exports = initializeSocket;
