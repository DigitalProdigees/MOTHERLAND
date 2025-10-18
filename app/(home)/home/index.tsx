import AppHeader from '@/components/ui/app-header';
import CategoriesSection from '@/components/ui/categories-section';
import Drawer from '@/components/ui/drawer';
import FeaturedClassesSection from '@/components/ui/featured-classes-section';
import GradientBackground from '@/components/ui/gradient-background';
import SearchBar from '@/components/ui/search-bar';
import StreetDanceSection from '@/components/ui/street-dance-section';
import { useDrawer } from '@/contexts/DrawerContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeIndexScreen() {
  const router = useRouter();
  const { isDrawerOpen, setIsDrawerOpen } = useDrawer();

  const handleMenuPress = () => {
    setIsDrawerOpen(true);
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
    router.push(`/home/classDetails?id=${classId}`);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleDrawerMenuPress = (menuItem: string) => {
    console.log('Drawer menu pressed:', menuItem);
    setIsDrawerOpen(false);
    
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
    setIsDrawerOpen(false);
    // Add logout logic here
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
        
        <Drawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          onMenuPress={handleDrawerMenuPress}
          onLogout={handleLogout}
        />
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
