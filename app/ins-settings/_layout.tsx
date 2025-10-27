import { Stack } from 'expo-router';

export default function InsSettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="favourites" />
      <Stack.Screen name="my-post" />
      <Stack.Screen name="my-orders" />
      <Stack.Screen name="my-subscriptions" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="contact-us" />
      <Stack.Screen name="terms-conditions" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
