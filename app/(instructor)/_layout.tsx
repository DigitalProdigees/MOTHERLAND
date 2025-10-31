import CustomTabBar from '@/components/ui/custom-tab-bar';
import ProfileAvatar from '@/components/ui/profile-avatar';
import { Fonts } from '@/constants/theme';
import { InstructorDrawerProvider } from '@/contexts/InstructorDrawerContext';
import { auth, database } from '@/firebase.config';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, useRouter } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DrawerNav = createDrawerNavigator();

function DrawerContent() {
  const router = useRouter();
  const [instructorProfile, setInstructorProfile] = useState<any>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // Fetch instructor profile data
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setInstructorProfile(data);
          setProfileImageUrl(data.profileImageUrl || data.profileImageUri || null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const go = (path: string) => () => router.push(path as any);
  
  const logout = async () => {
    try {
      await auth.signOut();
      router.replace('/(auth)/signin');
    } catch {}
  };

  const menuItems = [
    { label: 'My Classes', onPress: go('/(instructor)/home') },
    { label: 'Add New Class', onPress: go('/(instructor)/home/add-class') },
    { label: 'Class Analytics', onPress: () => {} },
    { label: 'My Students', onPress: () => {} },
    { label: 'My Orders', onPress: go('/ins-settings/my-orders') },
    { label: 'Switch as Student', onPress: go('/(home)/home') },
    { label: 'My Earnings', onPress: () => {} },
    { label: 'Payment Settings', onPress: () => {} },
    { label: 'My Favourites', onPress: go('/ins-settings/favourites') },
    { label: 'Subscriptions', onPress: go('/ins-settings/my-subscriptions') },
    { label: 'Change Password', onPress: go('/ins-settings/change-password') },
    { label: 'Contact Us', onPress: go('/ins-settings/contact-us') },
    { label: 'Terms of services', onPress: go('/ins-settings/terms-conditions') },
    { label: 'Privacy Policy', onPress: go('/ins-settings/privacy-policy') },
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
            <ProfileAvatar
              imageUrl={profileImageUrl}
              fullName={instructorProfile?.fullName || 'Instructor'}
              size={75}
              style={styles.profileImage}
            />
            <View style={styles.profileBorder} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{instructorProfile?.fullName || 'Instructor'}</Text>
            <Text style={styles.instructorBadge}>Dance Instructor</Text>
            <TouchableOpacity 
                onPress={() => {
                  if (!instructorProfile) return;
                  router.push({
                    pathname: '/(onboarding)/profile-info',
                    params: {
                      country: instructorProfile.country || '',
                      state: instructorProfile.state || '',
                      city: instructorProfile.city || '',
                      profileImageUrl: instructorProfile.profilePicture || instructorProfile.profileImageUri || '',
                    }
                  });
                }}
              >
              <LinearGradient
                colors={['#F708F7', '#C708F7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.editButtonGradient}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
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

export default function InstructorLayout() {
  return (
    <InstructorDrawerProvider>
      <DrawerNav.Navigator 
        screenOptions={{ 
          headerShown: false,
          drawerStyle: {
            width: '75%',
          }
        }} 
        drawerContent={() => <DrawerContent />}
      >
        <DrawerNav.Screen name="Tabs">
          {() => (
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
        </DrawerNav.Screen>
      </DrawerNav.Navigator>
    </InstructorDrawerProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    marginBottom: 40,
    marginRight: 40,
    paddingVertical: 20,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    marginLeft: -12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 8,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileInfo: {
    flex: 1,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 35,
    borderColor: '#C708F7',
    borderWidth: 1,
    padding: 2,
  },
  profileBorder: {
    position: 'absolute',
    
    borderRadius: 38,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  userName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#333333',
    marginBottom: 4,
  },
  instructorBadge: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#C708F7',
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
