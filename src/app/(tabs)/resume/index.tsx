import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ResumeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои резюме</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Frontend Developer</Text>
        <Text style={styles.cardText}>Дата обновления: сегодня</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>React Native Developer</Text>
        <Text style={styles.cardText}>Дата обновления: вчера</Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.push('/resume/create')}>
        <Text style={styles.buttonText}>Создать новое резюме</Text>
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
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardText: {
    marginTop: 6,
    color: '#666',
  },
  button: {
    marginTop: 12,
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