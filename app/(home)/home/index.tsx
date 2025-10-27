import AllListingsSection from '@/components/ui/all-listings-section';
import AppHeader from '@/components/ui/app-header';
import CategoriesSection from '@/components/ui/categories-section';
import FilterModal, { FilterOptions } from '@/components/ui/filter-modal';
import GradientBackground from '@/components/ui/gradient-background';
import SearchBar from '@/components/ui/search-bar';
import { Fonts } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeIndexScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  
  // State for search, category, and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const handleMenuPress = undefined; // AppHeader opens drawer via navigation

  const handleAddPress = () => {
    console.log('Add pressed');
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
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

  const handleSeeAllCategories = () => {
    console.log('See all categories pressed');
  };

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSeeAllFeatured = () => {
    console.log('See all featured pressed');
  };

  const handleSeeAllListings = () => {
    console.log('See all listings pressed');
  };

  const handleClassPress = (classId: string) => {
    console.log('Navigating to class details with ID:', classId);
    
    try {
      // Navigate to class-details screen with the class ID as a parameter
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

  const handleDrawerMenuPress = (menuItem: string) => {
    console.log('Drawer menu pressed:', menuItem);
    
    // Add navigation logic for different menu items
    switch (menuItem) {
      case 'My Favourites':
        router.push('/settings/favourites');
        break;
      case 'My Bookings':
        router.push('/settings/my-bookings');
        break;
      case 'Library':
        // Add navigation to library screen
        break;
      case 'Switch as Instructor':
        // Add navigation to instructor mode
        break;
      case 'Products':
        // Add navigation to products screen
        break;
      case 'My Post':
        router.push('/settings/my-post');
        break;
      case 'Subscriptions':
        router.push('/settings/my-subscriptions');
        break;
      case 'Change Password':
        router.push('/settings/change-password');
        break;
      case 'Contact Us':
        router.push('/settings/contact-us');
        break;
      case 'Terms of services':
        router.push('/settings/terms-conditions');
        break;
      case 'Privacy Policy':
        router.push('/settings/privacy-policy');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    console.log('Logout pressed');
    // Add logout logic here
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <AppHeader
              onMenuPress={handleMenuPress}
              onAddPress={handleAddPress}
              onSearchPress={handleSearchPress}
              onNotificationPress={handleNotificationPress}
            />
            
            <SearchBar
              onPress={handleSearchBarPress}
              onFilterPress={handleFilterPress}
              onSearchChange={handleSearchChange}
              value={searchQuery}
            />
            
            {/* Active Filters Section */}
            {(searchQuery || selectedCategory !== 'all' || Object.keys(filters).length > 0) && (
              <LinearGradient
                colors={['rgba(247, 8, 247, 0.15)', 'rgba(199, 8, 247, 0.15)', 'rgba(155, 8, 247, 0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.activeFiltersContainer}
              >
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
              </LinearGradient>
            )}
            
            <CategoriesSection
              onSeeAllPress={handleSeeAllCategories}
              onCategoryPress={handleCategoryPress}
              selectedCategory={selectedCategory}
            />
        
            
            <AllListingsSection
              onSeeAllPress={handleSeeAllListings}
              onClassPress={handleClassPress}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              filters={filters}
            />
          </ScrollView>
          
          {/* Filter Modal */}
          <FilterModal
            visible={showFilterModal}
            onClose={() => setShowFilterModal(false)}
            onApplyFilters={handleApplyFilters}
            initialFilters={filters}
          />
          
          {/* Drawer handled globally in (home)/_layout via navigator */}
        </SafeAreaView>
      </GradientBackground>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom:-40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  filtersScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
});
