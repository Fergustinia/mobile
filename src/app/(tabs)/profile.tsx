import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type Resume = {
  id: string;
  title: string;
  about: string;
  skills: string[];
};

type VacancyResponse = {
  vacancyId: string;
  vacancyTitle: string;
  respondedAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  resumes: Resume[];
  favoriteVacancies: string[];
  responses: VacancyResponse[];
};

const USERS_KEY = 'USERS';
const CURRENT_USER_ID_KEY = 'CURRENT_USER_ID';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);

  const loadProfile = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem(CURRENT_USER_ID_KEY);
      const rawUsers = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = rawUsers ? JSON.parse(rawUsers) : [];

      if (!currentUserId) {
        setUser(null);
        return;
      }

      const currentUser = users.find((item) => item.id === currentUserId) || null;
      setUser(currentUser);
    } catch (e) {
      console.error('Ошибка загрузки профиля:', e);
      setUser(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem(CURRENT_USER_ID_KEY);
    router.replace('/(auth)/login');
  };

  const handleGoToResumes = () => {
    router.push('/resume');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Профиль</Text>

      <Text style={styles.text}>{user?.name || 'Имя пользователя'}</Text>
      <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>

      {/* Количество резюме */}
      {user && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.resumes.length}</Text>
            <Text style={styles.statLabel}>резюме</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.responses.length}</Text>
            <Text style={styles.statLabel}>отклика</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.favoriteVacancies.length}</Text>
            <Text style={styles.statLabel}>избранное</Text>
          </View>
        </View>
      )}

      {/* Кнопка перехода к резюме */}
      <Pressable style={styles.button} onPress={handleGoToResumes}>
        <Text style={styles.buttonText}>Мои резюме</Text>
      </Pressable>

      {/* Кнопка избранного (можно добавить позже) */}
      <Pressable style={styles.secondaryButton} onPress={() => router.push('/#')}>
        <Text style={styles.secondaryButtonText}>Избранные вакансии</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Выйти</Text>
      </Pressable>
    </ScrollView>
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
    marginTop: 8,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    color: '#666',
    marginBottom: 24,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#111',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  logoutText: {
    color: '#111',
    fontWeight: '600',
    fontSize: 16,
  },
});