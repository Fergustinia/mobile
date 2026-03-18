

export type Resume = {
  id: string;
  name: string;
  fullName?: string;
  experience?: number;
  skills?: string[];
  education?: string;
  contacts?: string;
  template?: string;
  isRecommended?: boolean;
  updatedAt?: string;
};


export const RESUME_TEMPLATES = [
  { id: 'standard', name: 'Стандартный', color: '#007AFF' },
  { id: 'student', name: 'Для студентов', color: '#4CAF50' },
  { id: 'it', name: 'Для IT', color: '#9C27B0' },
  { id: 'creative', name: 'Креативный', color: '#FF5722' },
  { id: 'minimal', name: 'Минимализм', color: '#607D8B' },
] as const;

export type TemplateId = typeof RESUME_TEMPLATES[number]['id'];
