import api from './axios'

export const getLevels = (professionId) =>
  api.get('/levels', { params: { profession_id: professionId } })

export const getLevel = (id) => api.get(`/levels/${id}`)

export const submitAnswer = (levelId, answer) =>
  api.post(`/levels/${levelId}/submit`, { answer })
