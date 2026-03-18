import { apiMocks } from './api-mocks';

// ✅ Изменили тип: сделали дополнительные поля необязательными (?)
// и исправили типы skills (массив) и experience (число)
export type Resume = {
  id: string;
  name: string;
  fullName?: string;        // Теперь необязательное (?)
  experience?: number;      // Теперь число и необязательное (?)
  skills?: string[];        // Теперь массив и необязательное (?)
  education?: string;       // Теперь необязательное (?)
  contacts?: string;        // Теперь необязательное (?)
  template?: string;        // Теперь необязательное (?)
  isRecommended?: boolean;
  updatedAt?: string;
};

// ✅ Убрали 'readonly' из объявления массива, чтобы типы совпадали
export const resumes: Resume[] = apiMocks.resumes as Resume[];

export const vacancyMock = apiMocks.vacancy;

export const RESUME_TEMPLATES = [
  { id: 'standard', name: 'Стандартный', color: '#007AFF' },
  { id: 'student', name: 'Для студентов', color: '#4CAF50' },
  { id: 'it', name: 'Для IT', color: '#9C27B0' },
  { id: 'creative', name: 'Креативный', color: '#FF5722' },
  { id: 'minimal', name: 'Минимализм', color: '#607D8B' },
] as const;

export type TemplateId = typeof RESUME_TEMPLATES[number]['id'];