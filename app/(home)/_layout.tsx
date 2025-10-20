import CustomTabBar from '@/components/ui/custom-tab-bar';
import { auth } from '@/firebase.config';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const DrawerNav = createDrawerNavigator();

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
      <DrawerItem label="Library" onPress={() => {}} />
      <DrawerItem label="Switch as Instructor" onPress={() => {}} />
      <DrawerItem label="Products" onPress={() => {}} />
      <DrawerItem label="My Post" onPress={go('/settings/my-post')} />
      <DrawerItem label="My Favourites" onPress={go('/settings/favourites')} />
      <DrawerItem label="My Bookings" onPress={go('/settings/my-bookings')} />
      <DrawerItem label="Subscriptions" onPress={go('/settings/my-subscriptions')} />
      <DrawerItem label="Change Password" onPress={go('/settings/change-password')} />
      <DrawerItem label="Contact Us" onPress={go('/settings/contact-us')} />
      <DrawerItem label="Terms of services" onPress={go('/settings/terms-conditions')} />
      <DrawerItem label="Privacy Policy" onPress={go('/settings/privacy-policy')} />
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

export default function HomeLayout() {
  return (
    <DrawerNav.Navigator screenOptions={{ headerShown: false }} drawerContent={() => <DrawerContent />}>
      <DrawerNav.Screen
        name="Tabs"
        children={() => (
          <Tabs
            screenOptions={{
              headerShown: false,
            }}
            tabBar={(props) => <CustomTabBar {...props} />}
          >
            <Tabs.Screen
              name="home"
              options={{
                title: 'Home',
              }}
            />
            <Tabs.Screen
              name="classes"
              options={{
                title: 'Classes',
              }}
            />
            <Tabs.Screen
              name="community"
              options={{
                title: 'Community',
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
              }}
            />
          </Tabs>
        )}
      />
    </DrawerNav.Navigator>
  );
}

