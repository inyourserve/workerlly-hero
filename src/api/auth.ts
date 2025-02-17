import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.workerlly.in/api/v1"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = async (data: any) => {
  const response = await api.post('/register', data);
  return response.data;
};

export const verifyRegistration = async (data: any) => {
  const response = await api.post('/verify-registration', data);
  return response.data;
};

export const login = async (data: any) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const verifyLogin = async (data: any) => {
  const response = await api.post('/verify-login', data);
  return response.data;
};

