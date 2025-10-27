import { database } from '@/firebase.config';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import StreetDanceCard from './street-dance-card';

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

interface StreetDanceSectionProps {
  onClassPress?: (classId: string) => void;
}

const StreetDanceSection: React.FC<StreetDanceSectionProps> = ({
  onClassPress,
}) => {
  const [streetDanceClasses, setStreetDanceClasses] = useState<any[]>([]);
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

        // Sort by creation date (most recent first) and take the first 2 for street dance section
        const sortedListings = allListings
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 2);

        // Transform to the format expected by StreetDanceCard
        const transformedClasses = sortedListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          price: listing.subscriberPrice, // Show subscriber price
          instructor: listing.instructorName,
          rating: listing.rating.toFixed(1),
          students: `${listing.subscribers} students`,
          description: listing.description,
          duration: '45 min', // Default duration
          seatAvailability: `${listing.availability} available`,
          category: listing.category,
        }));

        setStreetDanceClasses(transformedClasses);
      } else {
        setStreetDanceClasses([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.classesList}>
        {streetDanceClasses.length > 0 ? (
          streetDanceClasses.map((danceClass) => (
            <StreetDanceCard
              key={danceClass.id}
              title={danceClass.title}
              price={danceClass.price}
              instructor={danceClass.instructor}
              rating={danceClass.rating}
              students={danceClass.students}
              description={danceClass.description}
              duration={danceClass.duration}
              seatAvailability={danceClass.seatAvailability}
              onPress={() => onClassPress?.(danceClass.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No classes available</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100, // Space for tab bar
  },
  classesList: {
    gap: 0,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
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
    fontFamily: 'Quicksand-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default StreetDanceSection;
