import api from './axios'

export const getProfessions = (zoneId) =>
  api.get('/professions', { params: { zone_id: zoneId } })

export const getProfession = (id) => api.get(`/professions/${id}`)
