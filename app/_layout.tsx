import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

function AppShell() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AppShell />
    </ThemeProvider>
  );
}
