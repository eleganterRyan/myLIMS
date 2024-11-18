import api from './api';
import { Laboratory } from '../types/research';

export const createLaboratory = async (data: Partial<Laboratory>) => {
  const response = await api.post('/laboratories', data);
  return response.data;
};

export const getLaboratories = async () => {
  const response = await api.get<Laboratory[]>('/laboratories');
  return response.data;
};

export const updateLaboratory = async (id: number, data: Partial<Laboratory>) => {
  const response = await api.put(`/laboratories/${id}`, data);
  return response.data;
};

export const deleteLaboratory = async (id: number) => {
  const response = await api.delete(`/laboratories/${id}`);
  return response.data;
}; 