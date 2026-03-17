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

export default function RegisterScreen() {
  // --- Состояния формы ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- Состояния интерфейса ---
  const [loading, setLoading] = useState(false); // Для индикатора загрузки на кнопке
  const [error, setError] = useState('');       // Для хранения текста ошибки

  // --- Состояния видимости паролей (глазки) ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Функция валидации
  const validate = () => {
    if (!name.trim()) return 'Введите имя';
    if (!email.trim()) return 'Введите email';
    // Простая проверка формата email через регулярное выражение
    if (!/\S+@\S+\.\S+/.test(email)) return 'Некорректный email';
    if (password.length < 6) return 'Пароль должен быть минимум 6 символов';
    if (password !== confirmPassword) return 'Пароли не совпадают';
    return ''; // Ошибок нет
  };

  // Основная функция регистрации
  const handleRegister = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError); // Показываем ошибку валидации
      return;
    }

    setLoading(true); // Включаем "крутилку" на кнопке
    setError('');     // Сбрасываем старые ошибки

    try {
      // Имитируем сетевую задержку (1.5 секунды)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Сохраняем данные пользователя в AsyncStorage (локальная база данных)
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPassword', password);

      // После успешной регистрации отправляем пользователя на экран входа
      router.replace('/(auth)/login');
    } catch (err) {
      // Сработает, если, например, память телефона переполнена
      setError('Ошибка регистрации. Попробуйте позже.');
    } finally {
      setLoading(false); // Выключаем "крутилку" в любом случае
    }
  };

  // Функции-помощники для обновления текста (сразу убирают ошибку при начале ввода)
  const handleChangeName = (text: string) => { setName(text); if (error) setError(''); };
  const handleChangeEmail = (text: string) => { setEmail(text); if (error) setError(''); };
  const handleChangePass = (text: string) => { setPassword(text); if (error) setError(''); };
  const handleChangeConfirm = (text: string) => { setConfirmPassword(text); if (error) setError(''); };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inner}>
          <Text style={styles.title}>Регистрация</Text>

          {/* Блок для вывода ошибок (показывается только если error не пустой) */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Поле Имя */}
          <View style={styles.field}>
            <Text style={styles.label}>Имя</Text>
            <TextInput
              style={[styles.input, error && !name ? styles.inputError : null]}
              placeholder="Введите имя"
              value={name}
              onChangeText={handleChangeName}
            />
          </View>

          {/* Поле Email */}
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

          {/* Поле Пароль с кнопкой показа/скрытия */}
          <View style={styles.field}>
            <Text style={styles.label}>Пароль</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, error && password.length < 6 ? styles.inputError : null]}
                placeholder="Минимум 6 символов"
                value={password}
                onChangeText={handleChangePass}
                secureTextEntry={!showPassword} // Скрывает текст звездочками
              />
              <TouchableOpacity
                style={styles.eye}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Поле Подтверждение пароля */}
          <View style={styles.field}>
            <Text style={styles.label}>Подтвердите пароль</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.input, error && password !== confirmPassword ? styles.inputError : null]}
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChangeText={handleChangeConfirm}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eye}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeText}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Кнопка создания аккаунта */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading} // Блокируем кнопку на время загрузки
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Создать аккаунт</Text>
            )}
          </TouchableOpacity>

          {/* Кнопка возврата на экран логина */}
          <TouchableOpacity onPress={() => router.back()}>
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
    marginBottom: 40,
    color: '#000'
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
    marginBottom: 20
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
    borderColor: '#D32F2F' // Красная рамка при ошибке
  },
  passwordWrapper: {
    position: 'relative',
    justifyContent: 'center'
  },
  eye: {
    position: 'absolute',
    right: 16
  },
  eyeText: {
    fontSize: 20
  },
  button: {
    backgroundColor: '#007AFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  buttonDisabled: {
    backgroundColor: '#ccc' // Серая кнопка, когда идет загрузка
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16
  },
});
