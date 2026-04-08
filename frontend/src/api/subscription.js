import api from './axios'

export const getStatus = () => api.get('/subscription/status')
export const upgrade = () => api.post('/subscription/upgrade')
