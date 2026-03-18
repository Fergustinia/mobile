import { Resume } from '../../data/mocks/resumes';
import { getCurrentUser, updateUser } from './auth';

const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

export const resumeStorage = {
  // Получаем резюме из хранилища пользователя
  async getAll(): Promise<Resume[]> {
    const user = await getCurrentUser();
    // Если пользователь есть, возвращаем его резюме, иначе пустой массив
    return user?.resumes || [];
  },

  // Создаем новое резюме и сохраняем обновленного пользователя
  async create(resumeData: Omit<Resume, 'id' | 'updatedAt'>): Promise<Resume> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Пользователь не авторизован');

    const newResume: Resume = {
      ...resumeData,
      id: generateId(),
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = {
      ...user,
      resumes: [...user.resumes, newResume],
    };

    await updateUser(updatedUser);
    return newResume;
  },

  // Обновляем существующее
  async update(id: string, updates: Partial<Resume>): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Пользователь не авторизован');

    const updatedResumes = user.resumes.map((r) =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    );

    await updateUser({ ...user, resumes: updatedResumes });
  },

  // Удаляем резюме
  async delete(id: string): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error('Пользователь не авторизован');

    const filteredResumes = user.resumes.filter((r) => r.id !== id);
    
    await updateUser({ ...user, resumes: filteredResumes });
  },

  async getById(id: string): Promise<Resume | null> {
    const resumes = await this.getAll();
    return resumes.find((r) => r.id === id) || null;
  },
};