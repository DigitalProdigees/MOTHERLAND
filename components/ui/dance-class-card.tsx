import { Fonts } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>🎭</Text>
        </View>
        {status && (
          <View style={styles.statusOverlay}>
            <Text style={styles.statusIcon}>{statusIcon}</Text>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
        
        <View style={styles.subscribersContainer}>
          <Text style={styles.subscribersText}>Subscribers</Text>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{rating}</Text>
          <View style={styles.stars}>
            {[...Array(5)].map((_, index) => (
              <Text key={index} style={styles.star}>⭐</Text>
            ))}
          </View>
        </View>

        <View style={styles.instructorContainer}>
          <View style={styles.instructorInfo}>
            <View style={styles.instructorAvatar}>
              <Text style={styles.avatarText}>👨</Text>
            </View>
            <Text style={styles.instructor}>{instructor}</Text>
          </View>
          
          <View style={styles.studentsContainer}>
            <Text style={styles.studentsIcon}>👥</Text>
            <Text style={styles.students}>{students}</Text>
          </View>
        </View>

        {duration && (
          <View style={styles.durationContainer}>
            <Text style={styles.durationIcon}>⏰</Text>
            <Text style={styles.duration}>{duration}</Text>
          </View>
        )}

        {seatAvailability && (
          <View style={styles.seatContainer}>
            <Text style={styles.seatIcon}>🎫</Text>
            <Text style={styles.seatText}>{seatAvailability}</Text>
          </View>
        )}

        {status && (
          <View style={styles.trendingContainer}>
            <Text style={styles.trendingIcon}>🔥</Text>
            <Text style={styles.trendingText}>{status}</Text>
          </View>
        )}
      </View>

      <View style={styles.gradientOverlay} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
    position: 'relative',
  },
  imageContainer: {
    height: 120,
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    fontSize: 48,
  },
  statusOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#8B5CF6',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 8,
  },
  subscribersContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  subscribersText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#6B7280',
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  rating: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#000000',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 12,
  },
  instructorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
  },
  instructor: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  studentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studentsIcon: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  students: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#6B7280',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  durationIcon: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  duration: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#6B7280',
  },
  seatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  seatIcon: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  seatText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#6B7280',
  },
  trendingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendingIcon: {
    fontSize: 12,
  },
  trendingText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#92400E',
  },
  gradientOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
});

export default DanceClassCard;
