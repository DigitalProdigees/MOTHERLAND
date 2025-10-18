import InstructorDrawer from '@/components/ui/instructor-drawer';
import { Fonts, Icons } from '@/constants/theme';
import { useInstructorDrawer } from '@/contexts/InstructorDrawerContext';
import { auth, database } from '@/firebase.config';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

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
  const { isInstructorDrawerOpen, setIsInstructorDrawerOpen } = useInstructorDrawer();
  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');

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
    router.push('/(instructor)/add-class');
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

  const handleMenuPress = () => {
    setIsInstructorDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsInstructorDrawerOpen(false);
  };

  const handleDrawerMenuPress = (menuItem: string) => {
    console.log('Drawer menu pressed:', menuItem);
    setIsInstructorDrawerOpen(false);
    
    // Add navigation logic for different menu items
    switch (menuItem) {
      case 'My Classes':
        router.push('/(instructor)/home');
        break;
      case 'Add New Class':
        router.push('/(instructor)/add-class');
        break;
      case 'Class Analytics':
        // Add navigation to analytics screen
        break;
      case 'My Students':
        // Add navigation to students screen
        break;
      case 'Switch as Student':
        router.push('/(home)/home');
        break;
      case 'My Earnings':
        // Add navigation to earnings screen
        break;
      case 'Payment Settings':
        // Add navigation to payment settings screen
        break;
      case 'My Favourites':
        router.push('/ins-settings/favourites');
        break;
      case 'Subscriptions':
        router.push('/ins-settings/my-subscriptions');
        break;
      case 'Change Password':
        router.push('/ins-settings/change-password');
        break;
      case 'Contact Us':
        router.push('/ins-settings/contact-us');
        break;
      case 'Terms of services':
        router.push('/ins-settings/terms-conditions');
        break;
      case 'Privacy Policy':
        router.push('/ins-settings/privacy-policy');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        try {
          setIsInstructorDrawerOpen(false);
          await auth.signOut();
          router.replace('/(auth)/signin');
        } catch (error) {
          console.log('Error signing out:', error);
          Alert.alert('Error', 'Failed to logout. Please try again.');
        }
      }}
    ]);
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

  const handleEditClass = () => {
    console.log('Edit class pressed');
  };

  const handleDeleteClass = () => {
    console.log('Delete class pressed');
  };

  const handleSeeAllListings = () => {
    console.log('See all listings pressed');
  };

  const handleSeeAllUsers = () => {
    console.log('See all users pressed');
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    console.log('Tab pressed:', tabName);
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.menuButton} onPress={handleMenuPress}>
          <Image
            source={require('@/assets/images/insDrawer.png')}
            style={styles.menuIcon}
            resizeMode="contain"
          />
        </Pressable>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon} onPress={handleAddPress}>
            <Image
              source={require('@/assets/images/insAdd.png')}
              style={styles.headerIconImage}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.headerIcon} onPress={handleSearchPress}>
            <Image
              source={require('@/assets/images/insSearch.png')}
              style={styles.headerIconImage}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.headerIcon} onPress={handleNotificationPress}>
            <Image
              source={require('@/assets/images/insBell.png')}
              style={styles.headerIconImage}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add a new class section */}
        <View style={styles.addClassSection}>
          <Pressable style={styles.addClassButton} onPress={handleCreateClass}>
            <Image
              source={require('@/assets/images/insAddClass.png')}
              style={styles.addClassIcon}
              resizeMode="contain"
            />
            <Text style={styles.addClassText}>Add a new class</Text>
          </Pressable>
        </View>

        {/* Your listing section */}
        <View style={styles.listingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your listing</Text>
            <Pressable onPress={handleSeeAllListings}>
              <Text style={styles.seeAllText}>See all</Text>
            </Pressable>
          </View>

          {/* Class Card 1 - Draft */}
          <View style={styles.classCard}>
            <Image
              source={require('@/assets/images/post1.png')}
              style={styles.classImage}
              resizeMode="cover"
            />
            <View style={styles.classTags}>
                <View style={styles.hipHopTag}>
                  <Image
                    source={require('@/assets/images/hipHop.png')}
                    style={styles.tagIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.tagText}>Hip-Hop</Text>
                </View> 
                </View>
                <View style={{position:'absolute',top:0,right:0}}>
              <View style={styles.draftTag}>
                <Text style={styles.draftTagText}>Draft</Text>
              </View></View>
           
            <View style={styles.classContent}>
              <View style={styles.classTitleRow}>
                <Text style={styles.classTitle}>Street Dance Basics</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>$0</Text>
                  <Text style={styles.subscribersText}>Subscribers</Text>
        </View>
              </View>
              <Text style={styles.classDescription}>
                Lorem ipsum dolor sit amet risus phasellus. Morbi
              </Text>
              <View style={styles.classRating}>
                <Text style={styles.ratingText}>4.9</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} style={styles.star}>★</Text>
            ))}
          </View>
        </View>
              <View style={styles.instructorRow}>
                <Text style={styles.instructorLabel}>Instructor:</Text>
                <View style={styles.instructorInfo}>
                  <Image
                    source={require('@/assets/images/fav1.png')}
                    style={styles.instructorImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.detailText}>James Ray</Text>
                </View>
              </View>
              <View style={styles.availabilityRow}>
                <View style={styles.detailItem}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Image
                    source={require('@/assets/images/availability.png')}
                    style={styles.detailIcon}
                    resizeMode="contain"
                  /> 
                  <Text style={styles.detailText}>Seat Availability</Text>
                  </View>
                  <Text style={styles.availabilityText}>10 available</Text>
           </View>
            </View>
              <View style={styles.classActions}>
                <Pressable style={styles.editButton} onPress={handleEditClass}>
                  <LinearGradient
                    colors={['#F708F7', '#C708F7', '#F76B0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.editButtonGradient}
                  >
                 
                    <Text style={styles.editButtonText}>Edit</Text>
                       <Image
                      source={require('@/assets/images/insEdit.png')}
                      style={styles.actionIcon}
                      resizeMode="contain"
                    />
                  </LinearGradient>
                </Pressable>
                <Pressable style={styles.deleteButton} onPress={handleDeleteClass}>
                  
                  <Text style={styles.deleteButtonText}>Delete</Text>
                  <Image
                    source={require('@/assets/images/instrash.png')}
                    style={styles.actionIcon}
                    resizeMode="contain"
                  />
          </Pressable>
              </View>
            </View>
          </View>

          {/* Class Card 2 - Published */}
          <View style={styles.classCard}>
            <Image
              source={require('@/assets/images/post1.png')}
              style={styles.classImage}
              resizeMode="cover"
            />
            <View style={styles.classTags}>
              <View style={styles.hipHopTag}>
                <Image
                  source={require('@/assets/images/hipHop.png')}
                  style={styles.tagIcon}
                  resizeMode="contain"
                />
                <Text style={styles.tagText}>Hip-Hop</Text>
              </View> 
              </View>
            <View style={{position:'absolute',top:0,right:0}}>
              <View style={styles.publishedTag}>
                <Text style={styles.publishedTagText}>Published</Text>
              </View></View>
           
            <View style={styles.classContent}>
              <View style={styles.classTitleRow}>
                <Text style={styles.classTitle}>Street Dance Basics</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>$0</Text>
                  <Text style={styles.subscribersText}>Subscribers</Text>
                </View>
              </View>
              <Text style={styles.classDescription}>
                Lorem ipsum dolor sit amet risus phasellus. Morbi
              </Text>
              <View style={styles.ratingAndDuration}>
                <View style={styles.classRating}>
                  <Text style={styles.ratingText}>4.9</Text>
                  <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text key={star} style={styles.star}>★</Text>
                    ))}
                  </View>
                </View>
                <View style={styles.durationItem}>
                  <Image
                    source={require('@/assets/images/clock.png')}
                    style={styles.detailIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.detailText}>45 min</Text>
                </View>
              </View>
              <View style={styles.instructorRow}>
                <Text style={styles.instructorLabel}>Instructor:</Text>
                <View style={styles.instructorInfo}>
                  <Image
                    source={require('@/assets/images/fav1.png')}
                    style={styles.instructorImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.detailText}>James Ray</Text>
                </View>
              </View>
              <View style={styles.availabilityRow}>
                <View style={styles.detailItem}>
                 <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Image
                    source={require('@/assets/images/availability.png')}
                    style={styles.detailIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.detailText}>Seat Availability</Text></View>
                  <Text style={styles.availabilityText}>10 available</Text>
                </View>
              </View>
              <View style={styles.classActions}>
                <Pressable style={styles.editButton} onPress={handleEditClass}>
                  <LinearGradient
                    colors={['#F708F7', '#C708F7', '#F76B0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.editButtonGradient}
                  >
                   
                    <Text style={styles.editButtonText}>Edit</Text>
                    <Image
                      source={require('@/assets/images/insEdit.png')}
                      style={styles.actionIcon}
                      resizeMode="contain"
                    />
                  </LinearGradient>
                </Pressable>
                <Pressable style={styles.deleteButton} onPress={handleDeleteClass}>
                
                  <Text style={styles.deleteButtonText}>Delete</Text>
                  <Image
                    source={require('@/assets/images/instrash.png')}
                    style={styles.actionIcon}
                    resizeMode="contain"
                  />
          </Pressable>
              </View>
            </View>
            </View>
        </View>

        {/* User List section */}
        <View style={styles.userListSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>User List</Text>
            <Pressable onPress={handleSeeAllUsers}>
              <Text style={styles.seeAllText}>See all</Text>
            </Pressable>
          </View>

          <View style={styles.userListTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Name</Text>
              <Text style={styles.headerText}>Booking Date</Text>
              <Text style={styles.headerText}>Class Name</Text>
            </View>
            {[1, 2, 3].map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={styles.userInfo}>
                  <Image
                    source={require('@/assets/images/fav1.png')}
                    style={styles.userImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.userName}>James Ray</Text>
            </View>
                <Text style={styles.bookingDate}>28 Sep, 2025</Text>
                <Text style={styles.className}>Street Dance Basic</Text>
            </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <LinearGradient
        colors={['#F708F7', '#C708F7', '#F76B0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bottomNavigation}
      >
        <Pressable 
          style={styles.tabButton} 
          onPress={() => handleTabPress('home')}
        >
          <View style={styles.tabIconContainer}>
            <Icons.Home width={24} height={24} color="#FFFFFF" />
          </View>
          <Text style={styles.tabLabel}>Home</Text>
        </Pressable>
        
        <Pressable 
          style={styles.tabButton} 
          onPress={() => handleTabPress('classes')}
        >
          <View style={styles.tabIconContainer}>
            <Icons.Classes width={24} height={24} color="#FFFFFF" />
            {activeTab === 'classes' && <View style={styles.activeIndicator} />}
          </View>
          <Text style={styles.tabLabel}>Classes</Text>
        </Pressable>
        
        <Pressable 
          style={styles.tabButton} 
          onPress={() => handleTabPress('community')}
        >
          <View style={styles.tabIconContainer}>
            <Icons.Community width={24} height={24} color="#FFFFFF" />
          </View>
          <Text style={styles.tabLabel}>Community</Text>
        </Pressable>
        
        <Pressable 
          style={styles.tabButton} 
          onPress={() => handleTabPress('profile')}
        >
          <View style={styles.tabIconContainer}>
            <Icons.Profile width={24} height={24} color="#FFFFFF" />
      </View>
          <Text style={styles.tabLabel}>Profile</Text>
        </Pressable>
      </LinearGradient>

      {/* Instructor Drawer */}
      <InstructorDrawer
        isOpen={isInstructorDrawerOpen}
        onClose={handleDrawerClose}
        onMenuPress={handleDrawerMenuPress}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom:-40
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
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    padding: 8,
  },
  headerIconImage: {
    width: 43,
    height: 43,
    marginRight:-10,
  },
  // Content styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Add class section
  addClassSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  addClassButton: {
    width: '100%',
    height: 150,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  addClassIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  addClassText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#666666',
  },
  // Listing section
  listingSection: {
    marginBottom: 30,
  },
  // Class card styles
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  classTags: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hipHopTag: {
    backgroundColor: 'rgba(7, 7, 7, 0.23)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagIcon: {
    width: 25,
    height: 25,
    marginRight: 4,
  },
  tagText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
  },
  draftTag: {
    backgroundColor: '#FFDEC8',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  draftTagText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#D05706',
  },
  publishedTag: {
    backgroundColor: '#94F3B5',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  publishedTagText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#08A755',
  },
 
  classContent: {
    padding: 16,
  },
  classTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  classTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  subscribersText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 7,
    borderRadius: 4,
    marginLeft: 4,
  },
  classDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    marginBottom: 12,
    lineHeight: 20,
  },
  ratingAndDuration: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  classRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginRight: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 20,
    color: '#8A53C2',
    marginRight: 2,
  },
  instructorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructorLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#666666',
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityRow: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  instructorImage: {
    width: 25,
    height: 25,
    borderRadius: 10,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#4CAF50',
    marginLeft: 8,
  },
  classActions: {
    flexDirection: 'row',
    width:'60%',
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderRadius: 100,
    overflow: 'hidden',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
    marginRight: 6,
  },
  deleteButton: {
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB6C1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 100,
  },
  deleteButtonText: {
    fontSize: 14,
fontWeight:'bold',    color: '#FF0000',
    marginRight: 6,
  },
  actionIcon: {
    width: 16,
    height: 16,
  },
  // User list section
  userListSection: {
    marginBottom: 30,
  
  },
  userListTable: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth:1,
    overflow: 'hidden',
    borderColor:'#E2E2E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    backgroundColor: '#8A53C2',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.bold,
    
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems:'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  bookingDate: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
  },
  className: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#4CAF50',
    textAlign: 'center',
  },
  // Bottom navigation - matching custom tab bar
  bottomNavigation: {
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: 4,
    color: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
});
