import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

interface SubscriptionOption {
  id: string;
  title: string;
  price: string;
  icon: any;
  gradient?: string[];
  isSelected?: boolean;
}

const subscriptionOptions: SubscriptionOption[] = [
  {
    id: 'free-trial',
    title: 'Free Trial 7 Days',
    price: 'Free',
    icon: require('@/assets/images/free.png'),
  },
  {
    id: 'monthly',
    title: 'Monthly - $9.99',
    price: '$9.99/month',
    icon: require('@/assets/images/month.png'),
    gradient: ['#F708F7', '#C708F7', '#F76B0B'],
    isSelected: true,
  },
  {
    id: 'yearly',
    title: 'Yearly - $99.99',
    price: '$99.99/year',
    icon: require('@/assets/images/yearly.png'),
  },
];

export default function InstructorSubscriptionScreen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('monthly');

  const handleSubscriptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
    // Navigate to instructor profile setup
    router.push('/(onboarding)/instructor-profile');
  };

  const handleBack = () => {
    router.back();
  };

  const renderSubscriptionOption = (option: SubscriptionOption) => {
    const isSelected = selectedOption === option.id;
    
    return (
      <Pressable
        key={option.id}
        style={styles.subscriptionCard}
        onPress={() => handleSubscriptionSelect(option.id)}
      >
        {(() => {
          const gradientColors = (isSelected
            ? (option.gradient ?? ['#F708F7', '#C708F7', '#F76B0B'])
            : ['rgba(247, 8, 247, 0.03)', 'rgba(95, 1, 95, 0.03)']) as [string, string, ...string[]];
          return (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Image
                source={option.icon}
                style={styles.subscriptionIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={[
              styles.subscriptionTitle,
              isSelected && styles.selectedText
            ]}>
              {option.title}
            </Text>
            <Text style={[
              styles.subscriptionPrice,
              isSelected && styles.selectedText
            ]}>
              {option.price}
            </Text>
          </View>
        </LinearGradient>
          );
        })()}
      </Pressable>
    );
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

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select Your Subscriptions</Text>
        </View>

        {/* Subscription Options */}
        <View style={styles.subscriptionContainer}>
          {subscriptionOptions.map(renderSubscriptionOption)}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Pressable style={styles.continueButton} onPress={handleContinue}>
          <LinearGradient
            colors={['#F708F7', '#C708F7', '#F76B0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom:-40,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
  },
  subscriptionContainer: {
    gap: 16,
    marginBottom: 40,
  },
  subscriptionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionIcon: {
    width:60,
    height: 60,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#8A53C2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subscriptionPrice: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#8A53C2',
    textAlign: 'center',
  },
  selectedText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  continueButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});
