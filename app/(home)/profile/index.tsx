import GradientBackground from '@/components/ui/gradient-background';
import GradientButton from '@/components/ui/gradient-button';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
  fullName: string;
  email: string;
  profilePicture: string;
  profileImageUri?: string; // Keep for backward compatibility
  country: string;
  state: string;
  city: string;
  userType: string;
  provider: string;
  lastSignIn: string;
  profileCompleted: boolean;
  profileCompletedAt: string;
  uid: string;
}

const { width } = Dimensions.get('window');

export default function ProfileIndexScreen() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log('🔍 Profile data loaded:', data);
          console.log('🔍 Full Name:', data.fullName);
          console.log('🔍 Email:', data.email);
          console.log('🔍 City:', data.city);
          console.log('🔍 State:', data.state);
          console.log('🔍 Country:', data.country);
          console.log('🔍 User Type:', data.userType);
          setUserProfile(data);
        } else {
          console.log('🔍 No profile data found in database');
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Sign out from Firebase Auth
      await signOut(auth);
      
      console.log('User signed out successfully');
      
      // Navigate to sign in screen
      router.replace('/(auth)/signin');
      
    } catch (error: any) {
      console.log('Error signing out:', error);
      
      let errorMessage = 'Failed to sign out. Please try again.';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Sign Out Failed', errorMessage);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {(userProfile?.profilePicture || userProfile?.profileImageUri) ? (
                <Image 
                  source={{ uri: userProfile.profilePicture || userProfile.profileImageUri }} 
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageText}>👤</Text>
                </View>
              )}
              <TouchableOpacity style={styles.editImageButton}>
                <Image 
                  source={require('@/assets/images/editable.png')} 
                  style={styles.editImageIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.profileName}>
              {userProfile?.fullName || 'No name set'}
            </Text>
            {/* User Type Badge */}
            {userProfile?.userType && (
              <View style={styles.userTypeBadge}>
                <Text style={styles.userTypeText}>
                  {userProfile.userType.charAt(0).toUpperCase() + userProfile.userType.slice(1)}
                </Text>
              </View>
            )}

            {/* Provider Info */}
            {userProfile?.provider && (
              <Text style={styles.profileProvider}>
                Signed in with {userProfile.provider === 'google.com' ? 'Google' : userProfile.provider}
              </Text>
            )}
          </View>

          {/* Profile Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Classes</Text>
              <Text style={styles.statLabel}>Taken</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>

          {/* Profile Sections */}
          <View style={styles.sectionsContainer}>
            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.sectionContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{userProfile?.fullName || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{userProfile?.email || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>User Type</Text>
                  <Text style={styles.infoValue}>
                    {userProfile?.userType ? userProfile.userType.charAt(0).toUpperCase() + userProfile.userType.slice(1) : 'Not set'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>
                    {userProfile?.city && userProfile?.state && userProfile?.country
                      ? `${userProfile.city}, ${userProfile.state}, ${userProfile.country}`
                      : userProfile?.city && userProfile?.state
                      ? `${userProfile.city}, ${userProfile.state}`
                      : userProfile?.city
                      ? userProfile.city
                      : userProfile?.state
                      ? userProfile.state
                      : userProfile?.country
                      ? userProfile.country
                      : 'Not set'
                    }
                  </Text>
                </View>
              </View>
            </View>

            {/* Account Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <View style={styles.sectionContent}>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Edit Profile</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Change Password</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Privacy Settings</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Notifications</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              <View style={styles.sectionContent}>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>My Bookings</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Favorites</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>My Posts</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Sign Out Button */}
          <View style={styles.signOutContainer}>
            <GradientButton
              title={isSigningOut ? "Signing Out..." : "Sign Out"}
              onPress={handleSignOut}
              disabled={isSigningOut}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: -40,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 32,
    color: '#FFFFFF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editImageIcon: {
    width: 16,
    height: 16,
  },
  profileName: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  profileLocation: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  userTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 100,
    marginBottom: 8,
  },
  userTypeText: {
    fontSize: 19,
    fontFamily: Fonts.semiBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileProvider: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight:'600',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  sectionsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    opacity: 0.8,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
    textAlign: 'right',
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
  },
  settingArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  signOutContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    opacity: 0.8,
  },
});
