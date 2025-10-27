import FeaturedClassesSection from '@/components/ui/featured-classes-section';
import GradientBackground from '@/components/ui/gradient-background';
import StreetDanceSection from '@/components/ui/street-dance-section';
import { Fonts } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClassesIndexScreen() {
  const navigation = useNavigation();
  const handleClassPress = (classId: string) => {
  
  };

  const handleSeeAllFeatured = () => {
    console.log('See all featured pressed');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Classes</Text>
            <Text style={styles.subtitle}>Discover and join dance classes</Text>
            
            <FeaturedClassesSection
              onSeeAllPress={handleSeeAllFeatured}
              onClassPress={handleClassPress}
            />
            
            <StreetDanceSection
              onClassPress={handleClassPress}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    marginBottom: 30,
    opacity: 0.9,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
  },
});
