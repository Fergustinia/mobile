import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { getCurrentUser, updateUser, VacancyResponse } from '../app/storage/auth';

// Домен и данные
import { mockServer } from '../data/mocks/mockServer';
import { resumes } from '../data/mocks/resumes';
import { checkSkillsMatch } from '../domain/usecases/checkSkillsMatch';

export const useApplicationFlow = (vacancyId: string) => {
  const [modalStep, setModalStep] = useState<'hidden' | 'confirm' | 'warning' | 'success' | 'error'>('hidden');
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const startApplication = useCallback(() => {
    setModalStep('confirm');
    setSelectedResumeId('');
  }, []);

  const cancelApplication = useCallback(() => {
    setModalStep('hidden');
    setSelectedResumeId('');
  }, []);


  const saveApplicationLocally = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const newResponse: VacancyResponse = {
          vacancyId: vacancyId,
          vacancyTitle: "React Native Developer", // В будущем можно передавать как аргумент
          company: "TechCorp",
          respondedAt: new Date().toLocaleDateString('ru-RU'),
          status: 'Рассматривается',
        };

        // Добавляем отклик, если его еще нет в списке
        const alreadyExists = user.responses?.some(r => r.vacancyId === vacancyId);
        if (!alreadyExists) {
          user.responses = [...(user.responses || []), newResponse];
          await updateUser(user);
          console.log('Отклик успешно сохранен в AsyncStorage');
        }
      }
    } catch (e) {
      console.error('Ошибка сохранения отклика:', e);
    }
  };

  const handleConfirmResume = useCallback(async () => {
    if (!selectedResumeId) {
      Alert.alert('Ошибка', 'Выберите резюме');
      return;
    }

    setLoading(true);

    try {
      const serverResumes = await mockServer.fetchResumes();
      const resume = serverResumes.find(r => r.id === selectedResumeId);

      if (!resume) {
        Alert.alert('Ошибка', 'Резюме не найдено');
        setLoading(false);
        return;
      }

      const { isMatch } = checkSkillsMatch(resume);

      setLoading(false);

      if (!isMatch) {
        setModalStep('warning');
      } else {
        // Если навыки подходят, вызываем отправку
        await submitApplication();
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
      setModalStep('error');
    }
  }, [selectedResumeId, vacancyId]); // Добавили зависимости


  const handleIgnoreWarning = useCallback(async () => {
    await submitApplication();
  }, [vacancyId, selectedResumeId]);

  const submitApplication = useCallback(async () => {
    setLoading(true);

    try {
      // Имитация сетевого запроса
      await mockServer.submitApplication(vacancyId, selectedResumeId);


      await saveApplicationLocally();

      setModalStep('success');
      Alert.alert('Успех', 'Отклик отправлен!');
      
      setTimeout(cancelApplication, 1500);
    } catch (err) {
      Alert.alert('Ошибка', 'Не удалось отправить отклик');
      setModalStep('error');
    } finally {
      setLoading(false);
    }
  }, [vacancyId, selectedResumeId, cancelApplication]);

  return {
    modalStep,
    loading,
    selectedResumeId,
    setSelectedResumeId,
    availableResumes: resumes,
    startApplication,
    cancelApplication,
    handleConfirmResume,
    handleIgnoreWarning,
  };
};