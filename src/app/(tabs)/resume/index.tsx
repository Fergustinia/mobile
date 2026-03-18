// src/app/(tabs)/resume/index.tsx
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ResumeListScreen } from '../../../components/resume/resumecard';
import ErrorView from '../../../components/ui/state/Error';
import { Resume } from '../../../data/mocks/resumesdata';
import { resumeStorage } from '../../storage/resume';

type ScreenState = 'loading' | 'error' | 'success';

export default function ResumeScreen() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [screenState, setScreenState] = useState<ScreenState>('loading');

  const loadResumes = useCallback(async () => {
    setScreenState('loading');
    try {
      const data = await resumeStorage.getAll();
      setResumes(data);
      setScreenState('success');
    } catch (error) {
      console.error(error);
      setScreenState('error');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadResumes();
    }, [loadResumes])
  );

  const handleResumePress = (resume: Resume) => {
    router.push({
      pathname: '/(tabs)/resume/create',
      params: { resumeId: resume.id },
    });
  };

  const handleMenuPress = async (action: 'edit' | 'delete' | 'cancel', resume: Resume) => {
    if (action === 'cancel') return;
    
    if (action === 'edit') {
      router.push({
        pathname: '/(tabs)/resume/create',
        params: { resumeId: resume.id },
      });
      return;
    }
    
    if (action === 'delete') {
      Alert.alert(
        'Удаление резюме',
        `Вы уверены, что хотите удалить "${resume.name}"?`,
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Удалить',
            style: 'destructive',
            onPress: async () => {
              try {
                await resumeStorage.delete(resume.id);
                await loadResumes(); // Обновляем список после удаления
              } catch {
                Alert.alert('Ошибка', 'Не удалось удалить резюме');
              }
            },
          },
        ]
      );
    }
  };

  const handleRetry = () => {
    loadResumes();
  };

  if (screenState === 'error') {
    return <ErrorView onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      <ResumeListScreen
        resumes={resumes}
        isLoading={screenState === 'loading'}
        on_resumePress={handleResumePress}
        on_menuPress={handleMenuPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
});