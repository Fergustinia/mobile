import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function VacancyFilterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Фильтр</Text>
      <Text style={styles.text}>Заглушка экрана фильтра вакансий</Text>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Применить / Назад</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
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