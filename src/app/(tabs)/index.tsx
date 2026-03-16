import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';

const vacancies = [
  { id: '1', title: 'React Native Developer' },
  { id: '2', title: 'Frontend Developer' },
  { id: '3', title: 'UI/UX Designer' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Главная</Text>

      <Pressable
        style={[styles.button, styles.filterButton]}
        onPress={() => router.push('/vacancyscreen/filter')}
      >
        <Text style={styles.buttonText}>Открыть фильтр</Text>
      </Pressable>

      {vacancies.map((vacancy) => (
        <Pressable
          key={vacancy.id}
          style={styles.card}
          onPress={() => router.push(`/vacancyscreen/${vacancy.id}`)}
        >
          <Text style={styles.cardTitle}>{vacancy.title}</Text>
          <Text style={styles.cardSubtitle}>Нажми, чтобы открыть детали</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterButton: {
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardSubtitle: {
    marginTop: 6,
    color: '#666',
  },
});