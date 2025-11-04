import ClassCard from '@/components/ui/class-card';
import FilterModal, { FilterOptions } from '@/components/ui/filter-modal';
import GradientBackground from '@/components/ui/gradient-background';
import SearchBar, { SearchBarRef } from '@/components/ui/search-bar';
import { Fonts } from '@/constants/theme';
import { database } from '@/firebase.config';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { get, onValue, ref } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
  status: 'draft' | 'published' | 'approved';
  createdAt: string;
  instructorId: string;
  instructorName: string;
  imageUrl: string;
  mainImage?: string;
  rating: number;
  subscribers: number;
  availability: number;
  availableSeats?: number;
}

export default function ClassesIndexScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [classes, setClasses] = useState<ClassListing[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [instructorImages, setInstructorImages] = useState<Record<string, string>>({});
  
  // State for search, category, and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const searchBarRef = useRef<SearchBarRef>(null);

  // Filter classes based on search, category, and filters
  useEffect(() => {
    let filtered = [...classes];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((classItem) =>
        classItem.title.toLowerCase().includes(query) ||
        classItem.description.toLowerCase().includes(query) ||
        classItem.instructorName.toLowerCase().includes(query) ||
        classItem.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((classItem) =>
        classItem.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply price filters
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter((classItem) => {
        const price = parseFloat(classItem.subscriberPrice?.replace('$', '').replace('USD', '').trim() || '0');
        return price >= minPrice;
      });
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter((classItem) => {
        const price = parseFloat(classItem.subscriberPrice?.replace('$', '').replace('USD', '').trim() || '0');
        return price <= maxPrice;
      });
    }

    // Apply rating filter
    if (filters.minRating) {
      const minRating = parseFloat(filters.minRating);
      filtered = filtered.filter((classItem) => (classItem.rating || 0) >= minRating);
    }

    // Apply available seats filter
    if (filters.minAvailableSeats) {
      const minSeats = parseInt(filters.minAvailableSeats);
      filtered = filtered.filter((classItem) => {
        const seats = classItem.availableSeats || classItem.availability || 0;
        return seats >= minSeats;
      });
    }

    setFilteredClasses(filtered);
  }, [classes, searchQuery, selectedCategory, filters]);

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
        const imageMap: Record<string, string> = {};
        await Promise.all(
          sortedListings.map(async (listing) => {
            if (!imageMap[listing.instructorId]) {
              try {
                const instructorRef = ref(database, `users/${listing.instructorId}/personalInfo`);
                const instructorSnapshot = await get(instructorRef);
                if (instructorSnapshot.exists()) {
                  const instructorData = instructorSnapshot.val();
                  imageMap[listing.instructorId] = 
                    instructorData.profileImageUrl || 
                    instructorData.profileImageUri || 
                    instructorData.profileImage || 
                    '';
                }
              } catch (error) {
                console.log('Error fetching instructor image:', error);
              }
            }
          })
        );

        setInstructorImages(imageMap);
        setClasses(sortedListings);
      } else {
        setClasses([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleClassPress = (classId: string) => {
    try {
      // Navigate to home tab's class-details screen
      (navigation as any).navigate('Tabs', {
        screen: 'home',
        params: {
          screen: 'class-details',
          params: { id: classId },
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleSearchBarPress = () => {
    console.log('Search bar pressed');
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleRemoveFilter = (filterKey: string) => {
    const updatedFilters = { ...filters };
    delete updatedFilters[filterKey as keyof FilterOptions];
    setFilters(updatedFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    setSelectedCategory('all');
  };

  // Calculate duration - default to 45 min if not available
  const getDuration = (classData: ClassListing) => {
    // You can extract duration from time field or use a default
    return '45 min';
  };

  // Format seat availability
  const getSeatAvailability = (classData: ClassListing) => {
    const seats = classData.availableSeats || classData.availability || 0;
    return `Seat Availability`;
  };

  if (isLoading) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading classes...</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GradientBackground>
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          
          {/* Fixed Header */}
          <LinearGradient
            colors={['#F708F7', '#C708F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.fixedHeader, 
              { 
                paddingTop: insets.top,
                zIndex: showFilterModal ? 1 : 10,
              }
            ]}
          >
            {/* Title Section */}
            <View style={styles.header}>
              <Text style={styles.title}>Classes</Text>
              <Text style={styles.subtitle}>Discover and join dance classes</Text>
            </View>
            
            <SearchBar
              ref={searchBarRef}
              onPress={handleSearchBarPress}
              onFilterPress={handleFilterPress}
              onSearchChange={handleSearchChange}
              value={searchQuery}
            />

            {/* Active Filters Section */}
            {(searchQuery || selectedCategory !== 'all' || Object.keys(filters).length > 0) && (
              <View style={styles.activeFiltersContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filtersScrollContent}
                >
                  {searchQuery && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>Search: "{searchQuery}"</Text>
                      <Pressable 
                        onPress={() => setSearchQuery('')}
                        style={styles.removeFilterButton}
                      >
                        <Image 
                          source={require('@/assets/images/close.png')}
                          style={styles.closeIcon}
                        />
                      </Pressable>
                    </View>
                  )}
                  
                  {selectedCategory !== 'all' && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>Category: {selectedCategory}</Text>
                      <Pressable 
                        onPress={() => setSelectedCategory('all')}
                        style={styles.removeFilterButton}
                      >
                        <Image 
                          source={require('@/assets/images/close.png')}
                          style={styles.closeIcon}
                        />
                      </Pressable>
                    </View>
                  )}
                  
                  {filters.minPrice && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>Min Price: ${filters.minPrice}</Text>
                      <Pressable 
                        onPress={() => handleRemoveFilter('minPrice')}
                        style={styles.removeFilterButton}
                      >
                        <Image 
                          source={require('@/assets/images/close.png')}
                          style={styles.closeIcon}
                        />
                      </Pressable>
                    </View>
                  )}
                  
                  {filters.maxPrice && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>Max Price: ${filters.maxPrice}</Text>
                      <Pressable 
                        onPress={() => handleRemoveFilter('maxPrice')}
                        style={styles.removeFilterButton}
                      >
                        <Image 
                          source={require('@/assets/images/close.png')}
                          style={styles.closeIcon}
                        />
                      </Pressable>
                    </View>
                  )}
                  
                  {filters.minRating && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>Min Rating: {filters.minRating} ★</Text>
                      <Pressable 
                        onPress={() => handleRemoveFilter('minRating')}
                        style={styles.removeFilterButton}
                      >
                        <Image 
                          source={require('@/assets/images/close.png')}
                          style={styles.closeIcon}
                        />
                      </Pressable>
                    </View>
                  )}
                  
                  {filters.minAvailableSeats && (
                    <View style={styles.filterChip}>
                      <Text style={styles.filterChipText}>Min Seats: {filters.minAvailableSeats}</Text>
                      <Pressable 
                        onPress={() => handleRemoveFilter('minAvailableSeats')}
                        style={styles.removeFilterButton}
                      >
                        <Image 
                          source={require('@/assets/images/close.png')}
                          style={styles.closeIcon}
                        />
                      </Pressable>
                    </View>
                  )}
                  
                  <Pressable 
                    style={styles.clearAllButton}
                    onPress={handleClearAllFilters}
                  >
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </Pressable>
                </ScrollView>
              </View>
            )}
          </LinearGradient>
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingTop: 250 }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            
            {filteredClasses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {classes.length === 0 
                    ? 'No classes available at the moment' 
                    : 'No classes match your filters'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {classes.length === 0 
                    ? 'Check back later for new classes!' 
                    : 'Try adjusting your search or filters'}
                </Text>
              </View>
            ) : (
              <View style={styles.classesList}>
                {filteredClasses.map((item) => (
                  <ClassCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    price={item.subscriberPrice || '$0'}
                    instructor={item.instructorName}
                    instructorImageUrl={instructorImages[item.instructorId]}
                    rating={item.rating || 0}
                    description={item.description || 'No description available'}
                    duration={getDuration(item)}
                    seatAvailability={getSeatAvailability(item)}
                    category={item.category}
                    imageUrl={item.imageUrl}
                    mainImage={item.mainImage}
                    onPress={() => handleClassPress(item.id)}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </GradientBackground>
      
      {/* Filter Modal - Outside main container to ensure proper z-index */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApplyFilters={handleApplyFilters}
        initialFilters={filters}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: -40,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    paddingBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  activeFiltersContainer: {
  },
  filtersScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal:20,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: '#333333',
  },
  removeFilterButton: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 9,
  },
  closeIcon: {
    width: 10,
    height: 10,
    tintColor: '#666666',
  },
  clearAllButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  clearAllText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#FFFFFF',
  },
  classesList: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
    marginTop: 16,
    opacity: 0.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
});
