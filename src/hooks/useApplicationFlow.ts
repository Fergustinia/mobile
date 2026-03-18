import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getCurrentUser, updateUser, VacancyResponse } from '../app/storage/auth';
import { resumeStorage } from '@/app/storage/resume';
import { allVacancies } from '@/data/mocks/vacancydata';
import { checkSkillsMatch } from '../domain/usecases/checkSkillsMatch';

export const useApplicationFlow = (vacancyId: string) => {
  const [modalStep, setModalStep] = useState<'hidden' | 'confirm' | 'warning' | 'success' | 'error'>('hidden');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [availableResumes, setAvailableResumes] = useState<any[]>([]);

  // 🔥 ЗАГРУЗКА РЕЗЮМЕ ИЗ STORAGE
  useEffect(() => {
    const load = async () => {
      const data = await resumeStorage.getAll();
      setAvailableResumes(data);
    };

    load();
  }, []);

  const startApplication = useCallback(() => {
    setModalStep('confirm');
    setSelectedResumeId('');
  }, []);

  const cancelApplication = useCallback(() => {
    setModalStep('hidden');
    setSelectedResumeId('');
  }, []);

  const saveApplicationLocally = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const alreadyExists = user.responses?.some(r => r.vacancyId === vacancyId);
    if (alreadyExists) return;

    const newResponse: VacancyResponse = {
      vacancyId,
      respondedAt: new Date().toLocaleDateString('ru-RU'),
      status: 'Рассматривается',
    };

    await updateUser({
      ...user,
      responses: [...(user.responses || []), newResponse],
    });
  };

  const handleConfirmResume = useCallback(async () => {
    if (!selectedResumeId) {
      Alert.alert('Ошибка', 'Выберите резюме');
      return;
    }
  
    setLoading(true);
  
    try {
      const resumes = await resumeStorage.getAll();
      const selectedResume = resumes.find(r => r.id === selectedResumeId);
  
      if (!selectedResume) {
        throw new Error('Резюме не найдено');
      }
  
      const vacancy = allVacancies.find(v => v.id === vacancyId);
  
      if (!vacancy) {
        throw new Error('Вакансия не найдена');
      }
  
      // 🔍 ЛОГИ ДЛЯ ДЕБАГА
      console.log('Resume:', selectedResume);
      console.log('Vacancy:', vacancy);
  
      const resumeSkills = selectedResume.skills || [];
      const vacancySkills = vacancy.skills || [];
  
      const { isMatch, matchPercent } = checkSkillsMatch(
        resumeSkills,
        vacancySkills
      );
  
      console.log('Match:', matchPercent);
  
      // 🔥 ВОТ ЭТО ВАЖНО
      if (!isMatch) {
        Alert.alert('Недостаточное совпадение', `${matchPercent}%`);
        setModalStep('warning');
        return;
      }
  
      await submitApplication();
  
    } catch (err) {
      console.error('ERROR:', err); // 🔥 теперь видно причину
      Alert.alert('Ошибка', String(err));
      setModalStep('error');
    } finally {
      setLoading(false);
    }
  }, [selectedResumeId, vacancyId]);

  const handleIgnoreWarning = useCallback(async () => {
    await submitApplication();
  }, [selectedResumeId]);

  const submitApplication = useCallback(async () => {
    setLoading(true);

    try {
      // ❌ убрали mockServer
      // теперь просто локально сохраняем
      await saveApplicationLocally();

      setModalStep('success');
      Alert.alert('Успех', 'Отклик отправлен!');

      setTimeout(cancelApplication, 1500);
    } catch (err) {
      console.error(err);
      Alert.alert('Ошибка', 'Не удалось отправить отклик');
      setModalStep('error');
    } finally {
      setLoading(false);
    }
  }, [selectedResumeId, cancelApplication]);

  return {
    modalStep,
    loading,
    selectedResumeId,
    setSelectedResumeId,
    availableResumes, // ✅ теперь реальные данные
    startApplication,
    cancelApplication,
    handleConfirmResume,
    handleIgnoreWarning,
  };
};