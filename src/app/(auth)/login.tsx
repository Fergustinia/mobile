import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  // --- Состояния формы ---
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // Состояние чекбокса
  const [showPassword, setShowPassword] = useState(false); // Видимость пароля
  const [error, setError] = useState(''); // Текст ошибки

  // --- Эффект при загрузке экрана ---
  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        // Проверяем, сохранял ли пользователь данные ранее (галочка "Запомнить")
        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
        const savedPassword = await AsyncStorage.getItem('rememberedPassword');

        if (savedEmail && savedPassword) {
          // Если данные есть, подставляем их в поля автоматически
          setEmailOrPhone(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true); // Включаем галочку обратно
        }
      } catch (e) {
        console.error("Ошибка загрузки данных:", e);
      }
    };
    loadSavedCredentials();
  }, []); // Пустой массив [] значит, что код сработает 1 раз при открытии

  // --- Функция входа ---
  const handleLogin = async () => {
    setError(''); // Сброс старой ошибки

    if (!emailOrPhone || !password) {
      setError('Заполните все поля');
      return;
    }

    try {
      // Извлекаем данные, которые пользователь указал при регистрации
      const registeredEmail = await AsyncStorage.getItem('userEmail');
      const registeredPassword = await AsyncStorage.getItem('userPassword');

      // Проверяем совпадение введенных данных с регистрационными
      if (emailOrPhone === registeredEmail && password === registeredPassword) {

        // Логика чекбокса "Запомнить меня"
        if (rememberMe) {
          // Если галочка стоит — сохраняем логин/пароль для следующего раза
          await AsyncStorage.setItem('rememberedEmail', emailOrPhone);
          await AsyncStorage.setItem('rememberedPassword', password);
        } else {
          // Если галочка снята — удаляем сохраненные данные из памяти
          await AsyncStorage.removeItem('rememberedEmail');
          await AsyncStorage.removeItem('rememberedPassword');
        }

        // Мы НЕ сохраняем 'userToken' в этом сценарии.
        //  при перезагрузке приложения RootLayout снова
        // отправит пользователя сюда, но поля уже будут заполнены.
        router.replace('/(tabs)');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (e) {
      setError('Ошибка входа');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <Text style={styles.title}>Вход</Text>

          {/* Вывод сообщения об ошибке */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Поле Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email / Номер телефона</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Введите email или номер телефона"
              value={emailOrPhone}
              onChangeText={(text) => { setEmailOrPhone(text); setError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Поле Пароль с "глазком" */}
          <View style={styles.field}>
            <Text style={styles.label}>Пароль</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="Введите пароль"
                value={password}
                onChangeText={(text) => { setPassword(text); setError(''); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eye}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Кастомный чекбокс "Запомнить меня" */}
          <Pressable
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Запомнить данные для входа</Text>
          </Pressable>

          {/* Кнопка входа */}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>

          {/* Ссылки на регистрацию и сброс пароля */}
          <View style={styles.links}>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.link}>Регистрация</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/(auth)/forgotpassword')}>
              <Text style={styles.link}>Забыли пароль?</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  inner: {
    paddingHorizontal: 32,
    paddingVertical: 40
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFCDD2'
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500'
  },
  field: {
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500'
  },
  input: {
    height: 52,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  inputError: {
    borderColor: '#D32F2F'
  },
  passwordWrapper: {
    position: 'relative'
  },
  eye: {
    position: 'absolute',
    right: 16,
    top: 14
  },
  eyeText: {
    fontSize: 20
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxActive: {
    backgroundColor: '#007AFF'
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  rememberText: {
    fontSize: 16,
    color: '#333'
  },
  button: {
    backgroundColor: '#007AFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  link: {
    color: '#007AFF',
    fontSize: 15
  },
});