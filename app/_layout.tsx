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
          <Stack.Screen name="favourites" />
          <Stack.Screen name="my-subscriptions" />
          <Stack.Screen name="my-bookings" />
          <Stack.Screen name="contact-us" />
          <Stack.Screen name="change-password" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="reset-password" />
        </Stack>
        <StatusBar style="dark" />
      </ThemeProvider>
    </DrawerProvider>
  );
}
