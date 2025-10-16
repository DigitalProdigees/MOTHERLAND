import Back from '@/assets/svg/Back';
import Star from '@/assets/svg/Star';
import { Fonts } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
    price: '$10/day',
    subscriptionStatus: 'Non Subscribed',
  };

  const carouselImages = [
    require('@/assets/images/carousal1.png'),
    require('@/assets/images/carousal2.png'),
    require('@/assets/images/carousal3.png'),
  ];

  const handleBackPress = () => {
    router.back();
  };

  const handleBookPress = () => {
    console.log('Book pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Back width={24} height={24} color="#8B5CF6" />
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
          <Image 
            source={carouselImages[currentImageIndex]}
            style={styles.carouselImage}
            resizeMode="cover"
          />
          {/* Carousel Dots */}
          <View style={styles.carouselDots}>
            {carouselImages.map((_, index) => (
              <View
                key={index}
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
              source={require('@/assets/images/hipHop.png')}
              style={styles.categoryIcon}
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
                source={require('@/assets/images/instructor.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.schedule.instructor}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/calender.png')}
                style={styles.scheduleIcon}
              />
              <Text style={styles.scheduleText}>{classData.schedule.day}</Text>
            </View>
            <View style={styles.scheduleItem}>
              <Image 
                source={require('@/assets/images/clock.png')}
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
                  <Text style={styles.instructorName}>{classData.instructor.name}</Text>
                  <Image 
                    source={require('@/assets/images/availability.png')}
                    style={styles.verifiedIcon}
                  />
                </View>
                <View style={styles.instructorDetails}>
                  <Image 
                    source={require('@/assets/images/calender.png')}
                    style={styles.instructorDetailIcon}
                  />
                  <Text style={styles.instructorDetailText}>Joined in {classData.instructor.joinedYear}</Text>
                </View>
                <View style={styles.instructorDetails}>
                  <Image 
                    source={require('@/assets/images/instructor.png')}
                    style={styles.instructorDetailIcon}
                  />
                  <Text style={styles.instructorDetailText}>{classData.instructor.experience}</Text>
                </View>
              </View>
              <View style={styles.instructorActions}>
                <Pressable style={styles.chatButton}>
                  <Image 
                    source={require('@/assets/images/message.png')}
                    style={styles.chatIcon}
                  />
                </Pressable>
                <View style={styles.instructorRating}>
                  <Text style={styles.instructorRatingText}>{classData.instructor.rating}</Text>
                  <Star width={12} height={12} />
                </View>
              </View>
            </View>
            <Text style={styles.instructorBio}>{classData.instructor.bio}</Text>
            <Text style={styles.showMore}>Show more</Text>
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
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <View style={styles.reviewRating}>
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    <Star width={12} height={12} />
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Spacing for Fixed Bottom Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{classData.price}</Text>
          <Text style={styles.subscriptionStatus}>{classData.subscriptionStatus}</Text>
        </View>
        <Pressable style={styles.bookButton} onPress={handleBookPress}>
          <Text style={styles.bookButtonText}>Book</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollView: {
    flex: 1,
  },
  carouselContainer: {
    position: 'relative',
    height: 250,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselDots: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  activeDot: {
    width: 12,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
  },
  classOverview: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
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
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  locationIcon: {
    width: 12,
    height: 12,
  },
  locationText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#8B5CF6',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
    width: 16,
    height: 16,
  },
  scheduleText: {
    fontSize: 14,
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
  },
  instructorHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginRight: 8,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
  },
  instructorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  instructorDetailIcon: {
    width: 14,
    height: 14,
  },
  instructorDetailText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  instructorActions: {
    alignItems: 'flex-end',
  },
  chatButton: {
    padding: 8,
    marginBottom: 8,
  },
  chatIcon: {
    width: 20,
    height: 20,
  },
  instructorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  instructorRatingText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  instructorBio: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 16,
    marginBottom: 8,
  },
  showMore: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#8B5CF6',
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: width * 0.7,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  reviewDate: {
    fontSize: 12,
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
  bottomSpacing: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  priceContainer: {
    flex: 1,
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
  },
  bookButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});
