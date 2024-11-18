import api from './api';
import { User } from '../types/auth';

export const getUsers = async () => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getUsersByRole = async (role: string) => {
  const response = await api.get<User[]>(`/users/role/${role}`);
  return response.data;
}; 