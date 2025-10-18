import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TermsConditions: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleDone = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('@/assets/images/chevron-left.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.subtitle}>Last Update 18/05/2023</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Section 1 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Title 1</Text>
            <Text style={styles.sectionText}>
              Lorem ipsum dolor sit amet consectetur. At sit tellus vel tortor egestas velit luctus arcu. Lacus quam aliquam ac massa natoque gravida justo.Neque aliquam potenti leo mi sit lobortis sed. Aliquam ut a ultricies lacus nullam nisl sem. Non accumsan etiam vitae neque sit massa at cras. Donec quisque lacus venenatis lectus aliquam eget.
            </Text>
          </View>

          {/* Section 2 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2</Text>
            <Text style={styles.sectionText}>
              Lorem ipsum dolor sit amet consectetur. At sit tellus vel tortor egestas velit luctus arcu. Lacus quam aliquam ac massa natoque gravida justo.Neque aliquam potenti leo mi sit lobortis sed. Aliquam ut a ultricies lacus nullam nisl sem. Non accumsan etiam vitae neque sit massa at cras. Donec quisque lacus venenatis lectus aliquam eget.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Done Button */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.doneButton} onPress={handleDone}>
          <LinearGradient
            colors={['#F708F7', '#C708F7', '#F76B0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 8,
  },
  backButton: {
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  doneButton: {
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#C708F7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  doneButtonText: {
    fontSize: 18,
fontWeight:'500',
    color: '#FFFFFF',
  },
});

export default TermsConditions;