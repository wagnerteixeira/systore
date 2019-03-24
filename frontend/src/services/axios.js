import axios from 'axios';
import localStorageService from '../localStorage/localStorageService';

// Default config options
const defaultOptions = {
  baseURL: process.env.REACT_APP_API_PATH,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create instance
let instance = axios.create(defaultOptions);

// Set the AUTH token for any request
instance.interceptors.request.use((config) => {
  const token = localStorageService.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export default instance;