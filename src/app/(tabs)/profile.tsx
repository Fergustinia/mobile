import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>
      <Text style={styles.text}>Имя пользователя</Text>
      <Text style={styles.email}>email@example.com</Text>

      <Pressable style={styles.button} onPress={() => router.push('/resume')}>
        <Text style={styles.buttonText}>Мое резюме</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={() => router.replace('/login')}>
        <Text style={styles.logoutText}>Выйти</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    color: '#666',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoutText: {
    color: '#111',
    fontWeight: '600',
  },
});