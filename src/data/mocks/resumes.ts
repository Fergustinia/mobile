import { apiMocks } from './api-mocks';

export type Resume = {
  id: string;
  name: string;              // Название/профессия
  fullName: string;          // ФИО
  experience: string;        // Опыт (текст)
  skills: string;            // Навыки (текст)
  education: string;         // Образование
  contacts: string;          // Контакты
  template: string;          // Выбранный шаблон
  isRecommended: boolean;
  updatedAt?: string;        // Дата обновления
};

export const resumes: readonly Resume[] = apiMocks.resumes;
export const vacancyMock = apiMocks.vacancy;

// Шаблоны резюме
export const RESUME_TEMPLATES = [
  { id: 'standard', name: 'Стандартный', color: '#007AFF' },
  { id: 'student', name: 'Для студентов', color: '#4CAF50' },
  { id: 'it', name: 'Для IT', color: '#9C27B0' },
  { id: 'creative', name: 'Креативный', color: '#FF5722' },
  { id: 'minimal', name: 'Минимализм', color: '#607D8B' },
] as const;

export type TemplateId = typeof RESUME_TEMPLATES[number]['id'];