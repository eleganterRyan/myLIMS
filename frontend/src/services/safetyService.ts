import api from './api';
import { SafetyTask } from '../types/safety';

export const createSafetyTask = async (data: Partial<SafetyTask>) => {
  const response = await api.post('/safety/tasks', data);
  return response.data;
};

export const getSafetyTasks = async () => {
  const response = await api.get('/safety/tasks');
  return response.data;
};

export const updateSafetyTask = async (id: number, data: Partial<SafetyTask>) => {
  const response = await api.put(`/safety/tasks/${id}`, data);
  return response.data;
}; 