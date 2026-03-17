import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  // Состояние авторизации:
  // null — загрузка, true — вошел, false — не вошел
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);

  useEffect(() => {
    // Функция для проверки наличия токена в памяти устройства
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        // Если токен есть, !!token превратит его в true, если нет — в false
        setIsAuthenticated(!!token);
      } catch (e) {
        // Если произошла ошибка чтения из памяти, считаем пользователя неавторизованным
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Пока идет проверка (isAuthenticated еще null), показываем индикатор загрузки
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    // Stack управляет переходами между группами экранов
    <Stack screenOptions={{ headerShown: false }}>
      {/* Динамически определяем главный экран:
          1. Если залогинен (isAuthenticated: true) -> первой загрузится группа (tabs)
          2. Если нет (isAuthenticated: false) -> первой загрузится группа (auth)
      */}
      <Stack.Screen name={isAuthenticated ? "(tabs)" : "(auth)"} />

      {/* Вторая группа объявляется следом, чтобы роутер знал о её существовании.*/}
      <Stack.Screen name={isAuthenticated ? "(auth)" : "(tabs)"} />
    </Stack>
  );
}
