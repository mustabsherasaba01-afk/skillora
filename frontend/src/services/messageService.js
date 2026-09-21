import api from './api';

export const getConversations = () => api.get('/messages/conversations');
export const getMessages = (id) => api.get(`/messages/${id}`);
export const createConversation = (data) => api.post('/messages/conversation', data);
