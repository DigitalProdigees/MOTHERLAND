import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Animated, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [currentSection, setCurrentSection] = useState(1);
  
  // Animation values for each indicator
  const indicator1Width = useState(new Animated.Value(1))[0];
  const indicator1Opacity = useState(new Animated.Value(1))[0];
  const indicator2Width = useState(new Animated.Value(0.3))[0];
  const indicator2Opacity = useState(new Animated.Value(0.3))[0];
  const indicator3Width = useState(new Animated.Value(0.3))[0];
  const indicator3Opacity = useState(new Animated.Value(0.3))[0];

  const animateIndicators = (newSection: number) => {
    const duration = 100;
    
    // Reset all indicators to inactive state
    const resetAnimations = [
      Animated.parallel([
        Animated.timing(indicator1Width, { toValue: 0.3, duration, useNativeDriver: false }),
        Animated.timing(indicator1Opacity, { toValue: 0.3, duration, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.timing(indicator2Width, { toValue: 0.3, duration, useNativeDriver: false }),
        Animated.timing(indicator2Opacity, { toValue: 0.3, duration, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.timing(indicator3Width, { toValue: 0.3, duration, useNativeDriver: false }),
        Animated.timing(indicator3Opacity, { toValue: 0.3, duration, useNativeDriver: false }),
      ]),
    ];

    // Animate the active indicator
    let activeAnimation: Animated.CompositeAnimation | null = null;
    switch (newSection) {
      case 1:
        activeAnimation = Animated.parallel([
          Animated.timing(indicator1Width, { toValue: 1, duration, useNativeDriver: false }),
          Animated.timing(indicator1Opacity, { toValue: 1, duration, useNativeDriver: false }),
        ]);
        break;
      case 2:
        activeAnimation = Animated.parallel([
          Animated.timing(indicator2Width, { toValue: 1, duration, useNativeDriver: false }),
          Animated.timing(indicator2Opacity, { toValue: 1, duration, useNativeDriver: false }),
        ]);
        break;
      case 3:
        activeAnimation = Animated.parallel([
          Animated.timing(indicator3Width, { toValue: 1, duration, useNativeDriver: false }),
          Animated.timing(indicator3Opacity, { toValue: 1, duration, useNativeDriver: false }),
        ]);
        break;
    }

    // Run animations
    Animated.parallel(resetAnimations).start(() => {
      if (activeAnimation) {
        activeAnimation.start();
      }
    });
  };

  const handleNext = () => {
    if (currentSection < 3) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      animateIndicators(newSection);
    } else {
      // Navigate to signin after section 3
      router.replace('/(auth)/signin');
    }
  };

  const handleBack = () => {
    if (currentSection > 1) {
      const newSection = currentSection - 1;
      setCurrentSection(newSection);
      animateIndicators(newSection);
    }
  };

  const handleSkip = () => {
    // Navigate directly to signin
    router.replace('/(auth)/signin');
  };

  const getSectionContent = () => {
    switch (currentSection) {
      case 1:
        return {
          title: 'Lorem ipsum dolor',
          subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
          imageUri: 'https://picsum.photos/300/400?random=1', // Placeholder image
        };
      case 2:
        return {
          title: 'Explore Great Music',
          subtitle: 'Browse through our curated collection of authentic sounds',
          imageUri: 'https://picsum.photos/300/400?random=2',
        };
      case 3:
        return {
          title: 'Start Your Journey',
          subtitle: 'Create your account and dive into the world of MotherLand Jams',
          imageUri: 'https://picsum.photos/300/400?random=3',
        };
      default:
        return {
          title: '',
          subtitle: '',
          imageUri: '',
        };
    }
  };

  const content = getSectionContent();
  const nextButtonText = 'Next';

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

      {/* Content area */}
      <View style={styles.contentArea}>
        {/* Title */}
        <Text style={styles.title}>{content.title}</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>{content.subtitle}</Text>
        
        {/* Placeholder Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: content.imageUri }}
            style={styles.placeholderImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Fixed bottom section */}
      <View style={styles.bottomSection}>
        {/* Progress indicator dots */}
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.indicator,
              currentSection === 1 ? styles.activeIndicator : styles.inactiveIndicator,
              {
                width: indicator1Width.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [12, 32],
                }),
                opacity: indicator1Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.indicator,
              currentSection === 2 ? styles.activeIndicator : styles.inactiveIndicator,
              {
                width: indicator2Width.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [12, 32],
                }),
                opacity: indicator2Opacity,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.indicator,
              currentSection === 3 ? styles.activeIndicator : styles.inactiveIndicator,
              {
                width: indicator3Width.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [12, 32],
                }),
                opacity: indicator3Opacity,
              },
            ]}
          />
        </View>

        {/* Navigation buttons */}
        <View style={styles.navigationContainer}>
          {/* Back button - only show for sections 2 and 3 */}
          {currentSection > 1 && (
            <View style={styles.backButtonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.backButton,
                  { opacity: pressed ? 0.8 : 1 }
                ]}
                onPress={handleBack}
              >
                <Text style={styles.backButtonIcon}>←</Text>
              </Pressable>
            </View>
          )}

          {/* Next button - positioned right for section 1, right for sections 2-3 */}
          <View style={currentSection === 1 ? styles.nextButtonContainerSingle : styles.nextButtonContainer}>
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
    fontWeight: '500',
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  placeholderImage: {
    width: 280,
    height: 350,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
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
    color: '#808B95',
    fontSize: 24,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
});

