import api from './axios';

export const fuelApi = {
  getAll: async () => {
    const response = await api.get('/fuel');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/fuel/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/fuel', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/fuel/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/fuel/${id}`);
    return response.data;
  }
};

export default fuelApi;
