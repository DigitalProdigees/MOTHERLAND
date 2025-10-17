import Back from '@/assets/svg/Back';
import Star from '@/assets/svg/Star';
import GradientBackground from '@/components/ui/gradient-background';
import { Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ClassBookingScreen() {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  const handleConfirmPress = () => {
    console.log('Confirm booking pressed');
    // Add booking confirmation logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackPress}>
          <Back width={24} height={24} color="#8B5CF6" />
        </Pressable>
        <Text style={styles.headerTitle}>Booking</Text>
        <Pressable style={styles.bookmarkButton}>
          <Image 
            source={require('@/assets/images/bookmark.png')}
            style={styles.bookmarkIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Class Details Card */}
        <View style={styles.classCard}>
          <Image 
            source={require('@/assets/images/streetcard.png')}
            style={styles.classImage}
            resizeMode="cover"
          />
          <View style={styles.classOverlay}>
            <Image 
              source={require('@/assets/images/hipHop2.png')}
              style={styles.categoryIcon}
              resizeMode="contain"
            />
            <Text style={styles.categoryText}>Hip-Hop</Text>
          </View>
          <View style={styles.classInfo}>
            <View style={styles.titlePriceRow}>
              <Text style={styles.classTitle}>Street Dance Basics</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>$0</Text>
                <View style={styles.subscribersButton}>
                  <Text style={styles.subscribersText}>Subscribers</Text>
                </View>
              </View>
            </View>
            <Text style={styles.classDescription}>
              Lorem ipsum dolor sit amet risus phasellus. Morbi Lorem ipsum dolor sit amet risus phasellus.
            </Text>
            <View style={styles.ratingDurationRow}>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>4.9</Text>
                <View style={styles.stars}>
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} width={16} height={16} />
                  ))}
                </View>
              </View>
              <View style={styles.durationContainer}>
                <Image 
                  source={require('@/assets/images/clock.png')}
                  style={styles.durationIcon}
                  resizeMode="contain"
                />
                <Text style={styles.durationText}>45 min</Text>
              </View>
            </View>
            <View style={styles.instructorRow}>
              <Text style={styles.instructorLabel}>Instructor:</Text>
              <View style={styles.instructorContainer}>
                <Image 
                  source={require('@/assets/images/annie-bens.png')}
                  style={styles.instructorAvatar}
                  resizeMode="cover"
                />
                <Text style={styles.instructorName}>James Ray</Text>
              </View>
            </View>
            <View style={styles.seatAvailabilityContainer}>
              <Image 
                source={require('@/assets/images/availability.png')}
                style={styles.seatIcon}
                resizeMode="contain"
              />
              <Text style={styles.seatAvailabilityText}>Seat Availability</Text>
              <Text style={styles.seatCount}>10 available</Text>
            </View>
          </View>
        </View>

        {/* Schedule Section */}
        <View style={styles.section}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <Pressable>
              <GradientBackground style={styles.changeButton}>
                <Text style={styles.changeButtonText}>Change</Text>
              </GradientBackground>
            </Pressable>
          </View>
          <View style={styles.scheduleCards}>
            <View style={styles.scheduleCard}>
              <Image 
                source={require('@/assets/images/emptyClock.png')}
                style={styles.scheduleIcon}
                resizeMode="contain"
              />
              <Text style={styles.scheduleText}>10:00 am</Text>
            </View>
            <View style={styles.scheduleCard}>
              <Image 
                source={require('@/assets/images/emptyClock.png')}
                style={styles.scheduleIcon}
                resizeMode="contain"
              />
              <Text style={styles.scheduleText}>Wed, Jul 12, 10:00</Text>
            </View>
          </View>
        </View>

        {/* Pricing Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Details</Text>
          <View style={styles.pricingCard}>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>$3500 USD x 1 day</Text>
              <Text style={styles.pricingValue}>$3,500 USD</Text>
            </View>
            <View style={styles.pricingRow}>
              <View style={styles.pricingLabelContainer}>
                <Text style={styles.pricingLabel}>Arbo service fee</Text>
                <Image 
                  source={require('@/assets/images/iinfo.png')}
                  style={styles.infoIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.pricingValue}>$262 USD</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Tax</Text>
              <Text style={styles.pricingValue}>$210 USD</Text>
            </View>
            <View style={styles.pricingRow}>
              <View style={styles.pricingLabelContainer}>
                <Text style={styles.creditValue}>Credits</Text>
                <Image 
                  source={require('@/assets/images/iinfo.png')}
                  style={styles.infoIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.pricingValue, styles.creditsValue]}>$1750.0 ARD</Text>
            </View>
            <View style={styles.pricingDivider} />
            <View style={styles.pricingRow}>
              <Text style={styles.totalLabel}>Total USD</Text>
              <Text style={styles.totalValue}>$3,972 USD</Text>
            </View>
          </View>
        </View>

        {/* Add Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add payment method</Text>
          <View style={styles.paymentMethods}>
            <View style={styles.paymentCard}>
              <Image 
                source={require('@/assets/images/credit-card.png')}
                style={styles.paymentIcon}
                resizeMode="contain"
              />
              <Text style={styles.paymentText}>Thu, Jul 6, 10:00</Text>
              <Pressable style={styles.addButton}>
                <Image 
                  source={require('@/assets/images/plusAddG.png')}
                  style={styles.addIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
            <View style={styles.paymentCard}>
              <Image 
                source={require('@/assets/images/debitCard.png')}
                style={styles.paymentIcon}
                resizeMode="contain"
              />
              <Text style={styles.paymentText}>Thu, Jul 6, 10:00</Text>
              <Pressable style={styles.addButton}>
                <Image 
                  source={require('@/assets/images/plusAddG.png')}
                  style={styles.addIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Cancellation Policy Section */}
        <View style={styles.section}>
          <View style={styles.policyCard}>
          <Text style={styles.sectionTitle}>Cancellation Policy</Text>

            <Text style={styles.policyText}>
              • Cancel before July 4 for a partial refund. After that, this reservation is non-refundable.
            </Text>
            <Text style={styles.learnMoreText}>Learn More</Text>
          </View>
        </View>

        {/* Host Confirmation Section */}
        <View style={styles.section}>
          <View style={styles.confirmationCard}>
          <Text style={styles.sectionTitle}>Host Confirmation</Text>

            <Text style={styles.confirmationText}>
              • Your reservation won't be confirmed until the host accept your request (within 24 hours).
            </Text>
            <Text style={styles.confirmationText}>
              • You won't be charged until then.
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <Pressable onPress={handleConfirmPress} style={styles.confirmButtonContainer}>
          <GradientBackground style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </GradientBackground>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:-40,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    minHeight: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  classImage: {
    width: '100%',
    height: 200,
  },
  classOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 121, 121, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  classInfo: {
    padding: 16,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  classTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
  },
  classDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingDurationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  subscribersButton: {
    backgroundColor: 'rgb(128, 139, 149,0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  subscribersText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#222222',
  },
  instructorLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#808B95',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationIcon: {
    width: 20,
    height: 20,
  },
  durationText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instructorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 12,
  },
  instructorName: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  seatAvailabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatIcon: {
    width: 20,
    height: 20,
  },
  seatAvailabilityText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#808B95',
  },
  seatCount: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
    marginLeft: 'auto',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom:20,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleCards: {
    gap: 8,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  scheduleIcon: {
    width: 20,
    height:20,
  },
  scheduleText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  changeButton: {
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  changeButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pricingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pricingLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  creditValue:{
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#28A745',
  },
  pricingValue: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  creditsValue: {
    color: '#28A745',
  },
  infoIcon: {
    width: 10,
    height: 10,
    right:5,
    bottom:5,
  },
  pricingDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  paymentMethods: {
    gap: 8,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  paymentIcon: {
    width: 24,
    height: 24,
  },
  paymentText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    flex: 1,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 24,
    height: 24,
  },
  policyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  policyText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    lineHeight: 20,
  },
  learnMoreText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#F708F7',
  },
  confirmationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  confirmationText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 4,
  },
  confirmButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  confirmButton: {
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});
