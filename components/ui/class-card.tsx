import Star from '@/assets/svg/Star';
import ProfileAvatar from '@/components/ui/profile-avatar';
import { Fonts } from '@/constants/theme';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface ClassCardProps {
  id: string;
  title: string;
  price: string;
  instructor: string;
  instructorImageUrl?: string;
  rating: number;
  description: string;
  duration?: string;
  seatAvailability: string;
  category: string;
  imageUrl?: string;
  mainImage?: string;
  onPress?: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({
  title,
  price,
  instructor,
  instructorImageUrl,
  rating,
  description,
  duration = '45 min',
  seatAvailability,
  category,
  imageUrl,
  mainImage,
  onPress,
}) => {
  // Function to truncate text to first 50 words for description
  const truncateText = (text: string, wordLimit: number = 50) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const truncatedDescription = truncateText(description, 50);

  // Get category icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'ballet':
        return require('@/assets/images/ballet.png');
      case 'hip-hop':
      case 'hiphop':
        return require('@/assets/images/hipHop2.png');
      case 'jazz':
        return require('@/assets/images/jazz.png');
      case 'belly':
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
        return require('@/assets/images/hipHop2.png');
    }
  };

  // Format category name for display
  const formatCategoryName = (category: string) => {
    if (!category) return 'Class';
    const formatted = category.toLowerCase().split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('-');
    return formatted;
  };

  // Get display image
  const displayImage = mainImage || imageUrl;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.95 : 1 }
      ]}
      onPress={onPress}
    >
      {/* Image Section with Category Badge */}
      <View style={styles.imageContainer}>
        <Image 
          source={
            displayImage && displayImage !== 'placeholder'
              ? { uri: displayImage }
              : require('@/assets/images/streetcard.png')
          }
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Category Badge Overlay */}
        <View style={styles.categoryBadge}>
          <Image 
            source={getCategoryIcon(category)}
            style={styles.categoryIcon}
            resizeMode="contain"
          />
          <Text style={styles.categoryText}>{formatCategoryName(category)}</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Title and Price Row */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{price}</Text>
            <View style={styles.subscribersBadge}>
              <Text style={styles.subscribersText}>Subscribers</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {truncatedDescription}
        </Text>
        {description.split(' ').length > 50 && (
          <Text style={styles.readMore}>Read more...</Text>
        )}

        {/* Rating and Duration Row */}
        <View style={styles.ratingDurationRow}>
          <View style={styles.ratingSection}>
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            <View style={styles.stars}>
              {[...Array(5)].map((_, index) => {
                const ratingValue = parseFloat(rating.toFixed(1));
                const isFilled = index < Math.floor(ratingValue);
                const isHalfFilled = index === Math.floor(ratingValue) && ratingValue % 1 >= 0.5;
                
                return (
                  <Star 
                    key={index} 
                    width={16} 
                    height={16} 
                    filled={isFilled || isHalfFilled}
                    color="#8A53C2"
                  />
                );
              })}
            </View>
          </View>

          {/* Duration Section */}
          <View style={styles.durationSection}>
            <View style={styles.durationIconContainer}>
              <Image 
                source={require('@/assets/images/clockG.png')}
                style={styles.clockIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>

        {/* Instructor Row */}
        <View style={styles.instructorRow}>
            <View>
          <Text style={styles.instructorLabel}>Instructor:</Text></View>
          <View style={styles.instructorInfo}>
            <ProfileAvatar
              imageUrl={instructorImageUrl}
              fullName={instructor}
              size={24}
              style={styles.instructorAvatar}
            />
            <Text style={styles.instructor}>{instructor}</Text>
          </View>
        </View>

        {/* Seat Availability */}
        <View style={styles.seatAvailabilitySection}>
          <View style={styles.seatIconContainer}>
            <Image 
              source={require('@/assets/images/availability.png')}
              style={styles.seatIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.seatAvailabilityText}>{seatAvailability}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    padding:16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius:16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius:16,
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(81, 89, 97, 0.64)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryIcon: {
    width: 20,
    height: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Fonts.medium,
  },
  content: {
    marginTop:16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  subscribersBadge: {
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
    gap: 5,
  },
  durationIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockIcon: {
    width: 28,
    height: 28,
  },
  duration: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#808B95',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  instructorLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructorAvatar: {
    width: 24,
    height: 24,
  },
  instructor: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  seatAvailabilitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:5,
  },
  seatIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatIcon: {
    width: 29,
    height: 29,
  },
  seatAvailabilityText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#808B95',
  },
});

export default ClassCard;

