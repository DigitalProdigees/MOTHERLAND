import CustomTabBar from '@/components/ui/custom-tab-bar';
import { auth } from '@/firebase.config';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const DrawerNav = createDrawerNavigator();
const TabNav = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home" />
      <Stack.Screen name="add-class" />
    </Stack>
  );
}

function DrawerContent() {
  const router = useRouter();
  const go = (path: string) => () => router.push(path as any);
  const logout = async () => {
    try {
      await auth.signOut();
      router.replace('/(auth)/signin');
    } catch {}
  };
  return (
    <DrawerContentScrollView>
      <DrawerItem label="My Classes" onPress={go('/(instructor)/home')} />
      <DrawerItem label="Add New Class" onPress={go('/(instructor)/add-class')} />
      <DrawerItem label="Class Analytics" onPress={() => {}} />
      <DrawerItem label="My Students" onPress={() => {}} />
      <DrawerItem label="Switch as Student" onPress={go('/(home)/home')} />
      <DrawerItem label="My Earnings" onPress={() => {}} />
      <DrawerItem label="Payment Settings" onPress={() => {}} />
      <DrawerItem label="My Favourites" onPress={go('/ins-settings/favourites')} />
      <DrawerItem label="Subscriptions" onPress={go('/ins-settings/my-subscriptions')} />
      <DrawerItem label="Change Password" onPress={go('/ins-settings/change-password')} />
      <DrawerItem label="Contact Us" onPress={go('/ins-settings/contact-us')} />
      <DrawerItem label="Terms of services" onPress={go('/ins-settings/terms-conditions')} />
      <DrawerItem label="Privacy Policy" onPress={go('/ins-settings/privacy-policy')} />
      <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
        <Pressable
          onPress={logout}
          style={{
            backgroundColor: '#EF4444',
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Logout</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

export default function InstructorLayout() {
  return (
    <DrawerNav.Navigator screenOptions={{ headerShown: false }} drawerContent={() => <DrawerContent />}>
      <DrawerNav.Screen name="InstructorTabs">
        {() => (
          <TabNav.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <CustomTabBar {...props} />}>
            <TabNav.Screen name="home" component={HomeStack} />
            <TabNav.Screen name="classes" component={() => null} />
            <TabNav.Screen name="community" component={() => null} />
            <TabNav.Screen name="profile" component={() => null} />
          </TabNav.Navigator>
        )}
      </DrawerNav.Screen>
    </DrawerNav.Navigator>
  );
}
