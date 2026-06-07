import api from './api'

export const leadService = {
  submit: async (data) => {
    const response = await api.post('/leads', data)
    return response.data
  },

  getAll: async () => {
    const response = await api.get('/leads')
    return response.data
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/leads/${id}`, { status })
    return response.data
  },
}
