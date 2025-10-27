import CustomTabBar from '@/components/ui/custom-tab-bar';
import { Fonts } from '@/constants/theme';
import { auth } from '@/firebase.config';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

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

  const menuItems = [
    { label: 'Library', onPress: () => {} },
    { label: 'Switch as Instructor', onPress: () => {} },
    { label: 'Products', onPress: () => {} },
    { label: 'My Post', onPress: go('/settings/my-post') },
    { label: 'My Favourites', onPress: go('/settings/favourites') },
    { label: 'My Bookings', onPress: go('/settings/my-bookings') },
    { label: 'Subscriptions', onPress: go('/settings/my-subscriptions') },
    { label: 'Change Password', onPress: go('/settings/change-password') },
    { label: 'Contact Us', onPress: go('/settings/contact-us') },
    { label: 'Terms of services', onPress: go('/settings/terms-conditions') },
    { label: 'Privacy Policy', onPress: go('/settings/privacy-policy') },
  ];

  return (
    <DrawerContentScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Section */}
      <LinearGradient
        colors={['rgba(247, 8, 247, 0.2)', 'rgba(199, 8, 247, 0.2)', 'rgba(247, 106, 11, 0.2)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileSection}
      >
        <View style={styles.profileRow}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('@/assets/images/annie-bens.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <View style={styles.profileBorder} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Jhon Dea</Text>
            <Pressable style={styles.editProfileButton}>
              <LinearGradient
                colors={['#F708F7', '#C708F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.editButtonGradient}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <Text style={styles.menuText}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Image
            source={require('@/assets/images/logout2.png')}
            style={styles.logoutIcon}
            resizeMode="contain"
          />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

export default function HomeLayout() {
  return (
    <DrawerNav.Navigator 
      screenOptions={{ 
        headerShown: false,
        drawerStyle: {
          width: '75%',
        }
      }} 
      drawerContent={() => <DrawerContent />}
    >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    marginBottom: 40,
    paddingVertical: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    marginLeft:-12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft:8,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileInfo: {
    flex: 1,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 35,
    borderColor: '#C708F7',
    borderWidth: 1,
    padding: 2,
  },
  profileBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  userName: {
    fontSize: 30,
    fontFamily: Fonts.bold,
    color: '#333333',
    marginBottom: 8,
  },
  editProfileButton: {
    // Empty style for the button container
  },
  editButtonGradient: {
    borderRadius: 100,
    width: 120,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  menuSection: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#333333',
  },
  logoutSection: {
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#333333',
  },
});

