import { Resume } from '../../data/mocks/resumes';
import {
    getCurrentUser,
    updateUser
} from './auth';

export const resumeStorage = {
  // Получить все резюме текущего пользователя
  async getAll(): Promise<Resume[]> {
    const user = await getCurrentUser();
    return user?.resumes || [];
  },

  // Создать новое резюме
  async create(resume: Omit<Resume, 'id'>): Promise<Resume> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Пользователь не авторизован');

    const newResume: Resume = {
      ...resume,
      id: crypto.randomUUID(),
    };

    const updatedUser = {
      ...user,
      resumes: [...user.resumes, newResume],
    };

    await updateUser(updatedUser);
    return newResume;
  },

  // Обновить резюме
  async update(id: string, updates: Partial<Resume>): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Пользователь не авторизован');

    const updatedResumes = user.resumes.map(r => 
      r.id === id ? { ...r, ...updates } : r
    );

    await updateUser({ ...user, resumes: updatedResumes });
  },

  // Удалить резюме
  async delete(id: string): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Пользователь не авторизован');

    const filteredResumes = user.resumes.filter(r => r.id !== id);
    await updateUser({ ...user, resumes: filteredResumes });
  },

  // Получить одно резюме по ID
  async getById(id: string): Promise<Resume | null> {
    const resumes = await this.getAll();
    return resumes.find(r => r.id === id) || null;
  },
};