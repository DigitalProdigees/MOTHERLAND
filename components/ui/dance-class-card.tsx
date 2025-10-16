import Star from '@/assets/svg/Star';
import { Fonts } from '@/constants/theme';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface DanceClassCardProps {
  title: string;
  price: string;
  instructor: string;
  rating: string;
  students: string;
  description: string;
  imageUrl?: string;
  status?: string;
  statusIcon?: string;
  duration?: string;
  seatAvailability?: string;
  onPress?: () => void;
}

const DanceClassCard: React.FC<DanceClassCardProps> = ({
  title,
  price,
  instructor,
  rating,
  students,
  description,
  imageUrl,
  status,
  statusIcon,
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
      {/* Left Image Section */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('@/assets/svg/cardimage.png')}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Rating below image */}
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{rating}</Text>
          <View style={styles.stars}>
            {[...Array(5)].map((_, index) => (
              <Star key={index} width={18} height={18} />
            ))}
          </View>
        </View>
        
        {/* Status text */}
        <Text style={styles.statusLabel}>Status</Text>
      </View>

      {/* Right Content Section */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        
        {/* Price and Subscribers Row */}
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price:</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
            <Text style={styles.priceValue}>{price}</Text>
          <View style={styles.subscribersContainer}>
            <Text style={styles.subscribersText}>Subscribers</Text>
          </View>
           </View>
        </View>

        {/* Instructor Row */}
        <View style={styles.instructorRow}>
          <Text style={styles.instructorLabel}>Instructor:</Text>
          <View style={styles.instructorInfo}>
            <Image 
              source={require('@/assets/images/instructor.png')}
              style={styles.instructorIcon}
            />
            <Text style={styles.instructor}>{instructor}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        {/* Bottom Stats Row */}
        <View style={styles.statsRow}>
          {/* Students */}
          <View style={styles.studentsContainer}>
            <Image 
              source={require('@/assets/svg/user.png')}
              style={styles.userIcon}
            />
            <Text style={styles.students}>{students}</Text>
          </View>
        </View>

        {/* Trending Status */}
        {status && (
          <View style={styles.trendingContainer}>
            <Image 
              source={require('@/assets/images/fire.png')}
              style={styles.fireIcon}
            />
            <Text style={styles.trendingText}>{status}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  imageContainer: {
    width: 101,
    height: 138,
  },
  image: {
    width: 101,
    height: 138,
  
  },
  content: {
    flex: 1,
    position: 'relative',
    marginLeft: 16,
    
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 8,
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    marginRight: 4,
  },
  priceValue: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  subscribersContainer: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 6,
  },
  subscribersText: {
    fontSize: 11,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  instructorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructorLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  instructorIcon: {
    width: 20,
    height: 20,
  },
  instructor: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  description: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 16,
    marginBottom: 8,
  },
  statsRow: {
  
   alignSelf:'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  rating: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  statusLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#808B95',
    marginTop: 27
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  studentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  userIcon: {
    width: 25 ,
    height: 25,
  },
  students: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  trendingContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    width:'55%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'flex-end',
    gap: 4,
  },
  trendingText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#000000',
  },
  fireIcon: {
    marginRight: 4,
    width: 20,
    height: 20,
  },
});

export default DanceClassCard;

