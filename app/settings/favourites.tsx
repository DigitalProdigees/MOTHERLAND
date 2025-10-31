import FavCard from '@/components/ui/fav-card';
import { Fonts } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { useRouter } from 'expo-router';
import { onValue, ref, remove, set } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FavouriteItem {
  id: string;
  title: string;
  description: string;
  category: string;
  subscriberPrice: string;
  imageUrl: string;
  rating: number;
  instructorName: string;
  instructorId: string;
  date: string;
  time: string;
  location: string;
  createdAt: string;
}

export default function FavouritesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState<Array<FavouriteItem & { key: string }>>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const favouritesRef = ref(database, `users/${user.uid}/favourites`);
    
    const unsubscribe = onValue(favouritesRef, (snapshot) => {
      if (snapshot.exists()) {
        const favouritesData = snapshot.val();
        const favouritesArray = Object.entries(favouritesData).map(([key, value]: [string, any]) => ({
          key,
          ...value,
        }));
        setFavourites(favouritesArray);
      } else {
        setFavourites([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleBackPress = () => {
    router.back();
  };

  const handleClassPress = async (classId: string) => {
    console.log('🔵 FAVOURITES: handleClassPress called with classId:', classId);
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      // Save the class id to database for home/index.tsx to read
      const navigationStateRef = ref(database, `users/${user.uid}/navigationState/selectedClassId`);
      await set(navigationStateRef, classId);
      console.log('🔵 FAVOURITES: Saved classId to database:', classId);
      
      // Navigate to home screen - it will read the id from database and redirect
      router.push('/(home)/home');
    } catch (error) {
      console.error('Error saving class id to database:', error);
    }
  };

  const handleRemoveFavourite = async (favouriteKey: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const favouriteRef = ref(database, `users/${user.uid}/favourites/${favouriteKey}`);
      await remove(favouriteRef);
    } catch (error) {
      console.error('Error removing favourite:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8A53C2" />
          <Text style={styles.loadingText}>Loading favourites...</Text>
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
        <Text style={styles.headerTitle}>My Favourites</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favourites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favourites yet</Text>
            <Text style={styles.emptySubText}>Start bookmarking classes you love!</Text>
          </View>
        ) : (
          favourites.map((item) => (
            <FavCard
              key={item.key}
              title={item.title}
              price={item.subscriberPrice === 'Free' || item.subscriberPrice === 'free' ? '$0' : item.subscriberPrice}
              instructor={item.instructorName}
              rating={item.rating?.toString() || '0'}
              students="0"
              description={item.description || 'No description available'}
              imageUrl={item.imageUrl}
              onPress={() => handleClassPress(item.id)}
              onRemove={() => handleRemoveFavourite(item.key)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    left: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#333333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
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
});
