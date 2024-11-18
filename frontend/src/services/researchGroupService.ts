import api from './api';
import { ResearchGroup, CreateResearchGroupDto } from '../types/research';

export const createResearchGroup = async (data: CreateResearchGroupDto) => {
  const response = await api.post('/research-groups', data);
  return response.data;
};

export const getResearchGroups = async () => {
  const response = await api.get('/research-groups');
  return response.data;
};

export const updateResearchGroup = async (id: number, data: Partial<CreateResearchGroupDto>) => {
  const response = await api.put(`/research-groups/${id}`, data);
  return response.data;
};

export const deleteResearchGroup = async (id: number) => {
  const response = await api.delete(`/research-groups/${id}`);
  return response.data;
}; 