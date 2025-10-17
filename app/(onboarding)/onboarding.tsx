import { Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: screenWidth } = Dimensions.get('window');
  const carouselRef = useRef<ICarouselInstance>(null);
  
  // Carousel data
  const carouselData = [
    {
      title: 'Discover Amazing Music',
      subtitle: 'Explore a world of authentic sounds and discover your next favorite artist.',
      imageSource: require('@/assets/images/carousal1.png'),
    },
    {
      title: 'Connect & Share',
      subtitle: 'Join a community of music lovers and share your favorite tracks.',
      imageSource: require('@/assets/images/carousal2.png'),
    },
    {
      title: 'Start Your Journey',
      subtitle: 'Create your account and dive into the world of MotherLand Jams',
      imageSource: require('@/assets/images/carousal3.png'),
    },
  ];

  const handleNext = () => {
    if (currentIndex < carouselData.length - 1) {
      carouselRef.current?.scrollTo({ index: currentIndex + 1, animated: true });
    } else {
      // Navigate to signin after last slide
      router.replace('/(auth)/signin');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      carouselRef.current?.scrollTo({ index: currentIndex - 1, animated: true });
    }
  };

  const onSnapToItem = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSkip = () => {
    // Navigate directly to signin
    router.replace('/(auth)/signin');
  };

  const renderCarouselItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.carouselItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
      <View style={styles.imageContainer}>
        <Image
          source={item.imageSource}
          style={styles.carousalImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip button at top center */}
      <View style={styles.topSection}>
        <View style={styles.skipContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.skipButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </Pressable>
        </View>
      </View>

      {/* Carousel Content */}
      <View style={styles.carouselContainer}>
        <Carousel
          ref={carouselRef}
          loop={false}
          width={screenWidth}
          data={carouselData}
          renderItem={renderCarouselItem}
          onSnapToItem={onSnapToItem}
          defaultIndex={0}
          autoPlay={false}
          scrollAnimationDuration={300}
        />
        
   
      </View>

      {/* Fixed bottom section */}
      <View style={styles.bottomSection}>
        {/* Progress indicator dots */}
        <View style={styles.dotsContainer}>
          {carouselData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentIndex === index ? styles.activeIndicator : styles.inactiveIndicator,
              ]}
            />
          ))}
        </View>

        {/* Navigation buttons */}
        <View style={styles.navigationContainer}>
          {/* Back button - only show for slides 2 and 3 */}
          {currentIndex > 0 && (
            <View style={styles.backButtonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.backButton,
                  { opacity: pressed ? 0.8 : 1 }
                ]}
                onPress={handleBack}
              >
                <Image
                  source={require('@/assets/images/chevron-left.png')}
                  style={styles.backButtonIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          )}

          {/* Next button */}
          <View style={currentIndex === 0 ? styles.nextButtonContainerSingle : styles.nextButtonContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.nextButton,
                { opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={handleNext}
            >
              <LinearGradient
                colors={['#F708F7', '#C708F7', '#F76B0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonIcon}>→</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    paddingTop: 20,
    paddingHorizontal: 32,
  },
  skipContainer: {
    alignItems: 'center',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  carouselContainer: {
    flex: 1,
  },
  carouselItem: {
    flex: 1,
    paddingHorizontal: 32,
   
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  imageContainer: {
    alignItems: 'center',
  },
  carousalImage: {
    width: 280,
    height: 350,
    borderRadius: 16,
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    backgroundColor: '#8B5CF6',
    width: 32,
  },
  inactiveIndicator: {
    backgroundColor: '#E5E7EB',
    width: 8,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButtonContainer: {
    alignItems: 'flex-start',
  },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#808B95',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonIcon: {
    width: 24,
    height: 24,
  },
  nextButtonContainer: {
    alignItems: 'flex-end',
  },
  nextButtonContainerSingle: {
    alignItems: 'flex-end',
    width: '100%',
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#F708F7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: Fonts.bold,
  },
  swipeHint: {
    alignItems: 'center',
    marginTop: 20,
    opacity: 0.6,
  },
  swipeHintText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    fontStyle: 'italic',
  },
});

