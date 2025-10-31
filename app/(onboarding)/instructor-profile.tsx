import GradientButton from '@/components/ui/gradient-button';
import { Fonts, Icons } from '@/constants/theme';
import { auth, database, storage } from '@/firebase.config';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { onValue, ref, update } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ClassType {
  id: string;
  name: string;
}

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

export default function InstructorProfileScreen() {
  const router = useRouter();
  const [experience, setExperience] = useState('');
  const [selectedClassType, setSelectedClassType] = useState<ClassType | null>(null);
  const [description, setDescription] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Modal states
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showClassTypeModal, setShowClassTypeModal] = useState(false);

  // Class types data (from categories-section.tsx)
  const classTypes: ClassType[] = [
    { id: 'hip-hop', name: 'Hip-Hop' },
    { id: 'belly', name: 'Belly Dance' },
    { id: 'ballet', name: 'Ballet Dance' },
    { id: 'modern', name: 'Modern Dance' },
    { id: 'swing', name: 'Swing' },
    { id: 'contemporary', name: 'Contemporary' },
    { id: 'tap', name: 'Tap Dance' },
    { id: 'jazz', name: 'Jazz Dance' },

  ];

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

  // Fetch existing profile data
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      const unsubscribe = onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Prefill form with existing data
          setExperience(data.experience || '');
          setDescription(data.description || '');
          // Use profileImageUrl first, then fallback to profileImageUri
          setProfileImage(data.profileImageUrl || data.profileImageUri || null);
          
          // Set country
          if (data.country) {
            const country = countries.find(c => c.name === data.country);
            if (country) {
              setSelectedCountry(country);
            }
          }
          
          // Set state
          if (data.state) {
            const state = states.find(s => s.name === data.state);
            if (state) {
              setSelectedState(state);
            }
          }
          
          // Set city
          if (data.city) {
            const city = cities.find(c => c.name === data.city);
            if (city) {
              setSelectedCity(city);
            }
          }
          
          // Set class type
          if (data.classType) {
            const classType = classTypes.find(c => c.name === data.classType);
            if (classType) {
              setSelectedClassType(classType);
            }
          }
        }
        setIsLoadingProfile(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoadingProfile(false);
    }
  }, []);

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

  const handleClassTypeSelect = (classType: ClassType) => {
    setSelectedClassType(classType);
    setShowClassTypeModal(false);
  };

  // Check if all required fields are filled
  const isFormValid = experience.trim() && selectedClassType && description.trim() && selectedCountry && selectedState && selectedCity;

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

      let profileImageUrl = '';

      if (profileImage && !profileImage.startsWith('http')) {
        try {
          console.log('Uploading instructor profile image...');
          // Ensure JPEG and file:// URI
          const manipulated = await ImageManipulator.manipulateAsync(
            profileImage,
            [],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          const response = await fetch(manipulated.uri);
          const blob = await response.blob();
          const filename = `users/${user.uid}/profile/${Date.now()}.jpg`;
          const imageRef = storageRef(storage, filename);
          await uploadBytes(imageRef, blob);
          profileImageUrl = await getDownloadURL(imageRef);
          console.log('Instructor profile image uploaded successfully:', profileImageUrl);
        } catch (uploadError) {
          console.error('Error uploading profile image:', uploadError);
          Alert.alert('Warning', 'Failed to upload profile image. Profile will be saved without image.');
        }
      } else if (profileImage) {
        profileImageUrl = profileImage;
      }

      // Update user profile in Firebase Realtime Database
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      await update(userRef, {
        experience: experience.trim(),
        classType: selectedClassType.name,
        description: description.trim(),
        country: selectedCountry?.name || '',
        state: selectedState?.name || '',
        city: selectedCity?.name || '',
        profileImageUrl: profileImageUrl || '',
        profileImageUri: profileImage || '', // Keep local URI as fallback
        profileCompleted: true,
        profileCompletedAt: new Date().toISOString(),
      });

      console.log('Instructor profile updated successfully');
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Auto navigate to instructor home after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        router.replace('/(instructor)/home');
      }, 2000);
      
    } catch (error: any) {
      console.log('Error updating instructor profile:', error);
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
      animationType="fade"
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

  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Image
            source={require('@/assets/images/chevron-left.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        
        <View style={styles.rightSpacer} />
      </View>

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
       

          {/* Experience */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.inputLabel}>Experience</Text>
            <View style={styles.inputField}>
              <View style={styles.inputIcon}>
                <Icons.Name width={24} height={24} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="3 years"
                placeholderTextColor="#999"
                value={experience}
                onChangeText={setExperience}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Type of Class */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.inputLabel}>Type of Class</Text>
            <Pressable style={styles.inputField} onPress={() => setShowClassTypeModal(true)}>
              <View style={styles.inputIcon}>
                <Icons.Name width={24} height={24} />
              </View>
              <Text style={[styles.input, selectedClassType ? styles.selectedText : styles.placeholderText]}>
                {selectedClassType ? selectedClassType.name : 'Hip-Hop'}
              </Text>
              <View style={styles.dropdownIcon}>
                <Text style={styles.dropdownIconText}>▼</Text>
              </View>
            </Pressable>
          </View>

          {/* Description */}
          <View style={styles.fieldWrapper}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={styles.inputField}>
              <View style={styles.inputIcon}>
                <Icons.Name width={24} height={24} />
              </View>
              <TextInput
                style={styles.input}
                placeholder="I'm Annie Bens, your dedicated conci..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

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
            <Pressable style={styles.inputField} onPress={() => setShowStateModal(true)}>
              <View style={styles.inputIcon}>
                <Icons.State width={24} height={24} />
              </View>
              <Text style={[styles.input, selectedState ? styles.selectedText : styles.placeholderText]}>
                {selectedState ? selectedState.name : 'Great Street 01'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.inputLabel}>City</Text>
            <Pressable style={styles.inputField} onPress={() => setShowCityModal(true)}>
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

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <GradientButton
          title={isLoading ? "Saving..." : "Save"}
          onPress={handleNext}
          disabled={isLoading || !isFormValid}
        />
      </View>

      {/* Modals */}
      {renderModal(
        showClassTypeModal,
        () => setShowClassTypeModal(false),
        'Select Type of Class',
        classTypes,
        handleClassTypeSelect,
        (classType) => classType.name
      )}

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
         
            <Text style={styles.successMessage}>Your profile is </Text>
            <Text style={styles.successMessage}>Saved</Text>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    lineHeight: 38,
    textAlign: 'center',
    color: '#000000',
  },
  rightSpacer: {
    width: 40,
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
    backgroundColor: '#8A53C210',
    borderRadius: 100,
    height: 56,
    paddingHorizontal: 16,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownIconText: {
    fontSize: 12,
    color: '#666666',
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
    paddingVertical:9,
    alignItems: 'center',
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
    paddingHorizontal: 70,
    paddingVertical: 40,
    alignItems: 'center',
    margin: 20,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#8A53C2',
    textAlign: 'center',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 22,
fontWeight:'bold',    color: '#666666',
    textAlign: 'center',

  },
});
