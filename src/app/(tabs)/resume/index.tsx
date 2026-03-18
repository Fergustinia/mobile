import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ResumeListScreen } from '../../../components/resume/resumecard';
import { Resume } from '../../../data/mocks/resumes';
import { resumeStorage } from '../../storage/resume';

export default function ResumeScreen() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  const loadResumes = useCallback(async () => {
    try {
      const data = await resumeStorage.getAll();
      setResumes(data);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить резюме');
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

  return (
    <View style={styles.container}>
      <ResumeListScreen
        resumes={resumes}
        on_resumePress={handleResumePress}
        on_menuPress={handleMenuPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
});