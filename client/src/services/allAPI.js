import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001', // Backend URL
});

// auth

export const register = (formData) => API.post('/register', formData);

export const login = (formData) => API.post('/login', formData);

// templates

export const createTemplate = (template) =>
  API.post('/template', template);

export const fetchAllTemplates = () => API.get('/template/all');

export const fetchTemplateById = (templateId) =>
  API.get(`/template/${templateId}`);

// responses

export const submitResponse = (response) =>
  API.post('/response', response);

export const fetchTemplateResponses = (templateId) => {
  return API.get(`/responses/template/${templateId}`);
};
