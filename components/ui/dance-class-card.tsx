import StarRating from '@/assets/svg/StarRating';
import { Fonts } from '@/constants/theme';
import React, { useState } from 'react';
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
  category?: string;
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
  category,
  onPress,
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Function to truncate text to first 10 words
  const truncateText = (text: string, wordLimit: number = 10) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // Function to get the display text for description
  const getDescriptionText = () => {
    if (isDescriptionExpanded) {
      return description;
    }
    return truncateText(description, 10);
  };

  // Function to check if description needs show more/less
  const shouldShowToggle = () => {
    const words = description.split(' ');
    return words.length > 10;
  };

  const handleDescriptionToggle = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const getCategoryImage = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'ballet':
        return require('@/assets/images/ballet.png');
      case 'hip-hop':
      case 'hiphop':
        return require('@/assets/images/hipHop.png');
      case 'jazz':
        return require('@/assets/images/jazz.png');
      case 'salsa':
        return require('@/assets/images/salsa.png');
      case 'swing':
        return require('@/assets/images/swing.png');
      case 'tap':
        return require('@/assets/images/tap.png');
      case 'modern':
        return require('@/assets/images/modern.png');
      case 'contemporary':
        return require('@/assets/images/contomeprorary.png');
      default:
        return require('@/assets/images/hipHop.png'); // Default fallback
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.95 : 1 }
      ]}
      onPress={onPress}
    >
      {/* Top Section with Image and Content */}
      <View style={styles.topSection}>
        {/* Left Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={
              imageUrl && imageUrl !== 'placeholder'
                ? { uri: imageUrl }
                : require('@/assets/svg/cardimage.png')
            }
            style={styles.image}
            resizeMode="cover"
          />
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
        <View>
          <Text style={styles.description}>
            Describtion : {getDescriptionText()}
          </Text>
          {shouldShowToggle() && (
            <Pressable onPress={handleDescriptionToggle} style={styles.showMoreContainer}>
              <Text style={styles.showMore}>
                {isDescriptionExpanded ? 'Read less' : 'Read more'}
              </Text>
            </Pressable>
          )}
        </View>
        </View>
      </View>

      {/* Bottom Section - Below Image and Details */}
      <View style={styles.bottomSection}>
        {/* Rating and Students Row */}
        <View style={styles.ratingStudentsRow}>
          {/* Rating Section */}
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{rating}</Text>
            <View style={styles.stars}>
              {[...Array(5)].map((_, index) => {
                const ratingValue = parseFloat(rating);
                const isFilled = index < Math.floor(ratingValue);
                const isHalfFilled = index === Math.floor(ratingValue) && ratingValue % 1 >= 0.5;
                
                return (
                  <StarRating 
                    key={index} 
                    width={18} 
                    height={18} 
                    filled={isFilled || isHalfFilled}
                  />
                );
              })}
            </View>
          </View>

          {/* Students Section */}
          <View style={styles.studentsContainer}>
            <Image 
              source={require('@/assets/svg/user.png')}
              style={styles.userIcon}
            />
            <Text style={styles.students}>{students}</Text>
          </View>
        </View>

        {/* Status Row */}
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status</Text>
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
    overflow: 'hidden',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  topSection: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 101,
    height: 138,
    borderRadius:10,
  },
  image: {
    width: 101,
    height: 138,
    borderRadius:10,
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
    marginBottom: 4,
  },
  showMoreContainer: {
    alignSelf: 'flex-start',
  },
  showMore: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  statsRow: {
  
   alignSelf:'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  bottomSection: {
    width: '100%',
    paddingTop: 12,
    marginTop: 8,
  },
  ratingStudentsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#808B95',
  },
  stars: {
    flexDirection: 'row',
    gap: 1,
  },
  studentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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

