import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  console.log('🟣 HOME STACK LAYOUT: Rendering');
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="class-details" />
      <Stack.Screen name="class-booking" />
      {/* Add more screens here as needed */}
    </Stack>
  );
}
