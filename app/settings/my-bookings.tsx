import ReviewModal from '@/components/ui/review-modal';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { useRouter } from 'expo-router';
import { get, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface BookingItem {
  id: string;
  classId: string;
  classTitle: string;
  classDescription: string;
  classCategory: string;
  classType: string;
  classDifficulty: string;
  classImage: string;
  classDate: string;
  classTime: string;
  classLocation: string;
  price: string;
  totalPrice: string;
  instructorId: string;
  instructorName: string;
  instructorImage: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  bookingDate: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  hasReviewed?: boolean;
}

// Helper function to format date without year
const formatDateWithoutYear = (dateString: string) => {
  try {
    // If the date string is already in a readable format, return it
    if (typeof dateString === 'string' && dateString.includes(',')) {
      // Handle formats like "Tuesday, October 28, 2025"
      const parts = dateString.split(',');
      if (parts.length >= 2) {
        return parts.slice(0, 2).join(',').trim(); // Return "Tuesday, October 28"
      }
    }
    
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if date is invalid
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

const BookingCard: React.FC<{ 
  item: BookingItem; 
  onReviewPress: (classId: string, className: string) => void;
  onCardPress: (classId: string) => void;
}> = ({ item, onReviewPress, onCardPress }) => {
  return (
    <Pressable 
      style={styles.card}
      onPress={() => onCardPress(item.classId)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={
            item.classImage && item.classImage !== 'placeholder'
              ? { uri: item.classImage }
              : require('@/assets/images/fav1.png')
          }
          style={styles.classImage} 
          resizeMode="contain" 
        />
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{item.classTitle}</Text>
          <Text style={styles.price}>${item.totalPrice}</Text>
        </View>
        
        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeLeft}>
            <Image
              source={require('@/assets/images/emptyClock.png')}
              style={styles.clockIcon}
              resizeMode="contain"
            />
            <Text style={styles.dateTime}>{formatDateWithoutYear(item.classDate)}</Text>
          </View>
          <View style={styles.exactTimeContainer}>
            <Image
              source={require('@/assets/images/emptyClock.png')}
              style={styles.clockIcon}
              resizeMode="contain"
            />
            <Text style={styles.exactTime}>{item.classTime}</Text>
          </View>
        </View>
        
        <View style={styles.instructorRow}>
          <Text style={styles.instructorLabel}>Instructor:</Text>
          <View style={styles.instructorInfo}>
          <Image 
            source={item.instructorImage ? { uri: item.instructorImage } : require('@/assets/images/annie-bens.png')} 
            style={styles.instructorImage} 
            resizeMode="cover" 
          />
          <Text style={styles.instructorName}>{item.instructorName}</Text></View>
        </View>

        {/* Review Button */}
        <View style={styles.actionButtons}>
          <Pressable 
            style={[
              styles.reviewButton, 
              item.hasReviewed && styles.reviewButtonDisabled
            ]}
            onPress={(e) => {
              e.stopPropagation(); // Prevent card press when review button is pressed
              if (!item.hasReviewed) {
                onReviewPress(item.classId, item.classTitle);
              }
            }}
            disabled={item.hasReviewed}
          >
            <Image 
              source={require('@/assets/images/star.png')}
              style={styles.reviewIcon}
            />
            <Text style={styles.reviewText}>
              {item.hasReviewed ? 'Already Reviewed' : 'Write Review'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

export default function MyBookingsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  
  // Review modal state
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedClassName, setSelectedClassName] = useState<string>('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const bookingsRef = ref(database, `users/${user.uid}/bookings`);
      const snapshot = await get(bookingsRef);
      
      if (snapshot.exists()) {
        const bookingsData = snapshot.val();
        const bookingsList = Object.values(bookingsData) as BookingItem[];
        
        // Check review status for each booking
        const bookingsWithReviewStatus = await Promise.all(
          bookingsList.map(async (booking) => {
            const hasReviewed = await checkIfUserReviewedClass(user.uid, booking.classId);
            return { ...booking, hasReviewed };
          })
        );
        
        // Sort by createdAt in descending order (most recent first)
        const sortedBookings = bookingsWithReviewStatus.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.bookingDate || 0);
          const dateB = new Date(b.createdAt || b.bookingDate || 0);
          return dateB.getTime() - dateA.getTime();
        });
        setBookings(sortedBookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfUserReviewedClass = async (userId: string, classId: string): Promise<boolean> => {
    try {
      const userReviewsRef = ref(database, `users/${userId}/reviews`);
      const snapshot = await get(userReviewsRef);
      
      if (snapshot.exists()) {
        const reviews = snapshot.val();
        // Check if any review exists for this classId
        const hasReview = Object.values(reviews).some(
          (review: any) => review.classId === classId
        );
        return hasReview;
      }
      return false;
    } catch (error) {
      console.error('Error checking review status:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBackPress = () => {
    router.back();
  };

  const handleReviewPress = (classId: string, className: string) => {
    console.log('Review button pressed for:', className);
    console.log('ClassId being passed:', classId);
    setSelectedClassId(classId);
    setSelectedClassName(className);
    setReviewModalVisible(true);
    console.log('Modal should be visible:', true);
  };

  const handleReviewModalClose = () => {
    setReviewModalVisible(false);
    setSelectedClassId('');
    setSelectedClassName('');
  };

  const handleReviewSubmitted = () => {
    // Refresh data or show success message
    console.log('Review submitted successfully');
    // Optionally refresh bookings to show updated data
    fetchBookings();
  };

  const handleCardPress = async (classId: string) => {
    console.log('🔵 MY BOOKINGS: handleCardPress called with classId:', classId);
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      // Save the class id to database for home/index.tsx to read
      const navigationStateRef = ref(database, `users/${user.uid}/navigationState/selectedClassId`);
      await set(navigationStateRef, classId);
      console.log('🔵 MY BOOKINGS: Saved classId to database:', classId);
      
      // Navigate to home screen - it will read the id from database and redirect
      router.push('/(home)/home');
    } catch (error) {
      console.error('Error saving class id to database:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A53C2" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Image
            source={require('@/assets/images/chevron-left.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
        <Text style={styles.headerTitle}>Booked Classes</Text>
        {/* Test button for debugging */}
       
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {bookings.length > 0 ? (
          bookings.map((item) => (
            <BookingCard 
              key={item.id} 
              item={item} 
              onReviewPress={handleReviewPress}
              onCardPress={handleCardPress}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookings found</Text>
            <Text style={styles.emptySubtext}>Book your first class to see it here!</Text>
          </View>
        )}
      </ScrollView>

      {/* Review Modal */}
      <ReviewModal
        visible={reviewModalVisible}
        onClose={handleReviewModalClose}
        classId={selectedClassId}
        className={selectedClassName}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
    borderRadius: 12,
    marginBottom: 16,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  classImage: {
    width: '100%',
    height: '100%',
    borderRadius:10,
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom:6,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 22,
    fontWeight:'bold',
    color: '#222222',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateTimeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#C708F7',
  },
  dateTime: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
  },
  exactTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exactTime: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  instructorLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#808B95',
    marginRight: 8,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  instructorName: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
  },
  actionButtons: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A53C2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  reviewButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  reviewIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
  },
  testButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#666666',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
  },
});
