import { Resume } from '@/data/mocks/resumesdata';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type VacancyResponse = {
  vacancyId: string;
  respondedAt: string;
  status: string;
};

export type User = {
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

// ================= USERS =================

export const getUsers = async (): Promise<User[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveUsers = async (users: User[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// ================= CURRENT USER =================

export const getCurrentUserId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(CURRENT_USER_ID_KEY);
};

export const setCurrentUserId = async (userId: string) => {
  await AsyncStorage.setItem(CURRENT_USER_ID_KEY, userId);
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_ID_KEY);
};

// ================= GET CURRENT USER =================

export const getCurrentUser = async (): Promise<User | null> => {
  const users = await getUsers();
  const currentUserId = await getCurrentUserId();
  if (!currentUserId) return null;

  const user = users.find((u) => u.id === currentUserId);
  if (!user) return null;

  // 🔥 ГАРАНТИЯ структуры (очень важно)
  return {
    ...user,
    resumes: user.resumes || [],
    responses: user.responses || [],
    favoriteVacancies: user.favoriteVacancies || [],
  };
};

// ================= UPDATE USER =================

export const updateUser = async (updatedUser: User) => {
  const users = await getUsers();

  const updatedUsers = users.map((user) =>
    user.id === updatedUser.id
      ? {
          ...updatedUser,
          resumes: updatedUser.resumes || [],
          responses: updatedUser.responses || [],
          favoriteVacancies: updatedUser.favoriteVacancies || [],
        }
      : user
  );

  await saveUsers(updatedUsers);
};