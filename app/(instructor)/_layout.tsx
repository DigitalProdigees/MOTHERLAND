import { InstructorDrawerProvider } from '@/contexts/InstructorDrawerContext';
import { Stack } from 'expo-router';

export default function InstructorLayout() {
  return (
    <InstructorDrawerProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="add-class" />
      </Stack>
    </InstructorDrawerProvider>
  );
}
