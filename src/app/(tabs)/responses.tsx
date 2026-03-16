import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ResponsesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои отклики</Text>
      <Text style={styles.text}>Заглушка списка откликов</Text>

      <Pressable
        style={styles.card}
        onPress={() => router.push('/vacancyscreen/1')}
      >
        <Text style={styles.cardTitle}>React Native Developer</Text>
        <Text style={styles.cardText}>Нажми, чтобы открыть вакансию</Text>
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
    marginBottom: 16,
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
  cardText: {
    marginTop: 6,
    color: '#666',
  },
});