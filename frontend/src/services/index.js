import api from './api';
import competencyService from './competencyService';

export { competencyService };

export const employeeService = {
  getAll: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  create: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },
  update: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/employees/stats/overview');
    return response.data;
  }
};

export const assessmentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/assessments', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  },
  create: async (assessmentData) => {
    const response = await api.post('/assessments', assessmentData);
    return response.data;
  },
  update: async (id, assessmentData) => {
    const response = await api.put(`/assessments/${id}`, assessmentData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  },
  getReports: async (params = {}) => {
    const response = await api.get('/assessments/reports/overview', { params });
    return response.data;
  }
};

export const storeService = {
  getAll: async (params = {}) => {
    const response = await api.get('/stores', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },
  create: async (storeData) => {
    const response = await api.post('/stores', storeData);
    return response.data;
  },
  update: async (id, storeData) => {
    const response = await api.put(`/stores/${id}`, storeData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  },
  getStats: async (id) => {
    const response = await api.get(`/stores/${id}/stats`);
    return response.data;
  }
};

export const positionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/positions', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/positions/${id}`);
    return response.data;
  },
  create: async (positionData) => {
    const response = await api.post('/positions', positionData);
    return response.data;
  },
  update: async (id, positionData) => {
    const response = await api.put(`/positions/${id}`, positionData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/positions/${id}`);
    return response.data;
  }
};
