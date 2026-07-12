import api from './axios';

export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Expected format: { token, user: { name, email, role, avatar } }
  },
  register: async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data; // Expected format: { token, user: { name, email, role, avatar } }
  }
};

export default authApi;
