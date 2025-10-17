import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="classDetails" />
      <Stack.Screen name="class-booking" />
      {/* Add more screens here as needed */}
    </Stack>
  );
}
