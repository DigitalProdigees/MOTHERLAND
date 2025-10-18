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

interface BookingItem {
  id: string;
  title: string;
  price: string;
  date: string;
  time: string;
  exactTime: string;
  instructor: string;
  instructorImage: any;
  classImage: any;
}

const bookingsData: BookingItem[] = [
  {
    id: '1',
    title: 'Private Belly Dance Lesson',
    price: '$20',
    date: 'Wed, Jul 12',
    time: '10:00',
    exactTime: '10:00 am',
    instructor: 'James Ray',
    instructorImage: require('@/assets/images/annie-bens.png'),
    classImage: require('@/assets/images/fav1.png'),
  },
  {
    id: '2',
    title: 'Private Belly Dance Lesson',
    price: '$20',
    date: 'Wed, Jul 12',
    time: '10:00',
    exactTime: '10:00 am',
    instructor: 'James Ray',
    instructorImage: require('@/assets/images/annie-bens.png'),
    classImage: require('@/assets/images/fav2.png'),
  },
  {
    id: '3',
    title: 'Private Belly Dance Lesson',
    price: '$20',
    date: 'Wed, Jul 12',
    time: '10:00',
    exactTime: '10:00 am',
    instructor: 'James Ray',
    instructorImage: require('@/assets/images/annie-bens.png'),
    classImage: require('@/assets/images/fav3.png'),
  },
];

const BookingCard: React.FC<{ item: BookingItem }> = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={item.classImage} style={styles.classImage} resizeMode="cover" />
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
        
        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeLeft}>
            <Image
              source={require('@/assets/images/emptyClock.png')}
              style={styles.clockIcon}
              resizeMode="contain"
            />
            <Text style={styles.dateTime}>{item.date}, {item.time}</Text>
          </View>
          <View style={styles.exactTimeContainer}>
            <Image
              source={require('@/assets/images/emptyClock.png')}
              style={styles.clockIcon}
              resizeMode="contain"
            />
            <Text style={styles.exactTime}>{item.exactTime}</Text>
          </View>
        </View>
        
        <View style={styles.instructorRow}>
          <Text style={styles.instructorLabel}>Instructor:</Text>
          <View style={styles.instructorInfo}>
          <Image source={item.instructorImage} style={styles.instructorImage} resizeMode="cover" />
          <Text style={styles.instructorName}>{item.instructor}</Text></View>
        </View>
      </View>
    </View>
  );
};

export default function MyBookingsScreen() {
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
        <Text style={styles.headerTitle}>Booked Classes</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {bookingsData.map((item) => (
          <BookingCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.66)',
    borderRadius: 12,
    marginBottom: 16,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  classImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom:6,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 22,
    fontWeight:'bold',
    color: '#222222',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateTimeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: '#C708F7',
  },
  dateTime: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
  },
  exactTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exactTime: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  instructorLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#808B95',
    marginRight: 8,
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructorImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  instructorName: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
  },
});
