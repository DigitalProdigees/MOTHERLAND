import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { get, onValue, ref, remove } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import SVG components
import Ballet from '@/assets/svg/Ballet';
import Contemporary from '@/assets/svg/Contemporary';
import HipHop from '@/assets/svg/HipHop';
import Jazz from '@/assets/svg/Jazz';
import Modern from '@/assets/svg/Modern';
import Salsa from '@/assets/svg/Salsa';
import Swing from '@/assets/svg/Swing';
import Tap from '@/assets/svg/Tap';

interface ClassListing {
  id: string;
  title: string;
  description: string;
  availableSeats: number;
  category: string;
  classType: string;
  difficulty: string;
  subscriberPrice: string;
  nonSubscriberPrice: string;
  date: string;
  time: string;
  location: string;
  status: 'draft' | 'published' | 'pending' | 'approved' | 'rejected';
  createdAt: string;
  instructorId: string;
  instructorName: string;
  imageUrl: string;
  rating?: number;
  subscribers?: number;
  availability?: number;
  reviews?: Review[];
}

interface Review {
  id: string;
  classId: string;
  className: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  description: string;
  createdAt: string;
  timestamp: number;
}

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

interface UserBooking {
  id: string;
  classId: string;
  classTitle: string;
  studentName: string;
  studentEmail: string;
  bookingDate: string;
  createdAt: string;
  status: string;
}

export default function InstructorHomeScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
  const [listings, setListings] = useState<ClassListing[]>([]);
  const [draftListings, setDraftListings] = useState<ClassListing[]>([]);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const [classReviews, setClassReviews] = useState<{[classId: string]: Review[]}>({});

  // Function to fetch reviews for a specific class
  const fetchReviewsForClass = async (classId: string) => {
    try {
      console.log('Fetching reviews for classId:', classId);
      
      // First try global reviews
      const globalReviewsRef = ref(database, `reviews/${classId}`);
      const globalSnapshot = await get(globalReviewsRef);
      
      if (globalSnapshot.exists()) {
        console.log('Found global reviews');
        const globalReviews = Object.values(globalSnapshot.val()) as Review[];
        setClassReviews(prev => ({
          ...prev,
          [classId]: globalReviews
        }));
        return;
      }
      
      // If no global reviews, try instructor's personal listings
      const user = auth.currentUser;
      if (user) {
        const instructorReviewsRef = ref(database, `users/${user.uid}/Listings/${classId}/reviews`);
        const instructorSnapshot = await get(instructorReviewsRef);
        
        if (instructorSnapshot.exists()) {
          console.log('Found instructor reviews');
          const instructorReviews = Object.values(instructorSnapshot.val()) as Review[];
          setClassReviews(prev => ({
            ...prev,
            [classId]: instructorReviews
          }));
          return;
        }
      }
      
      console.log('No reviews found for class:', classId);
      setClassReviews(prev => ({
        ...prev,
        [classId]: []
      }));
      
    } catch (error) {
      console.error('Error fetching reviews for class:', classId, error);
      setClassReviews(prev => ({
        ...prev,
        [classId]: []
      }));
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Fetch instructor profile
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      const unsubscribeProfile = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setInstructorProfile(data);
        }
      });

      // Fetch published listings from user's personal listings
      const listingsRef = ref(database, `users/${user.uid}/Listings`);
      const unsubscribeListings = onValue(listingsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const listingsArray = Object.entries(data).map(([id, listing]: [string, any]) => {
            console.log('Listing data for', id, ':', listing);
            return {
              id,
              rating: listing.rating || 0,
              subscribers: listing.subscribers || 0,
              availability: listing.availability || listing.availableSeats || 0,
              reviewCount: listing.reviewCount || 0,
              ...listing,
            };
          });
          setListings(listingsArray);
          
          // Fetch reviews for each listing
          listingsArray.forEach((listing) => {
            fetchReviewsForClass(listing.id);
          });
        } else {
          setListings([]);
        }
      });

      // Fetch draft listings
      const draftRef = ref(database, `users/${user.uid}/draftListing`);
      const unsubscribeDrafts = onValue(draftRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const draftArray = Object.entries(data).map(([id, listing]: [string, any]) => {
            console.log('Draft listing data for', id, ':', listing);
            return {
              id,
              rating: listing.rating || 0,
              subscribers: listing.subscribers || 0,
              availability: listing.availability || listing.availableSeats || 0,
              reviewCount: listing.reviewCount || 0,
              ...listing,
            };
          });
          setDraftListings(draftArray);
          
          // Fetch reviews for each draft listing
          draftArray.forEach((listing) => {
            fetchReviewsForClass(listing.id);
          });
        } else {
          setDraftListings([]);
        }
      });

      // Fetch user bookings (orders)
      const ordersRef = ref(database, `users/${user.uid}/orders`);
      const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const bookingsArray = Object.entries(data).map(([id, booking]: [string, any]) => ({
            id,
            ...booking,
          }));
          // Sort by creation date (most recent first)
          const sortedBookings = bookingsArray
            .sort((a, b) => new Date(b.createdAt || b.bookingDate || 0).getTime() - new Date(a.createdAt || a.bookingDate || 0).getTime());
          console.log(`Found ${sortedBookings.length} user bookings for instructor`);
          setUserBookings(sortedBookings);
        } else {
          setUserBookings([]);
        }
      });

      setIsLoading(false);

      return () => {
        unsubscribeProfile();
        unsubscribeListings();
        unsubscribeDrafts();
        unsubscribeOrders();
      };
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
    console.log('Navigating to add class screen');
    
    try {
      // Navigate to add-class screen using the same pattern as other screens
      (navigation as any).navigate('Tabs', {
        screen: 'home',
        params: {
          screen: 'add-class',
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
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
    if (typeof navigation.openDrawer === 'function') {
      navigation.openDrawer();
    }
  };

  // Drawer handled by (instructor)/_layout

  const handleDrawerMenuPress = (menuItem: string) => {
    console.log('Drawer menu pressed:', menuItem);
    
    // Add navigation logic for different menu items
    switch (menuItem) {
      case 'My Classes':
        router.push('/(instructor)/home');
        break;
      case 'Add New Class':
        try {
          // Navigate to add-class screen using the same pattern as other screens
          (navigation as any).navigate('Tabs', {
            screen: 'home',
            params: {
              screen: 'add-class',
            },
          });
        } catch (error) {
          console.error('Navigation error:', error);
        }
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

  const handleEditClass = (listing: ClassListing) => {
    console.log('Edit class pressed for:', listing.title);
    
    // Navigate to add-class screen with the listing data as parameters using React Navigation
    (navigation as any).navigate('add-class', {
      editMode: 'true',
      listingId: listing.id,
      title: listing.title,
      description: listing.description,
      availableSeats: listing.availableSeats?.toString() || listing.availability?.toString() || '0',
      category: listing.category,
      classType: listing.classType,
      difficulty: listing.difficulty,
      subscriberPrice: listing.subscriberPrice,
      nonSubscriberPrice: listing.nonSubscriberPrice,
      date: listing.date,
      time: listing.time,
      location: listing.location,
      imageUrl: listing.imageUrl,
      status: listing.status,
    });
  };

  const handleDeleteClass = async (listingId: string, listingTitle: string) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete "${listingTitle}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) {
                Alert.alert('Error', 'You must be logged in to delete a class.');
                return;
              }

              // First, get the listing data to find the global listing ID
              const userListingRef = ref(database, `users/${user.uid}/Listings/${listingId}`);
              const userListingSnapshot = await get(userListingRef);
              
              if (userListingSnapshot.exists()) {
                const userListingData = userListingSnapshot.val();
                const globalListingId = userListingData.listingId;
                
                // Delete from user's published listings
                await remove(userListingRef);

                // Delete from user's draft listings (in case it's a draft)
                const draftRef = ref(database, `users/${user.uid}/draftListing/${listingId}`);
                await remove(draftRef);

                // Delete from global listings using the global listing ID
                if (globalListingId) {
                  const globalListingRef = ref(database, `Listings/${globalListingId}`);
                  await remove(globalListingRef);
                  console.log(`Deleted global listing: ${globalListingId}`);
                } else {
                  // If no global listing ID found, try to find and delete by matching title and instructor
                  console.log('No global listing ID found, attempting to find by matching data...');
                  const globalListingsRef = ref(database, 'Listings');
                  const globalListingsSnapshot = await get(globalListingsRef);
                  
                  if (globalListingsSnapshot.exists()) {
                    const globalListings = globalListingsSnapshot.val();
                    for (const [globalId, globalListing] of Object.entries(globalListings)) {
                      const listing = globalListing as any;
                      if (listing.instructorId === user.uid && 
                          listing.title === listingTitle) {
                        const globalListingRef = ref(database, `Listings/${globalId}`);
                        await remove(globalListingRef);
                        console.log(`Deleted global listing by matching: ${globalId}`);
                        break;
                      }
                    }
                  }
                }

                Alert.alert('Success', 'Class deleted successfully from all locations!');
              } else {
                // If user listing doesn't exist, just try to delete from global listings
                const globalListingRef = ref(database, `Listings/${listingId}`);
                await remove(globalListingRef);
                Alert.alert('Success', 'Class deleted successfully!');
              }
            } catch (error) {
              console.error('Error deleting class:', error);
              Alert.alert('Error', 'Failed to delete class. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleSeeAllListings = () => {
    console.log('See all listings pressed');
  };

  const handleSeeAllUsers = () => {
    console.log('See all users pressed');
  };

  const handleClassPress = (classId: string) => {
    console.log('Navigating to class details with ID:', classId);
    
    try {
      // Navigate to class-details screen with the class ID as a parameter
      (navigation as any).navigate('Tabs', {
        screen: 'home',
        params: {
          screen: 'class-details',
          params: { id: classId },
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    console.log('Tab pressed:', tabName);
  };

  const handleDescriptionToggle = (listingId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listingId)) {
        newSet.delete(listingId);
      } else {
        newSet.add(listingId);
      }
      return newSet;
    });
  };

  // Function to truncate text to first 50 words
  const truncateText = (text: string, wordLimit: number = 20) => {
    if (!text) {
      return 'No description available';
    }
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // Function to get the display text for description
  const getDescriptionText = (listing: ClassListing) => {
    if (expandedDescriptions.has(listing.id)) {
      return listing.description || 'No description available';
    }
    return truncateText(listing.description || 'No description available', 20);
  };

  // Function to check if description needs show more/less
  const shouldShowToggle = (listing: ClassListing) => {
    if (!listing.description) {
      return false;
    }
    const words = listing.description.split(' ');
    return words.length > 50;
  };

  const getCategoryImage = (category: string) => {
    if (!category) {
      return HipHop; // Default fallback
    }
    switch (category.toLowerCase()) {
      case 'ballet':
        return Ballet;
      case 'hip-hop':
      case 'hiphop':
        return HipHop;
      case 'jazz':
        return Jazz;
      case 'salsa':
        return Salsa;
      case 'swing':
        return Swing;
      case 'tap':
        return Tap;
      case 'modern':
        return Modern;
      case 'contemporary':
        return Contemporary;
      default:
        return HipHop; // Default fallback
    }
  };

  const renderClassCard = (listing: ClassListing) => (
    <Pressable 
      key={listing.id} 
      style={styles.classCard}
      onPress={() => handleClassPress(listing.id)}
    >
      <Image
        source={
          listing.imageUrl && listing.imageUrl !== 'placeholder' 
            ? { uri: listing.imageUrl }
            : require('@/assets/images/post1.png')
        }
        style={styles.classImage}
        resizeMode="cover"
      />
      <View style={styles.classTags}>
        <View style={styles.hipHopTag}>
          {React.createElement(getCategoryImage(listing.category), {
            width: 25,
            height: 25,
            style: styles.tagIcon,
            color: '#FFFFFF'
          })}
          <Text style={styles.tagText}>{listing.category || 'Dance'}</Text>
        </View> 
      </View>
      <View style={{position:'absolute',top:0,right:0}}>
        <View style={
          listing.status === 'draft' ? styles.draftTag :
          listing.status === 'pending' ? styles.pendingTag :
          listing.status === 'rejected' ? styles.rejectedTag :
          styles.publishedTag
        }>
          <Text style={
            listing.status === 'draft' ? styles.draftTagText :
            listing.status === 'pending' ? styles.pendingTagText :
            listing.status === 'rejected' ? styles.rejectedTagText :
            styles.publishedTagText
          }>
            {listing.status === 'draft' ? 'Draft' :
             listing.status === 'pending' ? 'Pending' :
             listing.status === 'rejected' ? 'Rejected' :
             listing.status === 'approved' ? 'Approved' : 'Published'}
          </Text>
        </View>
      </View>
      
      {/* Pending Overlay */}
      {listing.status === 'pending' && (
        <View style={styles.pendingOverlay}>
          <Text style={styles.pendingOverlayText}>Waiting for admin approval</Text>
        </View>
      )}
      
      {/* Rejected Overlay */}
      {listing.status === 'rejected' && (
        <View style={styles.rejectedOverlay}>
          <Text style={styles.rejectedOverlayTitle}>Rejected by Admin</Text>
          <Pressable
            style={styles.rejectedDeleteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteClass(listing.id, listing.title);
            }}
          >
            <Text style={styles.rejectedDeleteButtonText}>Delete Listing</Text>
          </Pressable>
        </View>
      )}
     
      <View style={styles.classContent}>
        <View style={styles.classTitleRow}>
          <Text style={styles.classTitle}>{listing.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{listing.subscriberPrice}</Text>
            <Text style={styles.subscribersText}>Subscribers</Text>
          </View>
        </View>
        <Text style={styles.classDescription}>
          {getDescriptionText(listing)}
        </Text>
        {shouldShowToggle(listing) && (
          <Pressable 
            onPress={(e) => {
              e.stopPropagation();
              handleDescriptionToggle(listing.id);
            }} 
            style={styles.showMoreContainer}
          >
            <Text style={styles.showMore}>
              {expandedDescriptions.has(listing.id) ? 'Show less' : 'Show more'}
            </Text>
          </Pressable>
        )}
        <View style={styles.classRating}>
          <Text style={styles.ratingText}>{(listing.rating || 0).toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => {
              const rating = listing.rating || 0;
              const isFilled = star <= Math.floor(rating);
              const isHalfFilled = star === Math.floor(rating) + 1 && rating % 1 >= 0.5;
              return (
                <Text key={star} style={[styles.star, { 
                  color: (isFilled || isHalfFilled) ? '#8A53C2' : '#8A53C2'
                }]}>
                  {(isFilled || isHalfFilled) ? '★' : '☆'}
                </Text>
              );
            })}
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
            <Text style={styles.detailText}>{listing.instructorName}</Text>
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
            <Text style={styles.availabilityText}>
              {listing.availableSeats || listing.availability || 0} available
            </Text>
          </View>
        </View>
        <View style={styles.classActions}>
          <Pressable 
            style={styles.editButton} 
            onPress={(e) => {
              e.stopPropagation();
              handleEditClass(listing);
            }}
          >
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
          <Pressable 
            style={styles.deleteButton} 
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteClass(listing.id, listing.title);
            }}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
            <Image
              source={require('@/assets/images/instrash.png')}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

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

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
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

          {/* Render all listings (both published and drafts) sorted by creation date */}
          {[...listings, ...draftListings].length > 0 ? (
            [...listings, ...draftListings]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(renderClassCard)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No listings yet. Create your first class!</Text>
            </View>
          )}
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
              <Text style={styles.headerTextName}>Name</Text>
              <Text style={styles.headerText}>Booking Date</Text>
              <Text style={styles.headerText}>Class Name</Text>
            </View>
            {userBookings.length > 0 ? (
              userBookings.map((booking, index) => (
                <View key={booking.id} style={styles.tableRow}>
                  <View style={styles.userInfo}>
                    <Image
                      source={require('@/assets/images/fav1.png')}
                      style={styles.userImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.userName}>{booking.studentName}</Text>
                  </View>
                  <Text style={styles.bookingDate}>
                    {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </Text>
                  <Text style={styles.className}>{booking.classTitle}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyUserList}>
                <Text style={styles.emptyUserListText}>No bookings yet</Text>
                <Text style={styles.emptyUserListSubtext}>Students will appear here when they book your classes</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation moved to Tab Navigator; removed here */}

      {/* Drawer provided by navigator */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 0
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
    tintColor:'#FFFFFF',
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
  pendingTag: {
    backgroundColor: '#FFE5B4',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  pendingTagText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FF8C00',
  },
  rejectedTag: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  rejectedTagText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FF0000',
  },
  pendingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    zIndex: 999,
  },
  pendingOverlayText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  rejectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 20,
    zIndex: 999,
  },
  rejectedOverlayTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    zIndex: 1000,
  },
  rejectedDeleteButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    zIndex: 1001,
  },
  rejectedDeleteButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FF0000',
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
  reviewCount: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    marginLeft: 8,
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
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerTextName: {
    flex: 1,
    fontSize: 14,
    left:20,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    textAlign: 'left',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 16,
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
    flex: 1,
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
    backgroundColor:'rgba(19, 203, 70, 0.1)',
    textAlign: 'center',
    paddingVertical:4,
    borderRadius:4,
  },
  // Bottom navigation - matching custom tab bar
  bottomNavigation: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
  // Empty state styles
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#666666',
    textAlign: 'center',
  },
  emptyUserList: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyUserListText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#333333',
    marginBottom: 8,
  },
  emptyUserListSubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
  },
  showMoreContainer: {
    alignSelf: 'flex-start',
  },
  showMore: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    marginBottom:12,
    color: '#8A53C2',
    textDecorationLine: 'underline',
  },
});
