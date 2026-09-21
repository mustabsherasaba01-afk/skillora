import api from './api';

export const createProposal = (data, config) => api.post('/proposals', data, config);
export const getProjectProposals = (projectId) => api.get(`/proposals/project/${projectId}`);
export const getMyProposals = () => api.get('/proposals/my-proposals');
export const acceptProposal = (id) => api.put(`/proposals/${id}/accept`);
export const rejectProposal = (id) => api.put(`/proposals/${id}/reject`);
