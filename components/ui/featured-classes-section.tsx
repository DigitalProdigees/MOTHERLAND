import { Fonts } from '@/constants/theme';
import { database } from '@/firebase.config';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DanceClassCard from './dance-class-card';

interface ClassListing {
  id: string;
  title: string;
  description: string;
  category: string;
  classType: string;
  difficulty: string;
  subscriberPrice: string;
  nonSubscriberPrice: string;
  date: string;
  time: string;
  location: string;
  status: 'draft' | 'published';
  createdAt: string;
  instructorId: string;
  instructorName: string;
  imageUrl: string;
  rating: number;
  subscribers: number;
  availability: number;
}

interface FeaturedClassesSectionProps {
  onSeeAllPress?: () => void;
  onClassPress?: (classId: string) => void;
}

const FeaturedClassesSection: React.FC<FeaturedClassesSectionProps> = ({
  onSeeAllPress,
  onClassPress,
}) => {
  const [featuredClasses, setFeaturedClasses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all published listings from global Listings node
    const listingsRef = ref(database, 'Listings');
    const unsubscribe = onValue(listingsRef, (snapshot) => {
      const listingsData = snapshot.val();
      if (listingsData) {
        const allListings: ClassListing[] = [];
        
        // Convert listings data to array
        Object.entries(listingsData).forEach(([listingId, listing]: [string, any]) => {
          allListings.push({
            id: listingId,
            ...listing,
          });
        });

        // Sort by creation date (most recent first) and take the first 2 for featured
        const sortedListings = allListings
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 2);

        // Transform to the format expected by DanceClassCard
        const transformedClasses = sortedListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          price: listing.subscriberPrice, // Show subscriber price
          instructor: listing.instructorName,
          rating: listing.rating.toFixed(1),
          students: `${listing.subscribers} students`,
          description: listing.description,
          status: 'Trending Now',
          statusIcon: '🔥',
          category: listing.category,
        }));

        setFeaturedClasses(transformedClasses);
      } else {
        setFeaturedClasses([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Featured Dance Classes</Text>
          <Pressable
            style={({ pressed }) => [
              styles.seeAllButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={onSeeAllPress}
          >
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Dance Classes</Text>
        <Pressable
          style={({ pressed }) => [
            styles.seeAllButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={onSeeAllPress}
        >
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>

      <View style={styles.classesList}>
        {featuredClasses.length > 0 ? (
          featuredClasses.map((danceClass) => (
            <DanceClassCard
              key={danceClass.id}
              title={danceClass.title}
              price={danceClass.price}
              instructor={danceClass.instructor}
              rating={danceClass.rating}
              students={danceClass.students}
              description={danceClass.description}
              status={danceClass.status}
              statusIcon={danceClass.statusIcon}
              onPress={() => onClassPress?.(danceClass.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No featured classes available</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: '#FFFFFF',
  },
  seeAllButton: {
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
  },
  classesList: {
    gap: 0,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default FeaturedClassesSection;
