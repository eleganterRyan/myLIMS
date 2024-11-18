import api from './api';
import { LoginForm, LoginResponse } from '../types/auth';

export const login = async (data: LoginForm): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = () => localStorage.getItem('token');

export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const setUser = (user: LoginResponse['user']) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}; 