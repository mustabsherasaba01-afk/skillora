import api from './api';

export const getFreelancers = (params) => api.get('/users/freelancers', { params });
export const getUser = (id) => api.get(`/users/${id}`);
export const updateProfile = (data, config) => api.put('/users/profile', data, config);
export const getNotifications = () => api.get('/notifications');
export const getFavorites = () => api.get('/favorites');
