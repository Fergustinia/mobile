import { Stack } from 'expo-router';

export default function VacancyScreenLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="filter"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}