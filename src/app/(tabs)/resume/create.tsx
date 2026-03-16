import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ResumeCreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Создание резюме</Text>
      <Text style={styles.text}>Заглушка формы создания/редактирования резюме</Text>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Сохранить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});