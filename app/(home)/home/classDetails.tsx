import Star from '@/assets/svg/Star';
import GradientBackground from '@/components/ui/gradient-background';
import { Fonts } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
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

export default function ClassDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const classData = {
    id: id as string,
    title: 'Private Reiki Sessions',
    category: 'Hip-Hop',
    rating: '5.0',
    location: 'Onsite',
    schedule: {
      date: 'Jun 11, 2023 - Jun 11, 2023',
      venue: 'Motherland Jams Belly Dance',
      instructor: 'Abigail Dunn',
      day: 'Sun',
      time: '3:30pm - 4:30pm',
    },
    description: 'An opulent odyssey aboard the Azimut 70-foot Flybridge yacht, where luxury meets the azure waters of Miami. This exclusive experience includes captain, crew, marina fees, taxes, fuel, water, ice. Tips for captain and crew are NOT included.',
    instructor: {
      name: 'Annie Bens',
      avatar: require('@/assets/images/annie-bens.png'),
      joinedYear: '2018',
      rating: '4.9',
      experience: '3 Years Experience',
      bio: 'Annie Bens is a dedicated concierge specializing in curating unforgettable experiences, covering travel, dining, or entertainment.',
    },
    reviews: {
      overallRating: '4.9',
      totalReviews: '100',
      reviews: [
        {
          id: 1,
          name: 'Jeffery Bills',
          avatar: require('@/assets/images/annie-bens.png'),
          date: '21 July, 2023',
          rating: '4.9',
          comment: 'Perfect services as always. Very attentive to our needs. Surprises us everytime!',
        },
        {
          id: 2,
          name: 'Jeffer',
          avatar: require('@/assets/images/annie-bens.png'),
          date: '21 July, 2023',
          rating: '4.9',
          comment: 'Perfect services as our needs. Surprise',
        },
      ],
    },
    price: '$0/day',
    subscriptionStatus: 'Non Subscribed',
  };

  const carouselImages = [
    require('@/assets/images/streetcard.png'),
    require('@/assets/images/carousal1.png'),
    require('@/assets/images/carousal2.png'),
    require('@/assets/images/carousal3.png'),
    require('@/assets/images/annie-bens.png'),
    require('@/assets/images/availability.png'),
    require('@/assets/images/bookmark.png'),
  ];

  const handleBackPress = () => {
    router.back();
  };

  const handleBookPress = () => {
    router.push('/home/class-booking');
  };

  const handleDotPress = (index: number) => {
    setCurrentImageIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleBioToggle = () => {
    setIsBioExpanded(!isBioExpanded);
  };

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
        <Pressable style={styles.bookmarkButton}>
          <Image 
            source={require('@/assets/images/bookmark.png')}
            style={styles.bookmarkIcon}
            resizeMode="contain"
          />
        </Pressable>
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
              source={require('@/assets/images/hipHop2.png')}
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
              <Text style={styles.rating}>{classData.rating}</Text>
              <View style={styles.stars}>
                {[...Array(5)].map((_, index) => (
                  <Star key={index} width={16} height={16} />
                ))}
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
              <Text style={styles.scheduleText}>{classData.schedule.date}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/location.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.schedule.venue}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/niche.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.schedule.instructor}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/weather.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.schedule.day}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/time.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.schedule.time}</Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{classData.description}</Text>
        </View>

        {/* Instructor Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructor details</Text>
          <View style={styles.instructorCard}>
            <View style={styles.instructorHeader}>
              <Image 
                source={classData.instructor.avatar}
                style={styles.instructorAvatar}
              />
              <View style={styles.instructorInfo}>
                <View style={styles.instructorNameRow}>
                  <View style={styles.nameAndVerification}>
                    <Text style={styles.instructorName}>{classData.instructor.name}</Text>
                    <Image 
                      source={require('@/assets/images/verify.png')}
                      style={styles.verifiedIcon}
                    />
                  </View>
                  <Pressable style={styles.chatButton}>
                    <Image 
                      source={require('@/assets/images/message.png')}
                      style={styles.chatIcon}
                    />
                  </Pressable>
                </View>
                <View style={styles.instructorDetails}>
                  <Image 
                    source={require('@/assets/images/calendar.png')}
                    style={styles.instructorDetailIcon}
                  />
                  <Text style={styles.instructorDetailText}>Joined in {classData.instructor.joinedYear}</Text>
                  <View style={styles.instructorRating}>
                    <Text style={styles.instructorRatingText}>{classData.instructor.rating}</Text>
                    <Star width={16} height={16} />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.instructorSkills}>
              <View style={styles.skillItem}>
                <Image 
                  source={require('@/assets/images/menu-board.png')}
                  style={styles.skillIcon}
                />
                <Text style={styles.skillText}>Hip-Hop</Text>
              </View>
              <View style={styles.skillItem}>
                <Image 
                  source={require('@/assets/images/availability.png')}
                  style={styles.skillIcon}
                />
                <Text style={styles.skillText}>{classData.instructor.experience}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.instructorBio}>
                I'm Annie Bens, your dedicated concierge. I specialize in curating unforgettable experiences just for you. Whether it's travel, dining, or entertainment, I'm your gateway to luxury and leisure. Let's elevate your lifestyle together, where exceptional service meets your desires.
                {isBioExpanded && (
                  <Text>
                  With over 5 years of experience in the hospitality industry, I've helped hundreds of clients create memorable moments that last a lifetime. My expertise spans across luxury travel planning, exclusive dining reservations, and personalized entertainment experiences. I believe that every client deserves nothing but the best, and I'm committed to delivering excellence in every interaction.{'\n\n'}My approach is simple yet effective: I listen to your needs, understand your preferences, and craft bespoke experiences that exceed your expectations. From intimate dinner parties to grand celebrations, from weekend getaways to month-long adventures, I handle every detail with precision and care.{'\n\n'}When you work with me, you're not just getting a service – you're gaining a trusted partner who will go above and beyond to make your dreams a reality. Let's create something extraordinary together.
                  </Text>
                )}
              </Text>
              <Pressable onPress={handleBioToggle} style={styles.showMoreContainer}>
                <Text style={styles.showMore}>
                  {isBioExpanded ? 'Show less' : 'Show more'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <View style={styles.reviewsRating}>
              <Text style={styles.reviewsRatingText}>{classData.reviews.overallRating}</Text>
              <View style={styles.reviewsStars}>
                {[...Array(5)].map((_, index) => (
                  <Star key={index} width={16} height={16} />
                ))}
              </View>
            </View>
            <Text style={styles.reviewsCount}>({classData.reviews.totalReviews} Reviews)</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewsScroll}>
            {classData.reviews.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image 
                    source={review.avatar}
                    style={styles.reviewAvatar}
                  />
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewName}>{review.name}</Text>
                    <View style={{flexDirection:'row', alignItems:'center', gap: 4}}>
                    <Text style={styles.reviewDate}>{review.rating}</Text>
                    <Star width={16} height={16} /></View>
                  </View>
                  <View style={styles.reviewRating}>
                    <Text style={styles.reviewRatingText}>{review.date}</Text>
                    
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Bar Section - Now inside ScrollView */}
        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{classData.price}</Text>
            <Text style={styles.subscriptionStatus}>{classData.subscriptionStatus}</Text>
          </View>
          <Pressable onPress={handleBookPress}>
            <GradientBackground style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book</Text>
            </GradientBackground>
          </Pressable>
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
    bottom:20,

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
  instructorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom:20,
  },
  instructorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  instructorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameAndVerification: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginRight: 8,
  },
  verifiedIcon: {
    width: 20,
    height: 20,
  },
  instructorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructorDetailIcon: {
    width: 16,
    height: 16,
  },
  instructorDetailText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    flex: 1,
  },
  instructorSkills: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  skillIcon: {
    width: 20,
    height: 20,
  },
  skillText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    width: 40,
    height: 40,
    
  },
  instructorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instructorRatingText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  instructorBio: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#808B95',
    lineHeight: 20,
  },
  underlinedText: {
    textDecorationLine: 'underline',
    color: '#0066CC',
  },
  showMoreContainer: {
  },
  showMore: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#222222',
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
    marginRight: 12,
    width: width * 0.7,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
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
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  reviewComment: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
  },
  priceContainer: {
    flex: 1,
    flexDirection:'row',
    alignItems:'center',
  },
  price: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 4,
  },
  subscriptionStatus: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    marginLeft: 8,
  },
  bookButton: {
    borderRadius: 25,
    paddingHorizontal: 28,
    paddingVertical: 15,
  },
  bookButtonText: {
    fontSize: 16,
fontWeight:'bold',
    color: '#FFFFFF',
  },
});
