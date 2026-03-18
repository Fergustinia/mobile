import { StyleSheet, View } from 'react-native';
import { ResumeForm } from '../../../components/resume/resumeform';

export default function ResumeCreateScreen() {
  return (
    <View style={styles.container}>
      <ResumeForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
});