import { Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
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

interface FavouriteItem {
  id: string;
  title: string;
  rating: number;
  price: string;
  image: any;
}

const favouritesData: FavouriteItem[] = [
  {
    id: '1',
    title: 'Private Belly Dance Lesson',
    rating: 5.0,
    price: '$20',
    image: require('@/assets/images/fav1.png'),
  },
  {
    id: '2',
    title: 'Private Reiki Sessions',
    rating: 5.0,
    price: '$75',
    image: require('@/assets/images/fav2.png'),
  },
  {
    id: '3',
    title: 'Group Dance Session',
    rating: 4.1,
    price: '$15',
    image: require('@/assets/images/post1.png'),
  },
];

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Text key={i} style={styles.star}>
        ★
      </Text>
    );
  }

  if (hasHalfStar) {
    stars.push(
      <Text key="half" style={styles.star}>
        ☆
      </Text>
    );
  }

  return (
    <View style={styles.ratingContainer}>
      {stars}
      <Text style={styles.ratingText}>{rating}</Text>
    </View>
  );
};

const FavouriteCard: React.FC<{ item: FavouriteItem }> = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
        <Pressable style={styles.bookmarkButton}>
          <Image
            source={require('@/assets/images/bookmark.png')}
            style={styles.bookmarkIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardFooter}>
          <StarRating rating={item.rating} />
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </View>
    </View>
  );
};

export default function FavouritesScreen() {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

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
        <Text style={styles.headerTitle}>My Favourites</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favouritesData.map((item) => (
          <FavouriteCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal:20,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  backButton: {
    position: 'absolute',
    alignSelf:'flex-start',
    top: 16,
    zIndex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#333333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#333333',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    color: '#8A53C2',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#333333',
    marginLeft: 4,
  },
  price: {
    fontSize: 18,
    bottom:15,
    fontWeight:'bold',
    color: '#222222',
  },
});
