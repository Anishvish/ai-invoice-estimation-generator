import axios from 'axios';

export const API_BASE_URL = 'http://10.0.2.2:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectApi = {
  list: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post('/projects', payload);
    return response.data;
  },
};

export const companyApi = {
  list: async () => {
    const response = await api.get('/companies');
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post('/companies', payload);
    return response.data;
  },
};

export const estimateApi = {
  calculate: async (payload) => {
    const response = await api.post('/estimate/calculate', payload);
    return response.data;
  },
};

export const invoiceApi = {
  generate: async (payload) => {
    const response = await api.post('/invoice/generate', payload);
    return response.data;
  },
  downloadUrl: (invoiceId) => `${API_BASE_URL}/invoice/${invoiceId}/download`,
};

export const aiApi = {
  parse: async (input) => {
    const response = await api.post('/ai/parse', { input });
    return response.data;
  },
};

export const materialApi = {
  list: async () => {
    const response = await api.get('/materials');
    return response.data;
  },
};

export default api;
