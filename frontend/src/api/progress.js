import api from './axios'

export const getMyProgress = () => api.get('/progress/me')
export const getProfessionProgress = (professionId) =>
  api.get(`/progress/me/${professionId}`)
