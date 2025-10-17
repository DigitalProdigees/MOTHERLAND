import Star from '@/assets/svg/Star';
import { Fonts } from '@/constants/theme';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface StreetDanceCardProps {
  title: string;
  price: string;
  instructor: string;
  rating: string;
  students: string;
  description: string;
  duration: string;
  seatAvailability: string;
  onPress?: () => void;
}

const StreetDanceCard: React.FC<StreetDanceCardProps> = ({
  title,
  price,
  instructor,
  rating,
  students,
  description,
  duration,
  seatAvailability,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.95 : 1 }
      ]}
      onPress={onPress}
    >
      {/* Main Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('@/assets/images/streetcard.png')}
          style={styles.mainImage}
          resizeMode="cover"
        />
        
        {/* Hip-Hop Tag */}
        <View style={styles.hipHopTag}>
          <Image 
            source={require('@/assets/images/hipHop.png')}
            style={styles.hipHopIcon}
          />
          <Text style={styles.hipHopText}>Hip-Hop</Text>
        </View>
      </View>

      {/* Bottom Content Section */}
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.priceSubscriberRow}>
            <Text style={styles.price}>{price}</Text>
            <View style={styles.subscribersButton}>
              <Text style={styles.subscribersText}>Subscribers</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.readMore}>Read more...</Text>

        {/* Rating and Duration Row */}
        <View style={styles.ratingDurationRow}>
          <View style={styles.ratingSection}>
            <Text style={styles.rating}>{rating}</Text>
            <View style={styles.stars}>
              {[...Array(5)].map((_, index) => (
                <Star key={index} width={16} height={16} />
              ))}
            </View>
          </View>

          {/* Duration Section */}
          <View style={styles.durationSection}>
            <Image 
              source={require('@/assets/images/clock.png')}
              style={styles.clockIcon}
            />
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>

        {/* Instructor Row */}
        <View style={styles.instructorRow}>
          <Text style={styles.instructorLabel}>Instructor:</Text>
          <View style={styles.instructorInfo}>
            <Image 
              source={require('@/assets/images/instructor.png')}
              style={styles.instructorAvatar}
            />
            <Text style={styles.instructor}>{instructor}</Text>
          </View>
        </View>

        {/* Seat Availability */}
        <View style={styles.seatAvailabilitySection}>
          <Image 
            source={require('@/assets/images/availability.png')}
            style={styles.seatIcon}
          />
          <Text style={styles.seatAvailabilityText}>{seatAvailability}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  hipHopTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(81, 89, 97, 0.64)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hipHopIcon: {
    width: 30,
    height: 30,
  },
  hipHopText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
    marginRight: 12,
  },
  priceSubscriberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  subscribersButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  subscribersText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#666666',
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 4,
  },
  readMore: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#999999',
    marginBottom: 12,
  },
  ratingDurationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  durationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clockIcon: {
    width: 20,
    height: 20,
  },
  duration: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  instructorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  instructor: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  seatAvailabilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatIcon: {
    width: 26,
    height: 26,
  },
  seatAvailabilityText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
});

export default StreetDanceCard;
