import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'VACANCY_FILTER';

export const filterStorage = {
  async save(filter: any) {
    await AsyncStorage.setItem(KEY, JSON.stringify(filter));
  },

  async get() {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
  },

  async clear() {
    await AsyncStorage.removeItem(KEY);
  },
};