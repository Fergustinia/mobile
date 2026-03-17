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
const REMEMBERED_EMAIL_KEY = 'REMEMBERED_EMAIL';
const REMEMBERED_PASSWORD_KEY = 'REMEMBERED_PASSWORD';

export default function LoginScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY);
        const savedPassword = await AsyncStorage.getItem(REMEMBERED_PASSWORD_KEY);

        if (savedEmail && savedPassword) {
          setEmailOrPhone(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (e) {
        console.error('Ошибка загрузки данных:', e);
      }
    };

    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    setError('');

    if (!emailOrPhone.trim() || !password) {
      setError('Заполните все поля');
      return;
    }

    try {
      const rawUsers = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = rawUsers ? JSON.parse(rawUsers) : [];

      const normalizedEmail = emailOrPhone.trim().toLowerCase();

      const foundUser = users.find(
        (user) =>
          user.email.toLowerCase() === normalizedEmail &&
          user.password === password
      );

      if (!foundUser) {
        setError('Неверный email или пароль');
        return;
      }

      await AsyncStorage.setItem(CURRENT_USER_ID_KEY, foundUser.id);

      if (rememberMe) {
        await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, normalizedEmail);
        await AsyncStorage.setItem(REMEMBERED_PASSWORD_KEY, password);
      } else {
        await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
        await AsyncStorage.removeItem(REMEMBERED_PASSWORD_KEY);
      }

      router.replace('/(tabs)');
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

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Введите email"
              value={emailOrPhone}
              onChangeText={(text) => {
                setEmailOrPhone(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Пароль</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                placeholder="Введите пароль"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
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

          <Pressable
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Запомнить данные для входа</Text>
          </Pressable>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>

          <View style={styles.links}>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.link}>Регистрация</Text>
            </Pressable>

            <Pressable onPress={() => {}}>
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
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inner: {
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 52,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  passwordWrapper: {
    position: 'relative',
  },
  eye: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  eyeText: {
    fontSize: 20,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    color: '#007AFF',
    fontSize: 15,
  },
});