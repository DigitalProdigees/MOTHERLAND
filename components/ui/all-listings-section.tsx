import { Fonts } from '@/constants/theme';
import { database } from '@/firebase.config';
import { get, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DanceClassCard from './dance-class-card';
import { FilterOptions } from './filter-modal';

interface ClassListing {
  id: string;
  title: string;
  description: string;
  availableSeats: number;
  category: string;
  classType: string;
  difficulty: string;
  subscriberPrice: string;
  nonSubscriberPrice: string;
  date: string;
  time: string;
  location: string;
  status: 'draft' | 'published' | 'pending' | 'rejected';
  createdAt: string;
  instructorId: string;
  instructorName: string;
  imageUrl: string;
  rating: number;
  subscribers: number;
  availability: number;
}

interface AllListingsSectionProps {
  onSeeAllPress?: () => void;
  onClassPress?: (classId: string) => void;
  searchQuery?: string;
  selectedCategory?: string;
  filters?: FilterOptions;
}

const AllListingsSection: React.FC<AllListingsSectionProps> = ({
  onSeeAllPress,
  onClassPress,
  searchQuery = '',
  selectedCategory = 'all',
  filters,
}) => {
  const [allListings, setAllListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch all published listings from global Listings node
    const listingsRef = ref(database, 'Listings');
    const unsubscribe = onValue(listingsRef, async (snapshot) => {
      const listingsData = snapshot.val();
      if (listingsData) {
        const allListings: ClassListing[] = [];
        
        // Convert listings data to array, filter only approved/published listings
        Object.entries(listingsData).forEach(([listingId, listing]: [string, any]) => {
          // Only show published/approved listings to regular users
          if (listing.status === 'published' || listing.status === 'approved') {
            allListings.push({
              id: listingId,
              ...listing,
            });
          }
        });

        // Sort by creation date (most recent first)
        const sortedListings = allListings
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Fetch instructor profile images for each listing
        const listingsWithInstructorImages = await Promise.all(
          sortedListings.map(async (listing) => {
            let instructorImageUrl = '';
            try {
              const instructorRef = ref(database, `users/${listing.instructorId}/personalInfo`);
              const instructorSnapshot = await get(instructorRef);
              if (instructorSnapshot.exists()) {
                const instructorData = instructorSnapshot.val();
                instructorImageUrl = instructorData.profileImageUrl || instructorData.profileImageUri || '';
              }
            } catch (error) {
              console.log('Error fetching instructor image:', error);
            }
            return { ...listing, instructorImageUrl };
          })
        );

        // Transform to the format expected by DanceClassCard
        const transformedClasses = listingsWithInstructorImages.map((listing) => ({
          id: listing.id,
          title: listing.title,
          price: listing.subscriberPrice, // Show subscriber price
          instructor: listing.instructorName,
          instructorImageUrl: listing.instructorImageUrl,
          rating: listing.rating.toFixed(1),
          students: `${listing.subscribers} students`,
          description: listing.description,
          status: 'Available',
          statusIcon: '🔥',
          category: listing.category,
          imageUrl: listing.imageUrl, // Pass image URL
          // Keep original data for filtering
          originalData: listing,
        }));

        setAllListings(transformedClasses);
      } else {
        setAllListings([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = [...allListings];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter((listing) => {
        const categoryId = listing.originalData?.category?.toLowerCase().replace(/[\s-]/g, '-') || '';
        return categoryId === selectedCategory;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((listing) => {
        const title = listing.title.toLowerCase();
        const instructor = listing.instructor.toLowerCase();
        const description = listing.description.toLowerCase();
        return (
          title.includes(query) ||
          instructor.includes(query) ||
          description.includes(query)
        );
      });
    }

    // Filter by price range
    if (filters?.minPrice || filters?.maxPrice) {
      filtered = filtered.filter((listing) => {
        const price = parseFloat(listing.originalData?.subscriberPrice?.replace(/\$/g, '') || '0');
        const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
        const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Filter by rating
    if (filters?.minRating) {
      filtered = filtered.filter((listing) => {
        const rating = parseFloat(listing.rating);
        const minRating = parseFloat(filters.minRating!);
        return rating >= minRating;
      });
    }

    // Filter by available seats
    if (filters?.minAvailableSeats) {
      filtered = filtered.filter((listing) => {
        const seats = listing.originalData?.availableSeats || 0;
        const minSeats = parseInt(filters.minAvailableSeats!);
        return seats >= minSeats;
      });
    }

    setFilteredListings(filtered);
  }, [allListings, searchQuery, selectedCategory, filters]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>All Dance Classes</Text>
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
        <Text style={styles.title}>All Dance Classes</Text>
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
        {filteredListings.length > 0 ? (
          filteredListings.map((danceClass) => (
            <DanceClassCard
              key={danceClass.id}
              title={danceClass.title}
              price={danceClass.price}
              instructor={danceClass.instructor}
              instructorImageUrl={danceClass.instructorImageUrl}
              rating={danceClass.rating}
              students={danceClass.students}
              description={danceClass.description}
              status={danceClass.status}
              statusIcon={danceClass.statusIcon}
              imageUrl={danceClass.imageUrl}
              onPress={() => onClassPress?.(danceClass.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedCategory !== 'all' || filters ? 'No classes match your filters' : 'No classes available'}
            </Text>
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

export default AllListingsSection;
