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

export default function MySubscriptionsScreen() {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleManageSubscription = () => {
    console.log('Manage subscription pressed');
  };

  const handleSelectPackages = () => {
    console.log('Select other packages pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <Image
              source={require('@/assets/images/chevron-left.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description Text */}
        <Text style={styles.headerTitle}>My Subsciptions</Text>

        <Text style={styles.descriptionText}>

          Lorem ipsum dolor sit amet consectetur. At sit tellus vel tortor egestas velit luctus arcu.
        </Text>

        {/* Subscription Card */}
        <View style={styles.subscriptionCard}>
          <LinearGradient
            colors={['#C708F7', '#F708F7', '#FF6A0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Image
                  source={require('@/assets/images/subscribtion.png')}
                  style={styles.subscriptionIcon}
                  resizeMode="contain"
                />
              </View>
              
              {/* Subscription Details */}
              <Text style={styles.subscriptionTitle}>Monthly - 9.99</Text>
              <Text style={styles.renewalDate}>End in 1 Jan 2024</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Action Buttons - Fixed at Bottom */}
      <View style={styles.bottomButtonContainer}>
        <Pressable style={styles.manageButton} onPress={handleManageSubscription}>
          <Text style={styles.manageButtonText}>Manage Subscription From Apple</Text>
        </Pressable>
        
        <Pressable style={styles.selectButton} onPress={handleSelectPackages}>
          <Text style={styles.selectButtonText}>Select Other Packages</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  backButton: {
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 28,
fontWeight:'bold',    color: '#333333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal:10,
    marginBottom: 40,
    marginTop: 10,
    
  },
  subscriptionCard: {
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    padding: 32,
    alignItems: 'center',
  },
  cardContent: {
    alignItems: 'center',
  },
  iconContainer: {
   
  },
  subscriptionIcon: {
    width: 80,
    height: 80,
    marginBottom:20,
  },
  subscriptionTitle: {
    fontSize: 28,
    fontWeight:'600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  renewalDate: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomButtonContainer: {
  paddingHorizontal:30,
    backgroundColor: '#FFFFFF',
    paddingBottom:20,
    gap: 16,
  },
  manageButton: {
    backgroundColor: 'rgba(255, 0, 247, 0.04)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#C708F7',
  },
  selectButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C708F7',
  },
  selectButtonText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#C708F7',
  },
});
