import GradientBackground from '@/components/ui/gradient-background';
import GradientButton from '@/components/ui/gradient-button';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
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
            </View>
            
            <Text style={styles.profileName}>
              {userProfile?.fullName || 'No name set'}
            </Text>
            
            <Text style={styles.profileEmail}>
              {userProfile?.email || 'No email set'}
            </Text>
            
            {/* Location - Show even if some fields are missing */}
            <Text style={styles.profileLocation}>
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
                : 'Location not set'
              }
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

            {/* Debug Info - Remove this in production */}
            
          </View>

          {/* Profile Actions */}
          <View style={styles.profileActions}>
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
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 32,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
    opacity: 0.9,
  },
  profileLocation: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 12,
  },
  userTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  userTypeText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileProvider: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
  },
  profileActions: {
    paddingHorizontal: 32,
    paddingBottom: 100, // Extra padding for tab bar
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
  debugContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  debugText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 2,
  },
});
