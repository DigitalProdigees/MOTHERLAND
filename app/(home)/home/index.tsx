import AppHeader from '@/components/ui/app-header';
import CategoriesSection from '@/components/ui/categories-section';
import FeaturedClassesSection from '@/components/ui/featured-classes-section';
import GradientBackground from '@/components/ui/gradient-background';
import SearchBar from '@/components/ui/search-bar';
import StreetDanceSection from '@/components/ui/street-dance-section';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeIndexScreen() {
  const router = useRouter();

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

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

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleSeeAllCategories = () => {
    console.log('See all categories pressed');
  };

  const handleCategoryPress = (category: string) => {
    console.log('Category pressed:', category);
  };

  const handleSeeAllFeatured = () => {
    console.log('See all featured pressed');
  };

  const handleClassPress = (classId: string) => {
    router.push(`/home/${classId}`);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
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
          />
          
          <CategoriesSection
            onSeeAllPress={handleSeeAllCategories}
            onCategoryPress={handleCategoryPress}
          />
          
          <FeaturedClassesSection
            onSeeAllPress={handleSeeAllFeatured}
            onClassPress={handleClassPress}
          />
          
          <StreetDanceSection
            onClassPress={handleClassPress}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: -40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
});
