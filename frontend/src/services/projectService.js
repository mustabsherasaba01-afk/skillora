import api from './api';

export const getProjects = (params) => api.get('/projects', { params });
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data, config) => api.post('/projects', data, config);
export const getMyProjects = () => api.get('/projects/my-projects');
export const getRecommendedProjects = () => api.get('/projects/recommended');
export const completeProject = (id) => api.put(`/projects/${id}/complete`);
export const favoriteProject = (id) => api.post(`/favorites/project/${id}`);
export const removeFavoriteProject = (id) => api.delete(`/favorites/project/${id}`);
