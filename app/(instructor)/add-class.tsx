import InstructorDrawer from '@/components/ui/instructor-drawer';
import { Fonts, Icons } from '@/constants/theme';
import { useInstructorDrawer } from '@/contexts/InstructorDrawerContext';
import { auth } from '@/firebase.config';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface DropdownOption {
  label: string;
  value: string;
}

const categories: DropdownOption[] = [
  { label: 'Hip-Hop', value: 'hiphop' },
  { label: 'Ballet', value: 'ballet' },
  { label: 'Contemporary', value: 'contemporary' },
  { label: 'Jazz', value: 'jazz' },
  { label: 'Salsa', value: 'salsa' },
  { label: 'Swing', value: 'swing' },
  { label: 'Modern', value: 'modern' },
];

const classTypes: DropdownOption[] = [
  { label: 'Group Class', value: 'group' },
  { label: 'Private Lesson', value: 'private' },
  { label: 'Semi-Private', value: 'semi-private' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Masterclass', value: 'masterclass' },
];

const difficultyLevels: DropdownOption[] = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'All Levels', value: 'all' },
];

const locations: DropdownOption[] = [
  { label: 'Studio A - Downtown', value: 'studio-a' },
  { label: 'Studio B - Midtown', value: 'studio-b' },
  { label: 'Studio C - Uptown', value: 'studio-c' },
  { label: 'Outdoor Park', value: 'outdoor' },
  { label: 'Virtual Online', value: 'virtual' },
];

const dates: DropdownOption[] = [
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
  { label: 'This Weekend', value: 'weekend' },
  { label: 'Next Week', value: 'next-week' },
  { label: 'Next Month', value: 'next-month' },
  { label: 'Custom Date', value: 'custom' },
];

const times: DropdownOption[] = [
  { label: '9:00 AM', value: '9:00' },
  { label: '10:00 AM', value: '10:00' },
  { label: '11:00 AM', value: '11:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '1:00 PM', value: '13:00' },
  { label: '2:00 PM', value: '14:00' },
  { label: '3:00 PM', value: '15:00' },
  
];

const subscriberPrices: DropdownOption[] = [
  { label: 'Free', value: '0' },
  { label: '$5', value: '5' },
  { label: '$10', value: '10' },
  { label: '$15', value: '15' },
  { label: '$20', value: '20' },
  { label: '$25', value: '25' },
  { label: '$30', value: '30' },
  { label: '$35', value: '35' },
  { label: '$40', value: '40' },
  { label: '$50', value: '50' },
];

const nonSubscriberPrices: DropdownOption[] = [
  { label: '$10', value: '10' },
  { label: '$15', value: '15' },
  { label: '$20', value: '20' },
  { label: '$25', value: '25' },
  { label: '$30', value: '30' },
  { label: '$35', value: '35' },
  { label: '$40', value: '40' },
  { label: '$50', value: '50' },
  { label: '$60', value: '60' },
  { label: '$75', value: '75' },
  { label: '$100', value: '100' },
];

export default function AddClassScreen() {
  const router = useRouter();
  const { isInstructorDrawerOpen, setIsInstructorDrawerOpen } = useInstructorDrawer();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    classType: '',
    difficulty: '',
    subscriberPrice: '',
    nonSubscriberPrice: '',
    date: '',
    time: '',
    location: '',
  });

  const [showDropdowns, setShowDropdowns] = useState({
    category: false,
    classType: false,
    difficulty: false,
    subscriberPrice: false,
    nonSubscriberPrice: false,
    date: false,
    time: false,
    location: false,
  });

  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [requirementsModalVisible, setRequirementsModalVisible] = useState(false);
  const [cancellationModalVisible, setCancellationModalVisible] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDropdownSelect = (field: string, option: DropdownOption) => {
    setFormData(prev => ({ ...prev, [field]: option.label }));
    setShowDropdowns(prev => ({ ...prev, [field]: false }));
  };

  const toggleDropdown = (field: keyof typeof showDropdowns) => {
    setShowDropdowns(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageUpload = () => {
    Alert.alert('Image Upload', 'Image upload functionality will be implemented soon!');
  };

  const handlePreview = () => {
    Alert.alert('Preview', 'Preview functionality will be implemented soon!');
  };

  const handleSaveDraft = () => {
    Alert.alert('Save Draft', 'Class saved as draft successfully!');
  };

  const handlePublish = () => {
    Alert.alert('Publish', 'Class published successfully!');
    router.back();
  };

  const handleMenuPress = () => {
    setIsInstructorDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsInstructorDrawerOpen(false);
  };

  const handleDrawerMenuPress = (menuItem: string) => {
    console.log('Drawer menu pressed:', menuItem);
    setIsInstructorDrawerOpen(false);
    
    // Add navigation logic for different menu items
    switch (menuItem) {
      case 'My Classes':
        router.push('/(instructor)/home');
        break;
      case 'Add New Class':
        router.push('/(instructor)/add-class');
        break;
      case 'Class Analytics':
        // Add navigation to analytics screen
        break;
      case 'My Students':
        // Add navigation to students screen
        break;
      case 'Switch as Student':
        router.push('/(home)/home');
        break;
      case 'My Earnings':
        // Add navigation to earnings screen
        break;
      case 'Payment Settings':
        // Add navigation to payment settings screen
        break;
      case 'My Favourites':
        router.push('/ins-settings/favourites');
        break;
      case 'Subscriptions':
        router.push('/ins-settings/my-subscriptions');
        break;
      case 'Change Password':
        router.push('/ins-settings/change-password');
        break;
      case 'Contact Us':
        router.push('/ins-settings/contact-us');
        break;
      case 'Terms of services':
        router.push('/ins-settings/terms-conditions');
        break;
      case 'Privacy Policy':
        router.push('/ins-settings/privacy-policy');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        try {
          setIsInstructorDrawerOpen(false);
          await auth.signOut();
          router.replace('/(auth)/signin');
        } catch (error) {
          console.log('Error signing out:', error);
          Alert.alert('Error', 'Failed to logout. Please try again.');
        }
      }}
    ]);
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

  const handleTabPress = (tabName: string) => {
    console.log('Tab pressed:', tabName);
  };

  const handleBookingOptionPress = (option: string) => {
    switch (option) {
      case 'terms':
        setTermsModalVisible(true);
        break;
      case 'requirements':
        setRequirementsModalVisible(true);
        break;
      case 'cancellation':
        setCancellationModalVisible(true);
        break;
    }
  };

  const closeTermsModal = () => {
    setTermsModalVisible(false);
  };

  const closeRequirementsModal = () => {
    setRequirementsModalVisible(false);
  };

  const closeCancellationModal = () => {
    setCancellationModalVisible(false);
  };

  const renderDropdown = (field: keyof typeof showDropdowns, options: DropdownOption[], placeholder: string) => (
    <View style={styles.dropdownContainer}>
      <Pressable
        style={styles.dropdownButton}
        onPress={() => toggleDropdown(field)}
      >
        <Text style={[styles.dropdownText, formData[field] ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder]}>
          {formData[field] || placeholder}
        </Text>
        <Image
          source={require('@/assets/images/chevron-left.png')}
          style={[styles.chevronIcon, showDropdowns[field] && styles.chevronIconRotated]}
          resizeMode="contain"
        />
      </Pressable>
      {showDropdowns[field] && (
        <View style={styles.dropdownList}>
          {options.map((option, index) => (
            <Pressable
              key={index}
              style={styles.dropdownItem}
              onPress={() => handleDropdownSelect(field, option)}
            >
              <Text style={styles.dropdownItemText}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.menuButton} onPress={handleMenuPress}>
            <Image
              source={require('@/assets/images/insDrawer.png')}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable style={styles.headerIcon} onPress={handleAddPress}>
              <Image
                source={require('@/assets/images/insAdd.png')}
                style={styles.headerIconImage}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable style={styles.headerIcon} onPress={handleSearchPress}>
              <Image
                source={require('@/assets/images/insSearch.png')}
                style={styles.headerIconImage}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable style={styles.headerIcon} onPress={handleNotificationPress}>
              <Image
                source={require('@/assets/images/insBell.png')}
                style={styles.headerIconImage}
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.headerBottom}>
          <Text style={styles.headerTitle}>Class information</Text>
          <Pressable style={styles.previewButton} onPress={handlePreview}>
            <LinearGradient
              colors={['#F708F7', '#C708F7', '#F76B0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.previewButtonGradient}
            >
              <Text style={styles.previewButtonText}>Preview</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Upload Section */}
        <Pressable style={styles.imageUploadContainer} onPress={handleImageUpload}>
          <Image
            source={require('@/assets/images/upload1.png')}
            style={styles.uploadIcon}
            resizeMode="contain"
          />
          <Text style={styles.uploadText}>Upload an image</Text>
        </Pressable>

        {/* Class Information Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Class information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.textInput}
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
              placeholder="Enter class title"
              placeholderTextColor="#999999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Enter class description"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Select category</Text>
            {renderDropdown('category', categories, 'Select category')}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Type of class</Text>
            {renderDropdown('classType', classTypes, 'Type of class')}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Add Difficulty Level</Text>
            {renderDropdown('difficulty', difficultyLevels, 'Add Difficulty Level')}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price per person (Discount for subscribers)</Text>
            {renderDropdown('subscriberPrice', subscriberPrices, 'Price per person (Discount for subscribers)')}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price per person (Non subscribers)</Text>
            {renderDropdown('nonSubscriberPrice', nonSubscriberPrices, 'Price per person (Non subscribers)')}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            {renderDropdown('date', dates, 'Date')}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Time</Text>
            {renderDropdown('time', times, 'Time')}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Location</Text>
            {renderDropdown('location', locations, 'Location')}
          </View>
        </View>

        {/* Booking Section */}
        <View style={styles.bookingSection}>
          <Text style={styles.sectionTitle}>Booking</Text>
          <View style={styles.bookingCard}>
            <Pressable style={styles.bookingItem} onPress={() => handleBookingOptionPress('terms')}>
              <Text style={styles.bookingItemText}>Terms and Conditions</Text>
            </Pressable>
            <View style={styles.bookingDivider} />
            <Pressable style={styles.bookingItem} onPress={() => handleBookingOptionPress('requirements')}>
              <Text style={styles.bookingItemText}>Guest requirements</Text>
            </Pressable>
            <View style={styles.bookingDivider} />
            <Pressable style={styles.bookingItem} onPress={() => handleBookingOptionPress('cancellation')}>
              <Text style={styles.bookingItemText}>Cancellation policy</Text>
            </Pressable>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.saveDraftButton} onPress={handleSaveDraft}>
            <LinearGradient
              colors={['#F708F7', '#C708F7', '#F76B0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveDraftButtonGradient}
            >
              <View style={styles.saveDraftButtonInner}>
                <Text style={styles.saveDraftButtonText}>Save & Draft</Text>
              </View>
            </LinearGradient>
          </Pressable>
          <Pressable style={styles.publishButton} onPress={handlePublish}>
            <LinearGradient
              colors={['#F708F7', '#C708F7', '#F76B0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.publishButtonGradient}
            >
              <Text style={styles.publishButtonText}>Publish</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <LinearGradient
        colors={['#F708F7', '#C708F7', '#F76B0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bottomNavigation}
      >
        <Pressable 
          style={styles.tabButton} 
          onPress={() => handleTabPress('home')}
        >
          <View style={styles.tabIconContainer}>
            <Icons.Home width={24} height={24} color="#FFFFFF" />
          </View>
          <Text style={styles.tabLabel}>Home</Text>
        </Pressable>
        
        <Pressable 
          style={styles.tabButton} 
          onPress={() => handleTabPress('classes')}
        >
          <View style={styles.tabIconContainer}>
            <Icons.Classes width={24} height={24} color="#FFFFFF" />
            <View style={styles.activeIndicator} />
          </View>
          <Text style={styles.tabLabel}>Classes</Text>
        </Pressable>
        
        <Pressable 
          style={styles.tabButton} 
          onPress={() => handleTabPress('community')}
        >
          <View style={styles.tabIconContainer}>
            <Icons.Community width={24} height={24} color="#FFFFFF" />
          </View>
          <Text style={styles.tabLabel}>Community</Text>
        </Pressable>
        
        <Pressable 
          style={styles.tabButton} 
          onPress={() => handleTabPress('profile')}
        >
          <View style={styles.tabIconContainer}>
            <Icons.Profile width={24} height={24} color="#FFFFFF" />
          </View>
          <Text style={styles.tabLabel}>Profile</Text>
        </Pressable>
      </LinearGradient>

      {/* Terms and Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={closeTermsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
              <Pressable style={styles.closeButton} onPress={closeTermsModal}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalText}>
                1. CLASS BOOKING{'\n'}
                • All classes must be booked in advance through our platform{'\n'}
                • Bookings are confirmed upon payment receipt{'\n'}
                • Class capacity is limited and subject to availability{'\n\n'}

                2. PAYMENT TERMS{'\n'}
                • Payment is required at the time of booking{'\n'}
                • Refunds are subject to our cancellation policy{'\n'}
                • Prices may vary for subscribers vs non-subscribers{'\n\n'}

                3. ATTENDANCE{'\n'}
                • Students must arrive 10 minutes before class start time{'\n'}
                • Late arrivals may not be admitted after class begins{'\n'}
                • No-shows will be charged the full class fee{'\n\n'}

                4. CONDUCT{'\n'}
                • Respectful behavior is required at all times{'\n'}
                • Follow instructor directions and safety guidelines{'\n'}
                • No recording or photography without permission{'\n\n'}

                5. HEALTH & SAFETY{'\n'}
                • Inform instructor of any injuries or health conditions{'\n'}
                • Follow all safety protocols and guidelines{'\n'}
                • Use of facilities is at your own risk{'\n\n'}

                6. MODIFICATIONS{'\n'}
                • We reserve the right to modify class schedules{'\n'}
                • Changes will be communicated with 24-hour notice{'\n'}
                • Alternative arrangements will be provided when possible
              </Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable style={styles.doneButton} onPress={closeTermsModal}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.doneButtonGradient}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Guest Requirements Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={requirementsModalVisible}
        onRequestClose={closeRequirementsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Guest Requirements</Text>
              <Pressable style={styles.closeButton} onPress={closeRequirementsModal}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalText}>
                1. AGE REQUIREMENTS{'\n'}
                • Minimum age: 16 years old{'\n'}
                • Parental consent required for students under 18{'\n'}
                • Adult supervision required for minors{'\n\n'}

                2. SKILL LEVEL{'\n'}
                • Classes are designed for specific skill levels{'\n'}
                • Please select appropriate difficulty level{'\n'}
                • Beginners welcome in designated classes{'\n\n'}

                3. ATTIRE & EQUIPMENT{'\n'}
                • Comfortable dance attire required{'\n'}
                • Appropriate footwear (dance shoes recommended){'\n'}
                • Water bottle recommended{'\n'}
                • No loose jewelry or accessories{'\n\n'}

                4. HEALTH REQUIREMENTS{'\n'}
                • Good physical condition recommended{'\n'}
                • Inform instructor of any injuries or limitations{'\n'}
                • Medical clearance may be required for certain classes{'\n\n'}

                5. REGISTRATION{'\n'}
                • Valid ID required for first-time students{'\n'}
                • Emergency contact information must be provided{'\n'}
                • Waiver forms must be completed before participation{'\n\n'}

                6. BEHAVIOR EXPECTATIONS{'\n'}
                • Respectful and positive attitude{'\n'}
                • Follow instructor directions{'\n'}
                • Maintain appropriate personal space{'\n'}
                • No disruptive behavior will be tolerated
              </Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable style={styles.doneButton} onPress={closeRequirementsModal}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.doneButtonGradient}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancellation Policy Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cancellationModalVisible}
        onRequestClose={closeCancellationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cancellation Policy</Text>
              <Pressable style={styles.closeButton} onPress={closeCancellationModal}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalText}>
                1. CANCELLATION TIME FRAMES{'\n'}
                • 24+ hours notice: Full refund or credit{'\n'}
                • 12-24 hours notice: 50% refund or credit{'\n'}
                • Less than 12 hours: No refund, credit may be offered{'\n\n'}

                2. REFUND PROCESS{'\n'}
                • Refunds processed within 5-7 business days{'\n'}
                • Original payment method will be used{'\n'}
                • Processing fees may apply{'\n\n'}

                3. CREDIT OPTIONS{'\n'}
                • Class credits valid for 6 months{'\n'}
                • Transferable to other class types{'\n'}
                • No expiration for emergency situations{'\n\n'}

                4. EMERGENCY CANCELLATIONS{'\n'}
                • Medical emergencies: Full refund or credit{'\n'}
                • Weather-related cancellations: Full refund{'\n'}
                • Instructor illness: Alternative class or refund{'\n\n'}

                5. NO-SHOW POLICY{'\n'}
                • No-shows forfeit class payment{'\n'}
                • No credits or refunds for no-shows{'\n'}
                • Repeated no-shows may result in booking restrictions{'\n\n'}

                6. MODIFICATION REQUESTS{'\n'}
                • Class changes subject to availability{'\n'}
                • 24-hour notice required for modifications{'\n'}
                • Additional fees may apply for last-minute changes{'\n\n'}

                7. SPECIAL CIRCUMSTANCES{'\n'}
                • Contact us immediately for special situations{'\n'}
                • We will work with you to find solutions{'\n'}
                • Case-by-case basis for unique circumstances
              </Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <Pressable style={styles.doneButton} onPress={closeCancellationModal}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.doneButtonGradient}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Instructor Drawer */}
      <InstructorDrawer
        isOpen={isInstructorDrawerOpen}
        onClose={handleDrawerClose}
        onMenuPress={handleDrawerMenuPress}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:-40,
    backgroundColor: '#FFFFFF',
  },
  // Header styles
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  menuButton: {
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    padding: 8,
  },
  headerIconImage: {
    marginRight:-10,
    width: 44,
    height: 44,
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  previewButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  previewButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  previewButtonText: {
    fontSize: 14,
fontWeight:'bold',    color: '#FFFFFF',
  },
  // Content styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Image upload styles
  imageUploadContainer: {
    height: 200,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginVertical: 20,
  },
  uploadIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#666666',
  },
  // Form section styles
  formSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  // Dropdown styles
  dropdownContainer: {
    position: 'relative',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  dropdownTextSelected: {
    color: '#000000',
  },
  dropdownTextPlaceholder: {
    color: '#999999',
  },
  chevronIcon: {
    width: 16,
    height: 16,
    transform: [{ rotate: '270deg' }],
  },
  chevronIconRotated: {
    transform: [{ rotate: '270deg' }],
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  // Booking section styles
  bookingSection: {
    marginBottom: 30,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  bookingItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  bookingItemText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  bookingDivider: {
    height: 1,
    backgroundColor: '#8A53C2',
    marginHorizontal: 16,
  },
  // Action buttons styles
  actionButtons: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 30,
  },
  saveDraftButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  saveDraftButtonGradient: {
    padding: 2,
  },
  saveDraftButtonInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 98,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveDraftButtonText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#C708F7',
  },
  publishButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  publishButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  publishButtonText: {
    fontSize: 16,
fontWeight:'bold',    color: '#FFFFFF',
  },
  // Bottom navigation styles
  bottomNavigation: {
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: 4,
    color: '#FFFFFF',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: '80%',
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: Fonts.medium,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#333333',
    lineHeight: 22,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopColor: '#E0E0E0',
  },
  doneButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  doneButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});
