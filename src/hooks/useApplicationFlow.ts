// mobile/ui/hooks/useApplicationFlow.ts
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

// Домен и данные
import { checkSkillsMatch } from '../domain/usecases/checkSkillsMatch';
import { resumes } from '../data/mocks/resumes';
import { mockServer } from '../data/mocks/mockServer';

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

  const handleConfirmResume = useCallback(async () => {
    if (!selectedResumeId) {
      Alert.alert('Ошибка', 'Выберите резюме');
      return;
    }

    setLoading(true);
    
    try {
      // Запрос резюме через "сервер" (моки)
      const serverResumes = await mockServer.fetchResumes();
      const resume = serverResumes.find(r => r.id === selectedResumeId);
      
      if (!resume) {
        Alert.alert('Ошибка', 'Резюме не найдено');
        return;
      }

      // Проверка навыков (домен)
      const { isMatch } = checkSkillsMatch(resume);
      
      setLoading(false);

      if (!isMatch) {
        setModalStep('warning');
      } else {
        await submitApplication();
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
      setModalStep('error');
    }
  }, [selectedResumeId]);

  const handleIgnoreWarning = useCallback(async () => {
    await submitApplication();
  }, []);

  const submitApplication = useCallback(async () => {
    setLoading(true);
    
    try {
      // Отправка через "сервер" (моки)
      await mockServer.submitApplication(vacancyId, selectedResumeId);
      
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