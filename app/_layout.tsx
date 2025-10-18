import { DrawerProvider } from '@/contexts/DrawerContext';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <DrawerProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack  screenOptions={{headerShown: false}}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(splash)" />
          <Stack.Screen name="(auth)"/>
          <Stack.Screen name="(home)" />
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="settings" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </DrawerProvider>
  );
}
