import AppHeader from '@/components/ui/app-header';
import CategoriesSection from '@/components/ui/categories-section';
import FeaturedClassesSection from '@/components/ui/featured-classes-section';
import GradientButton from '@/components/ui/gradient-button';
import SearchBar from '@/components/ui/search-bar';
import StreetDanceSection from '@/components/ui/street-dance-section';
import TabBar from '@/components/ui/tab-bar';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
  fullName: string;
  email: string;
  profileImageUri: string;
  country: string;
  state: string;
  city: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
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
      console.error('Error signing out:', error);
      
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

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleAddPress = () => {
    console.log('Add pressed');
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleSearchBarPress = () => {
    console.log('Search bar pressed');
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleSeeAllCategories = () => {
    console.log('See all categories pressed');
  };

  const handleCategoryPress = (category: string) => {
    console.log('Category pressed:', category);
  };

  const handleSeeAllFeatured = () => {
    console.log('See all featured pressed');
  };

  const handleClassPress = (classId: string) => {
    console.log('Class pressed:', classId);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    console.log('Tab pressed:', tab);
  };

  const renderProfileScreen = () => (
    <SafeAreaView style={styles.profileContainer}>
      <ScrollView style={styles.profileScrollView} showsVerticalScrollIndicator={false}>
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
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      {activeTab === 'profile' ? (
        renderProfileScreen()
      ) : (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <AppHeader
            onMenuPress={handleMenuPress}
            onAddPress={handleAddPress}
            onSearchPress={handleSearchPress}
            onNotificationPress={handleNotificationPress}
          />
          
          <SearchBar
            onPress={handleSearchBarPress}
            onFilterPress={handleFilterPress}
          />
          
          <CategoriesSection
            onSeeAllPress={handleSeeAllCategories}
            onCategoryPress={handleCategoryPress}
          />
          
          <FeaturedClassesSection
            onSeeAllPress={handleSeeAllFeatured}
            onClassPress={handleClassPress}
          />
          
          <StreetDanceSection
            onClassPress={handleClassPress}
          />
        </ScrollView>
      )}
      
      <TabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B5CF6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileScrollView: {
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
    backgroundColor: '#F3F4F6',
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
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    marginBottom: 4,
    textAlign: 'center',
  },
  profileLocation: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#999999',
    textAlign: 'center',
  },
  profileActions: {
    paddingHorizontal: 32,
    paddingBottom: 100, // Extra padding for tab bar
  },
});
