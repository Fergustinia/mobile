import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ResumeForm } from '../../../components/resume/resumeform';

export default function ResumeCreateScreen() {
  const { resumeId } = useLocalSearchParams<{ resumeId?: string }>();

  // Если передан resumeId — режим редактирования
  // Иначе — режим создания нового резюме
  const isEditMode = !!resumeId;

  return (
    <View style={styles.container}>
      <ResumeForm resumeId={resumeId} isEditMode={isEditMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});