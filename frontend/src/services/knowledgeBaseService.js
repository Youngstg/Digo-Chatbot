import api from './api'

export const knowledgeBaseService = {
  getAll: async () => {
    const response = await api.get('/knowledge-base')
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/knowledge-base', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/knowledge-base/${id}`, data)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/knowledge-base/${id}`)
    return response.data
  },
}
