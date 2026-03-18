import { Stack } from 'expo-router';

export default function ResumeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ 
          title: 'Мое резюме',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="create"
        options={{ 
          title: 'Создание резюме',
          headerShown: true,
        }}
      />
    </Stack>
  );
}