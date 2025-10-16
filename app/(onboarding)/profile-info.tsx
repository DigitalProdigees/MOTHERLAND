import GradientButton from '@/components/ui/gradient-button';
import Header from '@/components/ui/header';
import { Fonts, Icons } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ref, update } from 'firebase/database';
import { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Country {
  name: string;
  code: string;
}

interface State {
  name: string;
  code: string;
}

interface City {
  name: string;
  state: string;
}

export default function ProfileInfoScreen() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userType, setUserType] = useState<string>('dancer');
  
  // Modal states
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  // Sample data for modals
  const countries: Country[] = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Australia', code: 'AU' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Japan', code: 'JP' },
    { name: 'India', code: 'IN' },
  ];

  const states: State[] = [
    { name: 'California', code: 'CA' },
    { name: 'New York', code: 'NY' },
    { name: 'Texas', code: 'TX' },
    { name: 'Florida', code: 'FL' },
    { name: 'Illinois', code: 'IL' },
    { name: 'Pennsylvania', code: 'PA' },
    { name: 'Ohio', code: 'OH' },
    { name: 'Georgia', code: 'GA' },
  ];

  const cities: City[] = [
    { name: 'New York', state: 'NY' },
    { name: 'Los Angeles', state: 'CA' },
    { name: 'Chicago', state: 'IL' },
    { name: 'Houston', state: 'TX' },
    { name: 'Phoenix', state: 'AZ' },
    { name: 'Philadelphia', state: 'PA' },
    { name: 'San Antonio', state: 'TX' },
    { name: 'San Diego', state: 'CA' },
  ];

  const handleImagePicker = async () => {
    try {
      // Show action sheet first
      Alert.alert(
        'Select Profile Picture',
        'Choose an option',
        [
          {
            text: 'Camera',
            onPress: () => pickImageFromCamera(),
          },
          {
            text: 'Photo Library',
            onPress: () => pickImageFromLibrary(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.log('Error requesting image picker:', error);
      Alert.alert('Error', 'Failed to access image picker');
    }
  };

  const pickImageFromCamera = async () => {
    try {
      // Request camera permission first
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.granted === false) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image from camera:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      // Request photo library permission first
      const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (libraryPermission.granted === false) {
        Alert.alert('Permission Required', 'Photo library permission is required to select photos!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image from library:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
    // Reset state and city when country changes
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleStateSelect = (state: State) => {
    setSelectedState(state);
    setShowStateModal(false);
    // Only reset city if the currently selected city doesn't belong to the new state
    if (selectedCity && selectedCity.state !== state.code) {
      setSelectedCity(null);
    }
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setShowCityModal(false);
  };

  // Check if all required fields are filled
  const isFormValid = selectedCountry && selectedState && selectedCity;

  const handleNext = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      // Update user profile in Firebase Realtime Database
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      await update(userRef, {
        country: selectedCountry?.name || '',
        state: selectedState?.name || '',
        city: selectedCity?.name || '',
        profileImageUri: profileImage || '',
        profileCompleted: true,
        profileCompletedAt: new Date().toISOString(),
      });

      console.log('Profile updated successfully');
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Auto navigate to home after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        router.replace('/(home)/home');
      }, 2000);
      
    } catch (error: any) {
      console.log('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    data: any[],
    onSelect: (item: any) => void,
    renderItem: (item: any) => string
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {data.map((item, index) => (
              <Pressable
                key={index}
                style={styles.modalItem}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.modalItemText}>{renderItem(item)}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Profile Informations"
        onBackPress={() => router.back()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <Pressable style={styles.profileImageContainer} onPress={handleImagePicker}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icons.Camera width={40} height={40} />
              </View>
            )}
          </Pressable>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Country */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.inputLabel}>Country</Text>
            <Pressable style={styles.inputField} onPress={() => setShowCountryModal(true)}>
              <View style={styles.inputIcon}>
                <Icons.Country width={24} height={24} />
              </View>
              <Text style={[styles.input, selectedCountry ? styles.selectedText : styles.placeholderText]}>
                {selectedCountry ? selectedCountry.name : 'United States America'}
              </Text>
            </Pressable>
          </View>

      

          {/* State */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.inputLabel}>State</Text>
            <Pressable 
              style={[styles.inputField, !selectedCountry && styles.disabledField]} 
              onPress={() => selectedCountry && setShowStateModal(true)}
            >
              <View style={styles.inputIcon}>
                <Icons.State width={24} height={24} />
              </View>
              <Text style={[styles.input, selectedState ? styles.selectedText : styles.placeholderText]}>
                {selectedState ? selectedState.name : 'Great Street 01'}
              </Text>
            </Pressable>
          </View>

              {/* City */}
              <View style={styles.fieldWrapper}>
            <Text style={styles.inputLabel}>City</Text>
            <Pressable 
              style={[styles.inputField, !selectedCountry && styles.disabledField]} 
              onPress={() => selectedCountry && setShowCityModal(true)}
            >
              <View style={styles.inputIcon}>
                <Icons.City width={24} height={24} />
              </View>
              <Text style={[styles.input, selectedCity ? styles.selectedText : styles.placeholderText]}>
                {selectedCity ? selectedCity.name : 'New York'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <GradientButton
          title={isLoading ? "Saving..." : "Next"}
          onPress={handleNext}
          disabled={isLoading || !isFormValid}
        />
      </View>

      {/* Modals */}
      {renderModal(
        showCountryModal,
        () => setShowCountryModal(false),
        'Select Country',
        countries,
        handleCountrySelect,
        (country) => country.name
      )}

      {renderModal(
        showStateModal,
        () => setShowStateModal(false),
        'Select State',
        states,
        handleStateSelect,
        (state) => state.name
      )}

      {renderModal(
        showCityModal,
        () => setShowCityModal(false),
        'Select City',
        cities,
        handleCitySelect,
        (city) => city.name
      )}

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContainer}>
            <View style={styles.successIconContainer}>
              <Icons.Success width={120} height={120} />
            </View>
            <Text style={styles.successTitle}>Your Profile is</Text>
            <Text style={styles.successSubtitle}>Saved!</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileImageSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginBottom: 40,
  },
  fieldWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledField: {
    opacity: 0.5,
  },
  inputIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  selectedText: {
    color: '#000000',
  },
  placeholderText: {
    color: '#999999',
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,   alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 20,
    maxHeight: '70%',
    minHeight: '50%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666666',
  },
  modalContent: {
    flex: 1,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItemText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal:70,
    paddingVertical:40,
    alignItems: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 25,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
  },
});
