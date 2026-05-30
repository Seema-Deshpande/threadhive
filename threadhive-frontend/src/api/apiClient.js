import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
// const API_BASE_URL = "https://w04-mls.onrender.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = 'Bear' + 'er ' + token;
  }

  return config;
});

export const fetchAPI = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers, ...rest } = options;

  let data = rest.data;

  if (body !== undefined && data === undefined) {
    if (typeof body === 'string') {
      try {
        data = JSON.parse(body);
      } catch {
        data = body;
      }
    } else {
      data = body;
    }
  }

  try {
    const response = await apiClient.request({
      url: endpoint,
      method,
      headers,
      data,
      ...rest,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const errorData = error.response.data || {};
      const normalizedError = new Error(errorData.message || 'API Error');
      normalizedError.response = {
        status: error.response.status,
        data: errorData,
      };
      throw normalizedError;
    }

    throw error;
  }
};

export default apiClient;
