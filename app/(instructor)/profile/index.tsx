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

interface InstructorProfile {
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
  bio?: string;
  specialties?: string[];
  experience?: string;
  certifications?: string[];
}

const { width } = Dimensions.get('window');

export default function InstructorProfileTabScreen() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [classesCreated, setClassesCreated] = useState(0);
  const [studentsTaught, setStudentsTaught] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Fetch instructor profile data
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log('🔍 Instructor profile data loaded:', data);
          setInstructorProfile(data);
        } else {
          console.log('🔍 No instructor profile data found in database');
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch instructor statistics
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Fetch classes created (Listings count)
      const listingsRef = ref(database, `users/${user.uid}/Listings`);
      const listingsUnsubscribe = onValue(listingsRef, (snapshot) => {
        const listingsData = snapshot.val();
        if (listingsData) {
          const count = Object.keys(listingsData).length;
          setClassesCreated(count);
          console.log('📊 Classes created:', count);
        } else {
          setClassesCreated(0);
        }
      });

      // Fetch students taught (Bookings count)
      const bookingsRef = ref(database, `users/${user.uid}/orders`);
      const bookingsUnsubscribe = onValue(bookingsRef, (snapshot) => {
        const bookingsData = snapshot.val();
        if (bookingsData) {
          const count = Object.keys(bookingsData).length;
          setStudentsTaught(count);
          console.log('📊 Students taught:', count);
        } else {
          setStudentsTaught(0);
        }
      });

      // Fetch average rating from all instructor's listings
      const globalListingsRef = ref(database, 'Listings');
      const ratingsUnsubscribe = onValue(globalListingsRef, (snapshot) => {
        const allListingsData = snapshot.val();
        if (allListingsData) {
          // Filter listings that belong to this instructor
          const instructorListings = Object.entries(allListingsData).filter(
            ([_, listing]: [string, any]) => listing.instructorId === user.uid
          );

          if (instructorListings.length > 0) {
            // Calculate average rating
            let totalRating = 0;
            let ratingsCount = 0;

            instructorListings.forEach(([_, listing]: [string, any]) => {
              if (listing.rating && listing.rating > 0) {
                totalRating += listing.rating;
                ratingsCount++;
              }
            });

            const avgRating = ratingsCount > 0 ? totalRating / ratingsCount : 0;
            setAverageRating(Number(avgRating.toFixed(1)));
            console.log('📊 Average rating:', avgRating.toFixed(1));
          } else {
            setAverageRating(0);
          }
        }
      });

      return () => {
        listingsUnsubscribe();
        bookingsUnsubscribe();
        ratingsUnsubscribe();
      };
    }
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      
      // Sign out from Firebase Auth
      await signOut(auth);
      
      console.log('Instructor signed out successfully');
      
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
              {(instructorProfile?.profilePicture || instructorProfile?.profileImageUri) ? (
                <Image 
                  source={{ uri: instructorProfile.profilePicture || instructorProfile.profileImageUri }} 
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageText}>👨‍🏫</Text>
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
              {instructorProfile?.fullName || 'No name set'}
            </Text>
            {/* Instructor Badge */}
            <View style={styles.instructorBadge}>
              <Text style={styles.instructorText}>Instructor</Text>
            </View>

            {/* Provider Info */}
            {instructorProfile?.provider && (
              <Text style={styles.profileProvider}>
                Signed in with {instructorProfile.provider === 'google.com' ? 'Google' : instructorProfile.provider}
              </Text>
            )}
          </View>

          {/* Instructor Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{classesCreated}</Text>
              <Text style={styles.statLabel}>Classes</Text>
              <Text style={styles.statLabel}>Created</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{studentsTaught}</Text>
              <Text style={styles.statLabel}>Students</Text>
              <Text style={styles.statLabel}>Taught</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{averageRating > 0 ? averageRating : '-'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
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
                  <Text style={styles.infoValue}>{instructorProfile?.fullName || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{instructorProfile?.email || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>User Type</Text>
                  <Text style={styles.infoValue}>
                    {instructorProfile?.userType ? instructorProfile.userType.charAt(0).toUpperCase() + instructorProfile.userType.slice(1) : 'Not set'}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>
                    {instructorProfile?.city && instructorProfile?.state && instructorProfile?.country
                      ? `${instructorProfile.city}, ${instructorProfile.state}, ${instructorProfile.country}`
                      : instructorProfile?.city && instructorProfile?.state
                      ? `${instructorProfile.city}, ${instructorProfile.state}`
                      : instructorProfile?.city
                      ? instructorProfile.city
                      : instructorProfile?.state
                      ? instructorProfile.state
                      : instructorProfile?.country
                      ? instructorProfile.country
                      : 'Not set'
                    }
                  </Text>
                </View>
              </View>
            </View>

            {/* Instructor Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructor Settings</Text>
              <View style={styles.sectionContent}>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Edit Profile</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>My Classes</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Add New Class</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Schedule Management</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Student Management</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Account Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Settings</Text>
              <View style={styles.sectionContent}>
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
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Subscription</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Instructor Preferences */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Instructor Preferences</Text>
              <View style={styles.sectionContent}>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>My Posts</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>My Subscriptions</Text>
                  <Text style={styles.settingArrow}>›</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Favorites</Text>
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
  instructorBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 100,
    marginBottom: 8,
  },
  instructorText: {
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
