import { Stack } from 'expo-router';

export default function ClassesStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      {/* Add more screens here as needed */}
    </Stack>
  );
}
