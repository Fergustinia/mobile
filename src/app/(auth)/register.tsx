import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingView from '../../components/ui/state/Loading';
import ErrorView from '../../components/ui/state/Error';

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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFatalError, setIsFatalError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    if (!name.trim()) return 'Введите имя';
    if (!email.trim()) return 'Введите email';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Некорректный email';
    if (password.length < 6) return 'Пароль должен быть минимум 6 символов';
    if (password !== confirmPassword) return 'Пароли не совпадают';
    return '';
  };

  const getUsers = async (): Promise<User[]> => {
    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const users = await getUsers();
      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = users.find(
        (user) => user.email.toLowerCase() === normalizedEmail
      );

      if (existingUser) {
        setError('Пользователь с таким email уже существует');
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        password,
        resumes: [],
        favoriteVacancies: [],
        responses: [],
      };

      const updatedUsers = [...users, newUser];

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

      router.replace('/(auth)/login');
    } catch (e) {
      console.error(e);
      setIsFatalError(true);
      setLoading(false);
          }
  };

  if (isFatalError) {
    return <ErrorView onRetry={handleRegister} />;
  }

  if (loading) {
    return <LoadingView />;
  }

  const handleChangeName = (text: string) => {
    setName(text);
    if (error) setError('');
  };

  const handleChangeEmail = (text: string) => {
    setEmail(text);
    if (error) setError('');
  };

  const handleChangePass = (text: string) => {
    setPassword(text);
    if (error) setError('');
  };

  const handleChangeConfirm = (text: string) => {
    setConfirmPassword(text);
    if (error) setError('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <Text style={styles.title}>Регистрация</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.field}>
            <Text style={styles.label}>Имя</Text>
            <TextInput
              style={[styles.input, error && !name ? styles.inputError : null]}
              placeholder="Введите имя"
              value={name}
              onChangeText={handleChangeName}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, error && !email ? styles.inputError : null]}
              placeholder="Введите email"
              value={email}
              onChangeText={handleChangeEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Пароль</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[
                  styles.input,
                  error && password.length < 6 ? styles.inputError : null,
                ]}
                placeholder="Минимум 6 символов"
                value={password}
                onChangeText={handleChangePass}
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

          <View style={styles.field}>
            <Text style={styles.label}>Подтвердите пароль</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[
                  styles.input,
                  error && password !== confirmPassword ? styles.inputError : null,
                ]}
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChangeText={handleChangeConfirm}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eye}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeText}>
                  {showConfirmPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Создать аккаунт</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.link}>Уже есть аккаунт? Войти</Text>
          </TouchableOpacity>
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
    marginBottom: 40,
    color: '#000',
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
    marginBottom: 20,
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
    justifyContent: 'center',
  },
  eye: {
    position: 'absolute',
    right: 16,
  },
  eyeText: {
    fontSize: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
});