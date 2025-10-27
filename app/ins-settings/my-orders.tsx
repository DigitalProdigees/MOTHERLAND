import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { useRouter } from 'expo-router';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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

interface OrderItem {
  id: string;
  classId: string;
  classTitle: string;
  classDescription: string;
  classCategory: string;
  classType: string;
  classDifficulty: string;
  classImage: string;
  classDate: string;
  classTime: string;
  classLocation: string;
  price: string;
  totalPrice: string;
  instructorId: string;
  instructorName: string;
  instructorImage: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  bookingDate: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

// Helper function to format date without year
const formatDateWithoutYear = (dateString: string) => {
  try {
    // If the date string is already in a readable format, return it
    if (typeof dateString === 'string' && dateString.includes(',')) {
      // Handle formats like "Tuesday, October 28, 2025"
      const parts = dateString.split(',');
      if (parts.length >= 2) {
        return parts.slice(0, 2).join(',').trim(); // Return "Tuesday, October 28"
      }
    }
    
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if date is invalid
    }
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    return dateString; // Return original if parsing fails
  }
};

const OrderCard: React.FC<{ item: OrderItem }> = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image 
          source={
            item.classImage && item.classImage !== 'placeholder'
              ? { uri: item.classImage }
              : require('@/assets/images/fav1.png')
          }
          style={styles.classImage} 
          resizeMode="contain" 
        />
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>{item.classTitle}</Text>
          <Text style={styles.price}>${item.totalPrice}</Text>
        </View>
        
        <View style={styles.dateTimeRow}>
          <View style={styles.dateTimeLeft}>
            <Image
              source={require('@/assets/images/emptyClock.png')}
              style={styles.clockIcon}
              resizeMode="contain"
            />
            <Text style={styles.dateTime}>{formatDateWithoutYear(item.classDate)}</Text>
          </View>
          <View style={styles.exactTimeContainer}>
            <Image
              source={require('@/assets/images/emptyClock.png')}
              style={styles.clockIcon}
              resizeMode="contain"
            />
            <Text style={styles.exactTime}>{item.classTime}</Text>
          </View>
        </View>
        
        <View style={styles.customerRow}>
          <Text style={styles.customerLabel}>Customer:</Text>
          <View style={styles.customerInfo}>
          <Image 
            source={require('@/assets/images/annie-bens.png')} 
            style={styles.customerImage} 
            resizeMode="cover" 
          />
          <Text style={styles.customerName}>{item.studentName}</Text></View>
        </View>
      </View>
    </View>
  );
};

export default function MyOrdersScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        console.error('User not logged in');
        return;
      }

      const ordersRef = ref(database, `users/${user.uid}/orders`);
      const snapshot = await get(ordersRef);
      
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersList = Object.values(ordersData) as OrderItem[];
        // Sort by createdAt in descending order (most recent first)
        const sortedOrders = ordersList.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.bookingDate || 0);
          const dateB = new Date(b.createdAt || b.bookingDate || 0);
          return dateB.getTime() - dateA.getTime();
        });
        setOrders(sortedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleBackPress = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A53C2" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {orders.length > 0 ? (
          orders.map((item) => (
            <OrderCard key={item.id} item={item} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>Orders will appear here when students book your classes!</Text>
          </View>
        )}
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
    borderRadius:10,
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
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between'
  },
  customerLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#808B95',
    marginRight: 8,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customerImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  customerName: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
  },
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#333333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
  },
});
