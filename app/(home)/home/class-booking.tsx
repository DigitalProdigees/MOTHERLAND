
import Star from '@/assets/svg/Star';
import GradientBackground from '@/components/ui/gradient-background';
import ProfileAvatar from '@/components/ui/profile-avatar';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { get, onValue, push, ref, remove, set } from 'firebase/database';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ClassData {
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
  instructorId: string;
  instructorName: string;
  imageUrl: string;
  rating: number;
  subscribers: number;
  availability: number;
  status: string;
  createdAt: string;
  userListingId?: string;
  customTerms?: string;
  customRequirements?: string;
  customCancellation?: string;
  cancellationPolicyHeading?: string;
  termsEnabled?: boolean;
}

interface InstructorData {
  fullName: string;
  email: string;
  signupYear: string;
  experience: string;
  bio: string;
  profileImage: string;
  rating: number;
}

export default function ClassBookingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [instructorData, setInstructorData] = useState<InstructorData | null>(null);
  const [studentData, setStudentData] = useState<InstructorData | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Bottom sheet refs for booking policies
  const termsSheetRef = useRef<BottomSheet>(null);
  const requirementsSheetRef = useRef<BottomSheet>(null);
  const cancellationSheetRef = useRef<BottomSheet>(null);

  // Checkbox states
  const [termsChecked, setTermsChecked] = useState(false);
  const [requirementsChecked, setRequirementsChecked] = useState(false);
  const [cancellationChecked, setCancellationChecked] = useState(false);

  // Snap points for bottom sheets
  const snapPoints = useMemo(() => ['75%'], []);

  // Render backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Fetch class data from database with real-time listener
  const fetchClassData = async () => {
    try {
      setLoading(true);
      const classRef = ref(database, `Listings/${id}`);
      
      // Set up real-time listener
      const unsubscribe = onValue(classRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const classDataWithId = {
            id: id as string,
            ...data
          };
          setClassData(classDataWithId);
          
          // Log current seat availability for debugging
          const availableSeats = data.availableSeats || data.availability || 0;
          console.log(`Real-time update: Class ${id} now has ${availableSeats} seats available`);
          
          // Fetch instructor data only once
          if (!instructorData) {
            fetchInstructorData(data.instructorId);
          }
        } else {
          console.error('Class not found');
          router.back();
        }
      }, (error) => {
        console.error('Real-time listener error:', error);
      });
      
      // Store the unsubscribe function for cleanup
      return unsubscribe;
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch instructor data from personalInfo
  const fetchInstructorData = async (instructorId: string) => {
    try {
      const instructorRef = ref(database, `users/${instructorId}/personalInfo`);
      const instructorSnapshot = await get(instructorRef);
      
      if (instructorSnapshot.exists()) {
        const data = instructorSnapshot.val();
        setInstructorData({
          fullName: data.fullName || 'Instructor',
          email: data.email || '',
          signupYear: data.signupYear || new Date().getFullYear().toString(),
          experience: data.experience || '1 Year Experience',
          bio: data.bio || 'No bio available',
          profileImage: data.profileImage || '',
          rating: data.rating || 0
        });
      }
    } catch (error) {
      console.error('Error fetching instructor data:', error);
    }
  };

  // Fetch student data from personalInfo
  const fetchStudentData = async (studentId: string) => {
    try {
      const studentRef = ref(database, `users/${studentId}/personalInfo`);
      const studentSnapshot = await get(studentRef);
      
      if (studentSnapshot.exists()) {
        const data = studentSnapshot.val();
        setStudentData({
          fullName: data.fullName || 'Student',
          email: data.email || '',
          signupYear: data.signupYear || new Date().getFullYear().toString(),
          experience: data.experience || '1 Year Experience',
          bio: data.bio || 'No bio available',
          profileImage: data.profileImage || '',
          rating: data.rating || 0
        });
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    if (id) {
      fetchClassData().then((unsub) => {
        unsubscribe = unsub;
      });
    }
    
    // Fetch current user's personal info
    const user = auth.currentUser;
    if (user) {
      fetchStudentData(user.uid);
    }

    // Check bookmark status
    checkBookmarkStatus();
    
    // Cleanup listener on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  const handleBackPress = () => {
    router.back();
  };

  const handleDescriptionToggle = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  // Function to truncate text to first 50 words
  const truncateText = (text: string, wordLimit: number = 50) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // Function to get the display text for description
  const getDescriptionText = () => {
    if (!classData) return '';
    
    if (isDescriptionExpanded) {
      return classData.description;
    }
    return truncateText(classData.description, 50);
  };

  // Function to check if description needs show more/less
  const shouldShowToggle = () => {
    if (!classData) return false;
    const words = classData.description.split(' ');
    return words.length > 50;
  };

  // Function to check if all policies are accepted
  const areAllPoliciesAccepted = () => {
    if (!classData) return true; // If no class data, allow booking
    
    let requiredCheckboxes = 0;
    let checkedCount = 0;
    
    if (classData.customTerms) {
      requiredCheckboxes++;
      if (termsChecked) checkedCount++;
    }
    
    if (classData.customRequirements) {
      requiredCheckboxes++;
      if (requirementsChecked) checkedCount++;
    }
    
    if (classData.customCancellation) {
      requiredCheckboxes++;
      if (cancellationChecked) checkedCount++;
    }
    
    // All required checkboxes must be checked
    return requiredCheckboxes === 0 || checkedCount === requiredCheckboxes;
  };

  // Check if class is bookmarked
  const checkBookmarkStatus = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !id) return;

      const favouritesRef = ref(database, `users/${user.uid}/favourites`);
      const favouritesSnapshot = await get(favouritesRef);
      
      if (favouritesSnapshot.exists()) {
        const favourites = favouritesSnapshot.val();
        const isBookmarked = Object.values(favourites).some((fav: any) => fav.id === id);
        setIsBookmarked(isBookmarked);
      } else {
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  // Toggle bookmark
  const handleBookmarkToggle = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !classData) {
        alert('You must be logged in to bookmark classes.');
        return;
      }

      if (isBookmarked) {
        // Remove from favourites
        const favouritesRef = ref(database, `users/${user.uid}/favourites`);
        const favouritesSnapshot = await get(favouritesRef);
        
        if (favouritesSnapshot.exists()) {
          const favourites = favouritesSnapshot.val();
          const favouriteEntries = Object.entries(favourites);
          const favouriteToRemove = favouriteEntries.find(([_, fav]: [string, any]) => fav.id === id);
          
          if (favouriteToRemove) {
            const [favouriteKey] = favouriteToRemove;
            await remove(ref(database, `users/${user.uid}/favourites/${favouriteKey}`));
            setIsBookmarked(false);
            console.log('Removed from favourites');
          }
        }
      } else {
        // Add to favourites
        const favouriteData = {
          id: classData.id,
          title: classData.title,
          description: classData.description,
          category: classData.category,
          subscriberPrice: classData.subscriberPrice,
          imageUrl: classData.imageUrl || '',
          rating: classData.rating,
          instructorName: classData.instructorName,
          instructorId: classData.instructorId,
          date: classData.date,
          time: classData.time,
          location: classData.location,
          createdAt: new Date().toISOString(),
        };

        const favouritesRef = ref(database, `users/${user.uid}/favourites`);
        await push(favouritesRef, favouriteData);
        setIsBookmarked(true);
        console.log('Added to favourites');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    }
  };

  const handleConfirmPress = async () => {
    try {
      setBooking(true);
      const user = auth.currentUser;
      if (!user) {
        alert('You must be logged in to book a class.');
        setBooking(false);
        return;
      }

      if (!classData) {
        alert('Class data not available.');
        setBooking(false);
        return;
      }

      // Check seat availability before proceeding with booking
      const currentSeats = classData.availableSeats || classData.availability || 0;
      if (currentSeats <= 0) {
        alert('Sorry, no seats are available for this class.');
        setBooking(false);
        return;
      }

      // Create booking data
      const bookingData = {
        id: `booking_${Date.now()}`,
        classId: classData.id,
        classTitle: classData.title,
        classDescription: classData.description,
        classCategory: classData.category,
        classType: classData.classType,
        classDifficulty: classData.difficulty,
        classImage: classData.imageUrl,
        classDate: classData.date,
        classTime: classData.time,
        classLocation: classData.location,
        price: classData.subscriberPrice,
        totalPrice: `${getNumericPrice(classData.subscriberPrice) + 3}`,
        instructorId: classData.instructorId,
        instructorName: classData.instructorName,
        instructorImage: instructorData?.profileImage || '',
        studentId: user.uid,
        studentName: studentData?.fullName || user.displayName || 'Student',
        studentEmail: user.email || '',
        bookingDate: new Date().toISOString(),
        status: 'confirmed',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Save booking to user's bookings
      const userBookingsRef = ref(database, `users/${user.uid}/bookings`);
      const newBookingRef = push(userBookingsRef);
      await set(newBookingRef, bookingData);

      // Save booking to instructor's orders
      const instructorOrdersRef = ref(database, `users/${classData.instructorId}/orders`);
      const newOrderRef = push(instructorOrdersRef);
      await set(newOrderRef, bookingData);

      // Update class availability - decrement availableSeats in BOTH locations
      const globalClassRef = ref(database, `Listings/${classData.id}`);
      const userClassRef = ref(database, `users/${classData.instructorId}/Listings/${classData.userListingId || classData.id}`);
      
      const classSnapshot = await get(globalClassRef);
      if (classSnapshot.exists()) {
        const currentData = classSnapshot.val();
        const currentSeats = currentData.availableSeats || currentData.availability || 0;
        
        // Check if seats are available before booking
        if (currentSeats <= 0) {
          alert('Sorry, no seats are available for this class.');
          setBooking(false);
          return;
        }
        
        const newSeats = Math.max(0, currentSeats - 1);
        
        // Get current subscriber count and increment it
        const currentSubscribers = currentData.subscribers || 0;
        const newSubscribers = currentSubscribers + 1;
        
        // Update GLOBAL listings (for all users to see)
        await set(ref(database, `Listings/${classData.id}/availableSeats`), newSeats);
        await set(ref(database, `Listings/${classData.id}/availability`), newSeats);
        await set(ref(database, `Listings/${classData.id}/subscribers`), newSubscribers);
        
        // Update USER's personal listings (for instructor to see)
        await set(ref(database, `users/${classData.instructorId}/Listings/${classData.userListingId || classData.id}/availableSeats`), newSeats);
        await set(ref(database, `users/${classData.instructorId}/Listings/${classData.userListingId || classData.id}/availability`), newSeats);
        await set(ref(database, `users/${classData.instructorId}/Listings/${classData.userListingId || classData.id}/subscribers`), newSubscribers);
        
        console.log(`Booking created: Seats ${currentSeats} -> ${newSeats}, Subscribers ${currentSubscribers} -> ${newSubscribers} for class ${classData.id}`);
      } else {
        console.error('Class not found when trying to update seats');
        alert('Error updating class availability. Please try again.');
        setBooking(false);
        return;
      }

      alert('Booking confirmed successfully!');
      router.back();
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Failed to confirm booking. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  // Helper function to get numeric price value
  const getNumericPrice = (priceString: string) => {
    if (priceString.toLowerCase() === 'free' || priceString === 'Free') {
      return 0;
    }
    // Remove $ symbol and parse as number
    const cleanPrice = priceString.replace('$', '').replace('USD', '').trim();
    const numericPrice = parseInt(cleanPrice);
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  // Get category icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hip-hop':
        return require('@/assets/images/hipHop2.png');
      case 'ballet':
        return require('@/assets/images/ballet.png');
      case 'contemporary':
        return require('@/assets/images/contomeprorary.png');
      case 'jazz':
        return require('@/assets/images/jazz.png');
      case 'belly':
        return require('@/assets/images/salsa.png');
      case 'swing':
        return require('@/assets/images/swing.png');
      case 'modern':
        return require('@/assets/images/modern.png');
      case 'tap':
        return require('@/assets/images/tap.png');
      default:
        return require('@/assets/images/hipHop2.png');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A53C2" />
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!classData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Class not found</Text>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Image
            source={require('@/assets/images/chevron-left.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
        <Text style={styles.headerTitle}>Booking</Text>
        <View style={styles.bookmarkButton}>
          <Image 
            source={isBookmarked ? require('@/assets/images/bookmark.png') : require('@/assets/images/bookmarkunfilled.png')}
            style={styles.bookmarkIcon}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Class Details Card */}
        <View style={styles.classCard}>
          <Image 
            source={classData.imageUrl ? { uri: classData.imageUrl } : require('@/assets/images/streetcard.png')}
            style={styles.classImage}
            resizeMode="cover"
          />
          <View style={styles.classOverlay}>
            <Image 
              source={getCategoryIcon(classData.category)}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
            <Text style={styles.categoryText}>{classData.category}</Text>
          </View>
          <View style={styles.classInfo}>
            <View style={styles.titlePriceRow}>
              <Text style={styles.classTitle}>{classData.title}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {classData.subscriberPrice.toLowerCase() === 'free' ? '$0' : `${classData.subscriberPrice}`}
                </Text>
                <View style={styles.subscribersButton}>
                  <Text style={styles.subscribersText}>Subscribers</Text>
                </View>
              </View>
            </View>
            <Text style={styles.classDescription}>
              {getDescriptionText()}
            </Text>
            {shouldShowToggle() && (
              <Pressable onPress={handleDescriptionToggle} style={styles.showMoreContainer}>
                <Text style={styles.showMore}>
                  {isDescriptionExpanded ? 'Show less' : 'Show more'}
                </Text>
              </Pressable>
            )}
            <View style={styles.ratingDurationRow}>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{classData.rating.toFixed(1)}</Text>
                <View style={styles.stars}>
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} width={16} height={16} />
                  ))}
                </View>
              </View>
              <View style={styles.durationContainer}>
                <Image 
                  source={require('@/assets/images/clock.png')}
                  style={styles.durationIcon}
                  resizeMode="contain"
                />
                <Text style={styles.durationText}>60 min</Text>
              </View>
            </View>
            <View style={styles.instructorRow}>
              <Text style={styles.instructorLabel}>Instructor:</Text>
              <View style={styles.instructorContainer}>
                <ProfileAvatar
                  imageUrl={instructorData?.profileImage}
                  fullName={instructorData?.fullName || classData.instructorName}
                  size={24}
                  style={styles.instructorAvatar}
                />
                <Text style={styles.instructorName}>{instructorData?.fullName || classData.instructorName}</Text>
              </View>
            </View>
            <View style={styles.seatAvailabilityContainer}>
              <Image 
                source={require('@/assets/images/availability.png')}
                style={styles.seatIcon}
                resizeMode="contain"
              />
              <Text style={styles.seatAvailabilityText}>Seat Availability</Text>
              <Text style={styles.seatCount}>
                {classData.availableSeats || classData.availability || 0} available
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Policies Section */}
        {(classData.customTerms || classData.customRequirements || classData.customCancellation) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Policies</Text>
            <View style={styles.bookingCard}>
              {/* Terms and Conditions - Show if customTerms exists (regardless of termsEnabled for viewing) */}
              {classData.customTerms && (
                <>
                  <Pressable style={styles.bookingItem} onPress={() => termsSheetRef.current?.expand()}>
                    <Text style={styles.bookingItemText}>Terms and Conditions</Text>
                    {termsChecked && (
                      <Image 
                        source={require('@/assets/images/check.png')}
                        style={styles.checkmarkIcon}
                        resizeMode="contain"
                      />
                    )}
                  </Pressable>
                  {(classData.customRequirements || classData.customCancellation) && (
                    <LinearGradient
                      colors={['#F708F7', '#C708F7', '#F76B0B']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.bookingDivider}
                    />
                  )}
                </>
              )}
              
              {/* Guest Requirements - Always show if available */}
              {classData.customRequirements && (
                <>
                  <Pressable style={styles.bookingItem} onPress={() => requirementsSheetRef.current?.expand()}>
                    <Text style={styles.bookingItemText}>Guest requirements</Text>
                    {requirementsChecked && (
                      <Image 
                        source={require('@/assets/images/check.png')}
                        style={styles.checkmarkIcon}
                        resizeMode="contain"
                      />
                    )}
                  </Pressable>
                  {classData.customCancellation && (
                    <LinearGradient
                      colors={['#F708F7', '#C708F7', '#F76B0B']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.bookingDivider}
                    />
                  )}
                </>
              )}
              
              {/* Cancellation Policy - Always show if available */}
              {classData.customCancellation && (
                <Pressable style={styles.bookingItem} onPress={() => cancellationSheetRef.current?.expand()}>
                  <Text style={styles.bookingItemText}>Cancellation policy</Text>
                  {cancellationChecked && (
                    <Image 
                      source={require('@/assets/images/check.png')}
                      style={styles.checkmarkIcon}
                      resizeMode="contain"
                    />
                  )}
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* Schedule Section */}
        <View style={styles.section}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <Pressable>
              <GradientBackground style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
              </GradientBackground>
            </Pressable>
          </View>
          <View style={styles.scheduleCards}>
            <View style={styles.scheduleCard}>
              <Image 
                source={require('@/assets/images/emptyClock.png')}
                style={styles.scheduleIcon}
                resizeMode="contain"
              />
              <Text style={styles.scheduleText}>{classData.time}</Text>
            </View>
            <View style={styles.scheduleCard}>
              <Image 
                source={require('@/assets/images/emptyClock.png')}
                style={styles.scheduleIcon}
                resizeMode="contain"
              />
              <Text style={styles.scheduleText}>{classData.date}</Text>
            </View>
          </View>
        </View>

        {/* Pricing Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Details</Text>
          <View style={styles.pricingCard}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>
                {classData.subscriberPrice.toLowerCase() === 'free' ? '0 USD' : `${classData.subscriberPrice} USD`} x 1 class
              </Text>
              <Text style={styles.pricingValue}>
                {classData.subscriberPrice.toLowerCase() === 'free' ? '0 USD' : `${classData.subscriberPrice} USD`}
              </Text>
            </View>
            <View style={styles.pricingRow}>
              <View style={styles.pricingLabelContainer}>
                <Text style={styles.pricingLabel}>Service fee</Text>
                <Image 
                  source={require('@/assets/images/iinfo.png')}
                  style={styles.infoIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.pricingValue}>$2 USD</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Tax</Text>
              <Text style={styles.pricingValue}>$1 USD</Text>
            </View>
            <View style={styles.pricingRow}>
              <View style={styles.pricingLabelContainer}>
                <Text style={styles.creditValue}>Credits</Text>
                <Image 
                  source={require('@/assets/images/iinfo.png')}
                  style={styles.infoIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.pricingValue, styles.creditsValue]}>$5.0 ARD</Text>
            </View>
            <View style={styles.pricingDivider} />
            <View style={styles.pricingRow}>
              <Text style={styles.totalLabel}>Total USD</Text>
              <Text style={styles.totalValue}>${getNumericPrice(classData.subscriberPrice) + 3} USD</Text>
            </View>
          </View>
        </View>

        {/* Add Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add payment method</Text>
          <View style={styles.paymentMethods}>
            <View style={styles.paymentCard}>
              <Image 
                source={require('@/assets/images/credit-card.png')}
                style={styles.paymentIcon}
                resizeMode="contain"
              />
              <Text style={styles.paymentText}>Thu, Jul 6, 10:00</Text>
              <Pressable style={styles.addButton}>
                <Image 
                  source={require('@/assets/images/plusAddG.png')}
                  style={styles.addIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
            <View style={styles.paymentCard}>
              <Image 
                source={require('@/assets/images/debitCard.png')}
                style={styles.paymentIcon}
                resizeMode="contain"
              />
              <Text style={styles.paymentText}>Thu, Jul 6, 10:00</Text>
              <Pressable style={styles.addButton}>
                <Image 
                  source={require('@/assets/images/plusAddG.png')}
                  style={styles.addIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>
        </View>


        {/* Host Confirmation Section */}
        <View style={styles.section}>
          <View style={styles.confirmationCard}>
          <Text style={styles.sectionTitle}>Host Confirmation</Text>

            <Text style={styles.confirmationText}>
              • Your reservation won't be confirmed until the host accept your request (within 24 hours).
            </Text>
            <Text style={styles.confirmationText}>
              • You won't be charged until then.
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <Pressable 
          onPress={handleConfirmPress} 
          style={styles.confirmButtonContainer} 
          disabled={
            booking || 
            (classData && (classData.availableSeats || classData.availability || 0) <= 0) ||
            !areAllPoliciesAccepted()
          }
        >
          <GradientBackground style={[
            styles.confirmButton,
            ((classData && (classData.availableSeats || classData.availability || 0) <= 0) || !areAllPoliciesAccepted()) && styles.disabledConfirmButton
          ]}>
            {booking ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={[
                styles.confirmButtonText,
                ((classData && (classData.availableSeats || classData.availability || 0) <= 0) || !areAllPoliciesAccepted()) && styles.disabledConfirmButtonText
              ]}>
                {(classData && (classData.availableSeats || classData.availability || 0) <= 0) 
                  ? 'No seats available' 
                  : !areAllPoliciesAccepted()
                  ? 'Accept all policies to continue'
                  : 'Confirm'}
              </Text>
            )}
          </GradientBackground>
        </Pressable>
      </ScrollView>

      {/* Terms and Conditions Bottom Sheet */}
      {classData?.customTerms && (
        <BottomSheet
          ref={termsSheetRef}
          enableDynamicSizing={false}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
        >
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Terms and Conditions</Text>
              <Pressable style={styles.closeButton} onPress={() => termsSheetRef.current?.close()}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <BottomSheetScrollView 
              style={styles.bottomSheetScrollView}
              contentContainerStyle={styles.bottomSheetContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.bottomSheetText}>{classData?.customTerms}</Text>
              <View style={styles.bottomSheetFooter}>
              <Pressable 
                style={styles.checkboxContainer} 
                onPress={() => setTermsChecked(!termsChecked)}
              >
                <View style={[styles.checkbox, termsChecked && styles.checkboxChecked]}>
                  {termsChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>I have read and agree to the Terms and Conditions</Text>
              </Pressable>
              <Pressable style={styles.doneButton} onPress={() => termsSheetRef.current?.close()}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.doneButtonGradient}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
            </BottomSheetScrollView>
           
          </View>
        </BottomSheet>
      )}

      {/* Guest Requirements Bottom Sheet */}
      {classData?.customRequirements && (
        <BottomSheet
          ref={requirementsSheetRef}
          enableDynamicSizing={false}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
        >
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>Guest Requirements</Text>
              <Pressable style={styles.closeButton} onPress={() => requirementsSheetRef.current?.close()}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <BottomSheetScrollView 
              style={styles.bottomSheetScrollView}
              contentContainerStyle={styles.bottomSheetContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.bottomSheetText}>
                {Array.isArray(classData?.customRequirements) 
                  ? classData.customRequirements.map((req: string, index: number) => `• ${req}`).join('\n')
                  : classData?.customRequirements}
              </Text>
              <View style={styles.bottomSheetFooter}>
              <Pressable 
                style={styles.checkboxContainer} 
                onPress={() => setRequirementsChecked(!requirementsChecked)}
              >
                <View style={[styles.checkbox, requirementsChecked && styles.checkboxChecked]}>
                  {requirementsChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>I have read and understand the Guest Requirements</Text>
              </Pressable>
              <Pressable style={styles.doneButton} onPress={() => requirementsSheetRef.current?.close()}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.doneButtonGradient}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
            </BottomSheetScrollView>
          
          </View>
        </BottomSheet>
      )}

      {/* Cancellation Policy Bottom Sheet */}
      {classData?.customCancellation && (
        <BottomSheet
          ref={cancellationSheetRef}
          enableDynamicSizing={false}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
        >
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>
                {classData?.cancellationPolicyHeading || 'Cancellation Policy'}
              </Text>
              <Pressable style={styles.closeButton} onPress={() => cancellationSheetRef.current?.close()}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <BottomSheetScrollView 
              style={styles.bottomSheetScrollView}
              contentContainerStyle={styles.bottomSheetContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.bottomSheetText}>{classData?.customCancellation}</Text>
              <View style={styles.bottomSheetFooter}>
              <Pressable 
                style={styles.checkboxContainer} 
                onPress={() => setCancellationChecked(!cancellationChecked)}
              >
                <View style={[styles.checkbox, cancellationChecked && styles.checkboxChecked]}>
                  {cancellationChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>I have read and agree to the Cancellation Policy</Text>
              </Pressable>
              <Pressable style={styles.doneButton} onPress={() => cancellationSheetRef.current?.close()}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.doneButtonGradient}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
            </BottomSheetScrollView>
            
          </View>
        </BottomSheet>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:-40,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  bookmarkButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  classImage: {
    width: '100%',
    height: 200,
  },
  classOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 121, 121, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  classInfo: {
    padding: 16,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  classTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
  },
  classDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 20,
  },
  ratingDurationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  subscribersButton: {
    backgroundColor: 'rgb(128, 139, 149,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  subscribersText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#222222',
  },
  instructorLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#808B95',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationIcon: {
    width: 20,
    height: 20,
  },
  durationText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 12,
  },
  instructorName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  seatAvailabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatIcon: {
    width: 20,
    height: 20,
  },
  seatAvailabilityText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#808B95',
  },
  seatCount: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
    marginLeft: 'auto',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom:20,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleCards: {
    gap: 8,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  scheduleIcon: {
    width: 20,
    height:20,
  },
  scheduleText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  changeButton: {
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  changeButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pricingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pricingLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  creditValue:{
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#28A745',
  },
  pricingValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  creditsValue: {
    color: '#28A745',
  },
  infoIcon: {
    width: 10,
    height: 10,
    right:5,
    bottom:5,
  },
  pricingDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  paymentMethods: {
    gap: 8,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  paymentIcon: {
    width: 24,
    height: 24,
  },
  paymentText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    flex: 1,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 24,
    height: 24,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    marginTop: 8,
  },
  bookingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  bookingItemText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
    flex: 1,
  },
  checkmarkIcon: {
    width: 20,
    height: 20,
    marginLeft: 12,
  },
  bookingDivider: {
    height: 1,
  marginHorizontal:20,
  },
  // Bottom Sheet styles
  bottomSheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#CCCCCC',
    width: 40,
  },
  bottomSheetContainer: {
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#E0E0E0',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666666',
  },
  bottomSheetScrollView: {
  },
  bottomSheetContent: {
    padding: 20,
    paddingBottom:100,
  },
  bottomSheetText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
    lineHeight: 22,
  },
  bottomSheetFooter: {
    paddingHorizontal: 20,
    marginTop:20,
    paddingVertical: 16,
    borderTopColor: '#E0E0E0',
    borderTopWidth: 1,
    gap: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    borderColor: '#8A53C2',
    backgroundColor: '#8A53C2',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
    flex: 1,
  },
  doneButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  learnMoreText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#F708F7',
  },
  confirmationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  confirmationText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 4,
  },
  confirmButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  confirmButton: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  disabledConfirmButton: {
    backgroundColor: '#CCCCCC',
  },
  disabledConfirmButtonText: {
    color: '#FFFFFF ',
  },
  // Loading and error states
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#8A53C2',
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
