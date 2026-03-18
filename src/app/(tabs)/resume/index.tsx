import { router } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';
import { ResumeListScreen } from '../../../components/resume/resumecard';
import { Resume, resumes } from '../../../data/mocks/resumes';

export default function ResumeScreen() {
  const handleResumePress = (resume: Resume) => {
    // Переход к редактированию существующего резюме
    router.push({
      pathname: '/resume/create',
      params: { resumeId: resume.id },
    });
  };

  const handleMenuPress = (resume: Resume) => {
    Alert.alert(
      resume.name,
      'Выберите действие',
      [
        {
          text: 'Редактировать',
          onPress: () => handleResumePress(resume),
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Удаление', `Резюме "${resume.name}" будет удалено`);
          },
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});