import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Профиль</Text>

      <Text style={styles.text}>{user?.name || 'Имя пользователя'}</Text>
      <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>

    

     

      

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
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
    marginTop: 6,
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