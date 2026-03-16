import { Stack } from 'expo-router';

export default function ResumeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="create"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}