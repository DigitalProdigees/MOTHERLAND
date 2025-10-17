import GradientButton from '@/components/ui/gradient-button';
import Header from '@/components/ui/header';
import { Fonts, Icons } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface InstructorProfile {
  fullName: string;
  bio: string;
  experience: string;
  hourlyRate: string;
  danceStyles: string[];
  profileImageUri: string;
  city: string;
  state: string;
  country: string;
}

export default function InstructorHomeScreen() {
  const router = useRouter();
  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setInstructorProfile(data);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth.signOut();
              router.replace('/(auth)/signin');
            } catch (error) {
              console.log('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleCreateClass = () => {
    Alert.alert(
      'Coming Soon',
      'Class creation feature will be available soon!',
      [{ text: 'OK' }]
    );
  };

  const handleViewBookings = () => {
    Alert.alert(
      'Coming Soon',
      'Booking management feature will be available soon!',
      [{ text: 'OK' }]
    );
  };

  const handleEditProfile = () => {
    router.push('/(onboarding)/instructor-profile');
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Instructor Dashboard"
        onBackPress={handleSignOut}
        showBackButton={false}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <LinearGradient
            colors={['#F708F7', '#C708F7', '#F76B0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.welcomeCard}
          >
            <Text style={styles.welcomeTitle}>
              Welcome back, {instructorProfile?.fullName || 'Instructor'}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Ready to inspire the next generation of dancers?
            </Text>
          </LinearGradient>
        </View>

        {/* Profile Summary */}
        <View style={styles.profileSummary}>
          <Text style={styles.sectionTitle}>Your Profile</Text>
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{instructorProfile?.fullName}</Text>
              <Text style={styles.profileLocation}>
                {instructorProfile?.city}, {instructorProfile?.state}
              </Text>
              <Text style={styles.profileRate}>${instructorProfile?.hourlyRate}/hour</Text>
              <Text style={styles.profileExperience}>{instructorProfile?.experience} years experience</Text>
            </View>
            <Pressable style={styles.editButton} onPress={handleEditProfile}>
              <Icons.Setting width={20} height={20} />
            </Pressable>
          </View>
        </View>

        {/* Dance Styles */}
        <View style={styles.danceStylesSection}>
          <Text style={styles.sectionTitle}>Your Dance Styles</Text>
          <View style={styles.danceStylesContainer}>
            {instructorProfile?.danceStyles?.map((style, index) => (
              <View key={index} style={styles.danceStyleTag}>
                <Text style={styles.danceStyleText}>{style}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Pressable style={styles.actionButton} onPress={handleCreateClass}>
            <View style={styles.actionIcon}>
              <Icons.PlusAdd width={24} height={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Create New Class</Text>
              <Text style={styles.actionSubtitle}>Schedule a new dance class</Text>
            </View>
            <Icons.Next width={20} height={20} />
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleViewBookings}>
            <View style={styles.actionIcon}>
              <Icons.Classes width={24} height={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Bookings</Text>
              <Text style={styles.actionSubtitle}>Manage your class bookings</Text>
            </View>
            <Icons.Next width={20} height={20} />
          </Pressable>

          <Pressable style={styles.actionButton} onPress={handleEditProfile}>
            <View style={styles.actionIcon}>
              <Icons.Profile width={24} height={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Edit Profile</Text>
              <Text style={styles.actionSubtitle}>Update your instructor information</Text>
            </View>
            <Icons.Next width={20} height={20} />
          </Pressable>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Classes Created</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sign Out Button */}
      <View style={styles.footer}>
        <GradientButton
          title="Sign Out"
          onPress={handleSignOut}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  welcomeSection: {
    marginVertical: 20,
  },
  welcomeCard: {
    padding: 24,
    borderRadius: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  profileSummary: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    marginBottom: 4,
  },
  profileRate: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#8A53C2',
    marginBottom: 4,
  },
  profileExperience: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8A53C2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  danceStylesSection: {
    marginBottom: 24,
  },
  danceStylesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  danceStyleTag: {
    backgroundColor: '#8A53C2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  danceStyleText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8A53C2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  statsSection: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#8A53C2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#666666',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'center',
  },
});
