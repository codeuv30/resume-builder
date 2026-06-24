import api from '../api';
import type { Resume, PersonalInfo, ApiResponse } from '@/types/resume';

export const createResume = () => 
  api.post<ApiResponse<Resume>>('/resume/create');

export const getResume = (id: string) => 
  api.get<ApiResponse<Resume>>(`/resume/${id}`);

export const updateResume = (id: string, data: Partial<Resume>) => 
  api.patch<ApiResponse<Resume>>(`/resume/${id}`, data);

export const getPersonalInfo = (resumeId: string) => 
  api.get<ApiResponse<PersonalInfo>>(`/resume/${resumeId}/personal-info`);

export const updatePersonalInfo = (resumeId: string, data: Partial<PersonalInfo>) => 
  api.patch<ApiResponse<PersonalInfo>>(`/resume/${resumeId}/personal-info`, data);