import api from './api';

const competencyService = {
  // Get all competencies
  getAll: async (params = {}) => {
    const response = await api.get('/competencies', { params });
    return response.data;
  },

  // Get single competency
  getById: async (id) => {
    const response = await api.get(`/competencies/${id}`);
    return response.data;
  },

  // Create competency
  create: async (competencyData) => {
    const response = await api.post('/competencies', competencyData);
    return response.data;
  },

  // Update competency
  update: async (id, competencyData) => {
    const response = await api.put(`/competencies/${id}`, competencyData);
    return response.data;
  },

  // Delete competency
  delete: async (id) => {
    const response = await api.delete(`/competencies/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/competencies/categories');
    return response.data;
  }
};

export default competencyService;
