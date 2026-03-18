import AsyncStorage from '@react-native-async-storage/async-storage';
// ✅ 1. Импортируем правильный тип Resume из главного файла
import { Resume } from '../../data/mocks/resumes';

// ❌ 2. УДАЛИТЕ строку: export type Resume = { ... }; (если она там есть)

export type VacancyResponse = {
  vacancyId: string;
  respondedAt: string;
  vacancyTitle: string;
  company: string;
  status: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  resumes: Resume[]; // ✅ Теперь использует импортированный тип
  favoriteVacancies: string[];
  responses: VacancyResponse[];
};

const USERS_KEY = 'USERS';
const CURRENT_USER_ID_KEY = 'CURRENT_USER_ID';

export const getUsers = async (): Promise<User[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveUsers = async (users: User[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUserId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(CURRENT_USER_ID_KEY);
};

export const setCurrentUserId = async (userId: string) => {
  await AsyncStorage.setItem(CURRENT_USER_ID_KEY, userId);
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_ID_KEY);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const users = await getUsers();
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) return null;

  return users.find((user) => user.id === currentUserId) || null;
};

export const updateUser = async (updatedUser: User) => {
  const users = await getUsers();
  const updatedUsers = users.map((user) =>
    user.id === updatedUser.id ? updatedUser : user
  );
  await saveUsers(updatedUsers);
};