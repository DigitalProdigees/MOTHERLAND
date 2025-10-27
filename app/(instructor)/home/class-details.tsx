import Star from '@/assets/svg/Star';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { get, onValue, ref } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
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
}

interface ReviewData {
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


export default function ClassDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [seatsAvailable, setSeatsAvailable] = useState(true);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  // Fetch class data from database with real-time listener
  const fetchClassData = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        console.error('User not authenticated');
        router.back();
        return;
      }

      // First try to find in instructor's personal listings
      const userListingsRef = ref(database, `users/${user.uid}/Listings/${id}`);
      const userDraftRef = ref(database, `users/${user.uid}/draftListing/${id}`);
      
      // Check personal listings first
      const userListingsSnapshot = await get(userListingsRef);
      const userDraftSnapshot = await get(userDraftRef);
      
      let classData = null;
      let sourceRef = null;
      
      if (userListingsSnapshot.exists()) {
        classData = userListingsSnapshot.val();
        sourceRef = userListingsRef;
        console.log('Found class in personal listings');
      } else if (userDraftSnapshot.exists()) {
        classData = userDraftSnapshot.val();
        sourceRef = userDraftRef;
        console.log('Found class in draft listings');
      } else {
        // Fall back to global listings
        const globalRef = ref(database, `Listings/${id}`);
        const globalSnapshot = await get(globalRef);
        
        if (globalSnapshot.exists()) {
          classData = globalSnapshot.val();
          sourceRef = globalRef;
          console.log('Found class in global listings');
        }
      }
      
      if (classData && sourceRef) {
        const classDataWithId = {
          id: id as string,
          ...classData
        };
        setClassData(classDataWithId);
        
        // Check if seats are available
        const availableSeats = classData.availableSeats || classData.availability || 0;
        setSeatsAvailable(availableSeats > 0);
        
        console.log(`Class ${id} found with ${availableSeats} seats available`);
        
        
        // Set up real-time listener for the found class
        const unsubscribe = onValue(sourceRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const updatedClassData = {
              id: id as string,
              ...data
            };
            setClassData(updatedClassData);
            
            const availableSeats = data.availableSeats || data.availability || 0;
            setSeatsAvailable(availableSeats > 0);
            
            console.log(`Real-time update: Class ${id} now has ${availableSeats} seats available`);
          }
        }, (error) => {
          console.error('Real-time listener error:', error);
        });
        
        return unsubscribe;
      } else {
        console.error('Class not found in any location');
        router.back();
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time reviews listener
  const setupReviewsListener = (classId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        setReviews([]);
        return null;
      }

      console.log(`Setting up real-time reviews listener for classId: ${classId}`);

      // First try to listen to global reviews (where they are actually saved)
      const globalReviewsRef = ref(database, `reviews/${classId}`);
      console.log(`Listening to global reviews at: reviews/${classId}`);
      
      const unsubscribeGlobal = onValue(globalReviewsRef, (snapshot) => {
        if (snapshot.exists()) {
          const reviewsData = snapshot.val();
          console.log('Real-time global reviews update:', reviewsData);
          const reviewsArray = Object.entries(reviewsData).map(([reviewId, review]: [string, any]) => ({
            id: reviewId,
            ...review,
          }));
          
          // Sort by creation date (most recent first)
          const sortedReviews = reviewsArray.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          setReviews(sortedReviews);
          console.log(`Real-time update: Found ${sortedReviews.length} reviews in global listings`);
        } else {
          console.log('No global reviews found, checking instructor reviews...');
          
          // Fallback to instructor's personal listings if no global reviews
          const instructorReviewsRef = ref(database, `users/${user.uid}/Listings/${classId}/reviews`);
          const unsubscribeInstructor = onValue(instructorReviewsRef, (instructorSnapshot) => {
            if (instructorSnapshot.exists()) {
              const reviewsData = instructorSnapshot.val();
              console.log('Real-time instructor reviews update:', reviewsData);
              const reviewsArray = Object.entries(reviewsData).map(([reviewId, review]: [string, any]) => ({
                id: reviewId,
                ...review,
              }));
              
              // Sort by creation date (most recent first)
              const sortedReviews = reviewsArray.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              
              setReviews(sortedReviews);
              console.log(`Real-time update: Found ${sortedReviews.length} reviews in instructor's personal listings`);
            } else {
              setReviews([]);
              console.log('Real-time update: No reviews found in either location');
            }
          }, (error) => {
            console.error('Real-time instructor reviews listener error:', error);
            setReviews([]);
          });
          
          return unsubscribeInstructor;
        }
      }, (error) => {
        console.error('Real-time global reviews listener error:', error);
        setReviews([]);
      });
      
      return unsubscribeGlobal;
    } catch (error) {
      console.error('Error setting up reviews listener:', error);
      setReviews([]);
      return null;
    }
  };

  useEffect(() => {
    let unsubscribeClass: (() => void) | undefined;
    let unsubscribeReviews: (() => void) | undefined;
    
    if (id) {
      fetchClassData().then((unsub) => {
        if (unsub) {
          unsubscribeClass = unsub;
        }
      });
      
      // Set up real-time reviews listener
      const reviewsUnsubscribe = setupReviewsListener(id as string);
      if (reviewsUnsubscribe) {
        unsubscribeReviews = reviewsUnsubscribe;
      }
    }
    
    // Cleanup listeners on unmount
    return () => {
      if (unsubscribeClass) {
        unsubscribeClass();
      }
      if (unsubscribeReviews) {
        unsubscribeReviews();
      }
    };
  }, [id]);

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
      case 'salsa':
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

  const carouselImages = classData ? [
    classData.imageUrl ? { uri: classData.imageUrl } : require('@/assets/images/streetcard.png'),
    require('@/assets/images/carousal1.png'),
    require('@/assets/images/carousal2.png'),
    require('@/assets/images/carousal3.png'),
  ] : [
    require('@/assets/images/streetcard.png'),
    require('@/assets/images/carousal1.png'),
    require('@/assets/images/carousal2.png'),
    require('@/assets/images/carousal3.png'),
  ];

  const handleBackPress = () => {
    router.back();
  };


  const handleDotPress = (index: number) => {
    setCurrentImageIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A53C2" />
          <Text style={styles.loadingText}>Loading class details...</Text>
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
        <Text style={styles.headerTitle}>Class Details</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            style={styles.carouselScrollView}
          >
            {carouselImages.map((image, index) => (
              <Image 
                key={index}
                source={image}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {/* Carousel Dots */}
          <View style={styles.carouselDots}>
            {carouselImages.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => handleDotPress(index)}
                style={[
                  styles.dot,
                  index === currentImageIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Class Overview */}
        <View style={styles.classOverview}>
          {/* Category Tag */}
          <View style={styles.categoryTag}>
            <Image 
              source={getCategoryIcon(classData.category)}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
            <Text style={styles.categoryText}>{classData.category}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{classData.title}</Text>

          {/* Rating and Location */}
          <View style={styles.ratingLocationRow}>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{classData.rating.toFixed(1)}</Text>
              <View style={styles.stars}>
                {[...Array(5)].map((_, index) => {
                  const isFilled = index < Math.floor(classData.rating);
                  const isHalfFilled = index === Math.floor(classData.rating) && classData.rating % 1 >= 0.5;
                  return (
                    <Star 
                      key={index} 
                      width={20} 
                      height={20} 
                      filled={isFilled || isHalfFilled}
                      color="#8A53C2"
                    />
                  );
                })}
              </View>
            </View>
            <View style={styles.locationTag}>
              <Image 
                source={require('@/assets/images/pin.png')}
                style={styles.locationIcon}
                resizeMode="contain"
              />
              <Text style={styles.locationText}>{classData.location}</Text>
            </View>
          </View>
        </View>

        {/* Schedule Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.scheduleList}>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/calender.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.date}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/location.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.location}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/niche.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.instructorName}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/weather.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.classType}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/time.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.time}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/availability.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>
                {seatsAvailable 
                  ? `${classData.availableSeats || classData.availability || 0} seats available`
                  : 'All seats booked'
                }
              </Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{getDescriptionText()}</Text>
          {shouldShowToggle() && (
            <Pressable onPress={handleDescriptionToggle} style={styles.showMoreContainer}>
              <Text style={styles.showMore}>
                {isDescriptionExpanded ? 'Show less' : 'Show more'}
              </Text>
            </Pressable>
          )}
        </View>


        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <View style={styles.reviewsRating}>
              <Text style={styles.reviewsRatingText}>{classData.rating.toFixed(1)}</Text>
              {reviews.length > 0 ? (
                <View style={styles.reviewsStars}>
                  {[...Array(5)].map((_, index) => {
                    const isFilled = index < Math.floor(classData.rating);
                    const isHalfFilled = index === Math.floor(classData.rating) && classData.rating % 1 >= 0.5;
                    return (
                      <Star 
                        key={index} 
                        width={20} 
                        height={20} 
                        filled={isFilled || isHalfFilled}
                        color="#8A53C2"
                      />
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.noReviewsHeaderText}>No reviews</Text>
              )}
            </View>
            <Text style={styles.reviewsCount}>
              {reviews.length > 0 ? `(${reviews.length})` : '(No reviews yet)'}
            </Text>
          </View>
          
          {reviews.length === 0 ? (
            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsText}>No reviews yet. Students will see reviews here once they book and review your class!</Text>
            </View>
          ) : (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewsList}
            >
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                      <Image 
                        source={require('@/assets/images/annie-bens.png')}
                        style={styles.reviewAvatar}
                      />
                      <View style={styles.reviewUserDetails}>
                        <View style={styles.reviewNameDateRow}>
                          <Text style={styles.reviewUserName}>{review.userName}</Text>
                          <Text style={styles.reviewDate}>
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Text>
                        </View>
                        <View style={styles.reviewRatingContainer}>
                          <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
                          <Star 
                            width={20} 
                            height={20} 
                            filled={true}
                            color="#8A53C2"
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.description}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: -40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
    textAlign: 'center',
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
  scrollView: {
    flex: 1,
  },
  carouselContainer: {
    position: 'relative',
    height: 250,
  },
  carouselScrollView: {
    height: '100%',
  },
  carouselImage: {
    width: width,
    height: '100%',
  },
  carouselDots: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    backgroundColor: 'transparent',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
  },
  classOverview: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderWidth: 0.2,
    borderColor: '#009F93',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#222222',
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 12,
  },
  ratingLocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 83, 194, 0.03)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  
    gap: 4,
    bottom:10,

  },
  locationIcon: {
    width: 18,
    height: 18,
  },
  locationText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#8B5CF6',
  },
  section: {
    paddingHorizontal: 20,
    marginTop:20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 16,
  },
  scheduleList: {
    gap: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleIcon: {
    width: 30,
    height: 30,
  },
  scheduleText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 20,
  },
  underlinedText: {
    textDecorationLine: 'underline',
    color: '#0066CC',
  },
  showMoreContainer: {
    alignSelf: 'flex-start',
  },
  showMore: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#8A53C2',
    textDecorationLine: 'underline',
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent:'space-between',
    gap: 12,
  },
  reviewsRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewsRatingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  reviewsStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewsCount: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  reviewsScroll: {
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: width * 0.8,
    minHeight: 120,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  reviewDate: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRatingText: {
    fontSize: 17,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  reviewComment: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 16,
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
  noReviewsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noReviewsText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
  },
  noReviewsHeaderText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  reviewsList: {
    flexDirection: 'row',
    paddingBottom: 30,
    gap: 12,
  },
  
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
 
  reviewUserDetails: {
    flex: 1,
  },
  reviewNameDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewUserName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  reviewRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  
});
