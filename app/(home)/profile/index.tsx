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
  profileImageUri: string;
  country: string;
  state: string;
  city: string;
}

export default function ProfileIndexScreen() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUserProfile(data);
        }
      });

      return () => unsubscribe();
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

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {userProfile?.profileImageUri ? (
                <Image 
                  source={{ uri: userProfile.profileImageUri }} 
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
              {userProfile?.fullName || 'User Name'}
            </Text>
            
            <Text style={styles.profileEmail}>
              {userProfile?.email || 'user@example.com'}
            </Text>
            
            {(userProfile?.city || userProfile?.state || userProfile?.country) && (
              <Text style={styles.profileLocation}>
                {[userProfile?.city, userProfile?.state, userProfile?.country]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            )}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  },
  profileActions: {
    paddingHorizontal: 32,
    paddingBottom: 100, // Extra padding for tab bar
  },
});
