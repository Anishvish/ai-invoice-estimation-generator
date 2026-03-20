import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8080',
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
