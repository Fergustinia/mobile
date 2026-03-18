import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { resumeStorage } from '../../../app/storage/resume';
import { ResumeListScreen } from '../../../components/resume/resumecard';
import ErrorView from '../../../components/ui/state/Error';
import { Resume } from '../../../data/mocks/resumes';

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
      setScreenState('error');
    }
  }, []);

  React.useEffect(() => {
    loadResumes();
  }, []);

  const handleResumePress = (resume: Resume) => {
    router.push({
      pathname: '/(tabs)/resume/create',
      params: { resumeId: resume.id },
    });
  };

  const handleMenuPress = (resume: Resume) => {
    Alert.alert(
      resume.name,
      'Выберите действие',
      [
        { text: 'Редактировать', onPress: () => handleResumePress(resume) },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: async () => {
            Alert.alert(
              'Подтверждение',
              `Удалить резюме "${resume.name}"?`,
              [
                { text: 'Отмена', style: 'cancel' },
                {
                  text: 'Удалить',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await resumeStorage.delete(resume.id);
                      loadResumes();
                    } catch {
                      Alert.alert('Ошибка', 'Не удалось удалить резюме');
                    }
                  },
                },
              ]
            );
          }
        },
        { text: 'Отмена', style: 'cancel' },
      ]
    );
  };

  const handleRetry = () => {
    loadResumes();
  };

  // ❌ Error State
  if (screenState === 'error') {
    return <ErrorView onRetry={handleRetry} />;
  }

  // ✅ Loading & Success State
  return (
    <View style={styles.container}>
      <ResumeListScreen
        resumes={resumes}
        isLoading={screenState === 'loading'}
        on_resumePress={handleResumePress}
        on_menuPress={handleMenuPress}
        onRefresh={loadResumes}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});