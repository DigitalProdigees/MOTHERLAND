import { Fonts } from '@/constants/theme';
import { auth, database, storage } from '@/firebase.config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { get, push, ref, remove, set } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { Alert, Dimensions, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as any;
  const isEditMode = params?.editMode === 'true';
  const listingId = params?.listingId as string;
  const listingStatus = params?.status as string;
  const isDraftStatus = listingStatus === 'draft';
  
  const [formData, setFormData] = useState({
    title: params?.title as string || '',
    description: params?.description as string || '',
    availableSeats: params?.availableSeats as string || '',
    category: params?.category as string || '',
    classType: params?.classType as string || '',
    difficulty: params?.difficulty as string || '',
    subscriberPrice: params?.subscriberPrice as string || '$',
    nonSubscriberPrice: params?.nonSubscriberPrice as string || '$',
    date: params?.date as string || '',
    time: params?.time as string || '',
    location: params?.location as string || '',
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(params?.imageUrl as string || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [showDropdowns, setShowDropdowns] = useState({
    category: false,
    classType: false,
    difficulty: false,
    date: false,
    time: false,
    location: false,
  });

  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [requirementsModalVisible, setRequirementsModalVisible] = useState(false);
  const [cancellationModalVisible, setCancellationModalVisible] = useState(false);
  const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
  const [timePickerModalVisible, setTimePickerModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (field: string, value: string) => {
    // Always ensure the value starts with '$'
    if (!value.startsWith('$')) {
      value = '$' + value.replace(/\$/g, '');
    }
    // Remove any non-numeric characters except the first '$'
    const numericPart = value.slice(1).replace(/[^0-9]/g, '');
    const formattedValue = '$' + numericPart;
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleDropdownSelect = (field: string, option: DropdownOption) => {
    setFormData(prev => ({ ...prev, [field]: option.label }));
    setShowDropdowns(prev => ({ ...prev, [field]: false }));
  };

  const toggleDropdown = (field: keyof typeof showDropdowns) => {
    setShowDropdowns(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleImageUpload = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos.');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImageToStorage = async (imageUri: string): Promise<string> => {
    try {
      setIsUploadingImage(true);
  
      // Convert image URI to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();
  
      // Create a unique filename
      const user = auth.currentUser;
      const filename = `listings/${user?.uid}/${Date.now()}.jpg`;
      const imageRef = storageRef(storage, filename);
  
      // Upload blob to Firebase Storage
      await uploadBytes(imageRef, blob);
  
      // Get download URL
      const downloadURL = await getDownloadURL(imageRef);
  
      setIsUploadingImage(false);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploadingImage(false);
      throw error;
    }
  };
  

  const handleSaveDraft = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save a draft.');
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.availableSeats) {
        Alert.alert('Error', 'Please fill in all required fields (Title, Description, Category, Available Seats).');
        return;
      }

      // Upload image if selected
      let imageUrl = selectedImage || 'placeholder';
      if (selectedImage && !selectedImage.startsWith('http')) {
        try {
          imageUrl = await uploadImageToStorage(selectedImage);
        } catch (error) {
          Alert.alert('Warning', 'Failed to upload image. Saving without image.');
          imageUrl = 'placeholder';
        }
      }

      // Fetch instructor's full name from their profile
      const instructorProfileRef = ref(database, `users/${user.uid}/personalInfo`);
      const instructorSnapshot = await get(instructorProfileRef);
      const instructorProfile = instructorSnapshot.val();
      const instructorFullName = instructorProfile?.fullName || user.displayName || 'Instructor';

      // Create listing data
      const listingData = {
        title: formData.title,
        description: formData.description,
        availableSeats: parseInt(formData.availableSeats) || 0,
        category: formData.category,
        classType: formData.classType,
        difficulty: formData.difficulty,
        subscriberPrice: formData.subscriberPrice,
        nonSubscriberPrice: formData.nonSubscriberPrice,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        status: 'draft',
        createdAt: new Date().toISOString(),
        instructorId: user.uid,
        instructorName: instructorFullName,
        imageUrl: imageUrl,
        rating: 0,
        subscribers: 0,
        reviewCount: 0,
        availability: parseInt(formData.availableSeats) || 0, // Use availableSeats value
      };

      if (isEditMode && listingId && isDraftStatus) {
        // EDIT MODE: Update existing draft
        const draftRef = ref(database, `users/${user.uid}/draftListing/${listingId}`);
        await set(draftRef, listingData);
        Alert.alert('Success', 'Draft updated successfully!');
      } else {
        // CREATE MODE: Create new draft
        const draftRef = ref(database, `users/${user.uid}/draftListing`);
        const newDraftRef = push(draftRef);
        await set(newDraftRef, listingData);
        Alert.alert('Success', 'Class saved as draft successfully!');
      }

      router.back();
    } catch (error) {
      console.error('Error saving draft:', error);
      Alert.alert('Error', 'Failed to save draft. Please try again.');
    }
  };

  const handlePublish = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to publish a class.');
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.availableSeats) {
        Alert.alert('Error', 'Please fill in all required fields (Title, Description, Category, Available Seats).');
        return;
      }

      // Upload image if selected
      let imageUrl = selectedImage || 'placeholder';
      if (selectedImage && !selectedImage.startsWith('http')) {
        try {
          imageUrl = await uploadImageToStorage(selectedImage);
        } catch (error) {
          Alert.alert('Warning', 'Failed to upload image. Publishing without image.');
          imageUrl = 'placeholder';
        }
      }

      // Fetch instructor's full name from their profile
      const instructorProfileRef = ref(database, `users/${user.uid}/personalInfo`);
      const instructorSnapshot = await get(instructorProfileRef);
      const instructorProfile = instructorSnapshot.val();
      const instructorFullName = instructorProfile?.fullName || user.displayName || 'Instructor';

      // Create listing data
      const listingData = {
        title: formData.title,
        description: formData.description,
        availableSeats: parseInt(formData.availableSeats) || 0,
        category: formData.category,
        classType: formData.classType,
        difficulty: formData.difficulty,
        subscriberPrice: formData.subscriberPrice,
        nonSubscriberPrice: formData.nonSubscriberPrice,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        status: 'pending',
        createdAt: new Date().toISOString(),
        instructorId: user.uid,
        instructorName: instructorFullName,
        imageUrl: imageUrl,
        rating: 0,
        subscribers: 0,
        reviewCount: 0,
        availability: parseInt(formData.availableSeats) || 0, // Use availableSeats value
      };

      if (isEditMode && listingId && isDraftStatus) {
        // EDIT MODE: Publishing a draft - move from draft to published
        // First, check if draft exists
        const draftRef = ref(database, `users/${user.uid}/draftListing/${listingId}`);
        const draftSnapshot = await get(draftRef);
        
        if (draftSnapshot.exists()) {
          // Create new listing in user's published listings
          const userListingsRef = ref(database, `users/${user.uid}/Listings`);
          const newUserListingRef = push(userListingsRef);
          await set(newUserListingRef, listingData);

          // Create global listing
          const globalListingsRef = ref(database, 'Listings');
          const newGlobalListingRef = push(globalListingsRef);
          const globalListingData = {
            ...listingData,
            listingId: newGlobalListingRef.key,
            userListingId: newUserListingRef.key,
          };
          await set(newGlobalListingRef, globalListingData);
          
          // Update user's listing with global listing ID
          await set(ref(database, `users/${user.uid}/Listings/${newUserListingRef.key}/listingId`), newGlobalListingRef.key);

          // Delete the draft
          await remove(draftRef);

          Alert.alert('Success', 'Draft published successfully and submitted for admin approval!');
        } else {
          Alert.alert('Error', 'Draft not found.');
        }
      } else if (isEditMode && listingId && !isDraftStatus) {
        // EDIT MODE: Update existing published listing
        const userListingRef = ref(database, `users/${user.uid}/Listings/${listingId}`);
        const userListingSnapshot = await get(userListingRef);
        
        if (userListingSnapshot.exists()) {
          const existingData = userListingSnapshot.val();
          const globalListingId = existingData.listingId;
          
          // Update user's listing
          await set(userListingRef, {
            ...listingData,
            listingId: globalListingId, // Keep the existing global listing ID
          });
          
          // Update global listing if it exists
          if (globalListingId) {
            const globalListingRef = ref(database, `Listings/${globalListingId}`);
            await set(globalListingRef, {
              ...listingData,
              listingId: globalListingId,
              userListingId: listingId,
            });
            console.log(`Updated global listing: ${globalListingId}`);
          }
          
          Alert.alert('Success', 'Class updated successfully!');
        } else {
          Alert.alert('Error', 'Class not found for editing.');
        }
      } else {
        // CREATE MODE: Create new listing
        // Save to user's personal published listings
        const userListingsRef = ref(database, `users/${user.uid}/Listings`);
        const newUserListingRef = push(userListingsRef);
        await set(newUserListingRef, listingData);

        // Save to global Listings node for all users to see
        const globalListingsRef = ref(database, 'Listings');
        const newGlobalListingRef = push(globalListingsRef);
        const globalListingData = {
          ...listingData,
          listingId: newGlobalListingRef.key, // Store the global listing ID
          userListingId: newUserListingRef.key, // Store the user's listing ID
        };
        await set(newGlobalListingRef, globalListingData);
        
        // Also update the user's listing with the global listing ID for reference
        await set(ref(database, `users/${user.uid}/Listings/${newUserListingRef.key}/listingId`), newGlobalListingRef.key);

        Alert.alert('Success', 'Class submitted for admin approval!');
      }
      
      router.back();
    } catch (error) {
      console.error('Error publishing class:', error);
      Alert.alert('Error', 'Failed to publish class. Please try again.');
    }
  };

  const handleLogout = () => {
    // Logout handled by main instructor layout drawer
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setDatePickerModalVisible(false);
    }
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      setFormData(prev => ({ ...prev, date: formattedDate }));
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setTimePickerModalVisible(false);
    }
    if (selectedTime) {
      setSelectedTime(selectedTime);
      const formattedTime = selectedTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      setFormData(prev => ({ ...prev, time: formattedTime }));
    }
  };

  const openDatePicker = () => {
    setDatePickerModalVisible(true);
  };

  const openTimePicker = () => {
    setTimePickerModalVisible(true);
  };

  const closeDatePicker = () => {
    setDatePickerModalVisible(false);
  };

  const closeTimePicker = () => {
    setTimePickerModalVisible(false);
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
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Image
            source={require('@/assets/images/chevron-left.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
        <Text style={styles.headerTitle}>Add Class</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Upload Section */}
        <Pressable 
          style={[styles.imageUploadContainer, selectedImage && styles.imageUploadContainerWithImage]} 
          onPress={handleImageUpload}
          disabled={isUploadingImage}
        >
          {selectedImage ? (
            <>
              <Image
                source={{ uri: selectedImage }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
              <View style={styles.changeImageOverlay}>
                <Text style={styles.changeImageText}>Tap to change image</Text>
              </View>
            </>
          ) : (
            <>
              <Image
                source={require('@/assets/images/upload1.png')}
                style={styles.uploadIcon}
                resizeMode="contain"
              />
              <Text style={styles.uploadText}>
                {isUploadingImage ? 'Uploading...' : 'Upload an image'}
              </Text>
            </>
          )}
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
            <Text style={styles.inputLabel}>Available Seats</Text>
            <TextInput
              style={styles.textInput}
              value={formData.availableSeats}
              onChangeText={(value) => handleInputChange('availableSeats', value)}
              placeholder="Enter number of available seats"
              placeholderTextColor="#999999"
              keyboardType="numeric"
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
            <TextInput
              style={styles.textInput}
              value={formData.subscriberPrice}
              onChangeText={(value) => handlePriceChange('subscriberPrice', value)}
              placeholder="Enter price for subscribers (e.g., $10)"
              placeholderTextColor="#999999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price per person (Non subscribers)</Text>
            <TextInput
              style={styles.textInput}
              value={formData.nonSubscriberPrice}
              onChangeText={(value) => handlePriceChange('nonSubscriberPrice', value)}
              placeholder="Enter price for non-subscribers (e.g., $20)"
              placeholderTextColor="#999999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date</Text>
            <Pressable style={styles.pickerButton} onPress={openDatePicker}>
              <Text style={[styles.pickerButtonText, formData.date ? styles.pickerButtonTextSelected : styles.pickerButtonTextPlaceholder]}>
                {formData.date || 'Select Date'}
              </Text>
              <Image
                source={require('@/assets/images/chevron-left.png')}
                style={styles.chevronIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Time</Text>
            <Pressable style={styles.pickerButton} onPress={openTimePicker}>
              <Text style={[styles.pickerButtonText, formData.time ? styles.pickerButtonTextSelected : styles.pickerButtonTextPlaceholder]}>
                {formData.time || 'Select Time'}
              </Text>
              <Image
                source={require('@/assets/images/chevron-left.png')}
                style={styles.chevronIcon}
                resizeMode="contain"
              />
            </Pressable>
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
          {(!isEditMode || (isEditMode && isDraftStatus)) && (
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
          )}
          <Pressable style={styles.publishButton} onPress={handlePublish}>
            <LinearGradient
              colors={['#F708F7', '#C708F7', '#F76B0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.publishButtonGradient}
            >
              <Text style={styles.publishButtonText}>
                {isEditMode && isDraftStatus ? 'Publish' : isEditMode ? 'Update' : 'Publish'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>


      {/* Terms and Conditions Modal */}
      <Modal
        animationType="fade"
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
        animationType="fade"
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
        animationType="fade"
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

      {/* Date Picker Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={datePickerModalVisible}
        onRequestClose={closeDatePicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContainer}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>Select Date</Text>
              <Pressable style={styles.closeButton} onPress={closeDatePicker}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.pickerModalContent}>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={styles.dateTimePicker}
              />
            </View>
            <View style={styles.pickerModalFooter}>
              <Pressable style={styles.pickerDoneButton} onPress={closeDatePicker}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pickerDoneButtonGradient}
                >
                  <Text style={styles.pickerDoneButtonText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={timePickerModalVisible}
        onRequestClose={closeTimePicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContainer}>
            <View style={styles.pickerModalHeader}>
              <Text style={styles.pickerModalTitle}>Select Time</Text>
              <Pressable style={styles.closeButton} onPress={closeTimePicker}>
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>
            <View style={styles.pickerModalContent}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                style={styles.dateTimePicker}
              />
            </View>
            <View style={styles.pickerModalFooter}>
              <Pressable style={styles.pickerDoneButton} onPress={closeTimePicker}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pickerDoneButtonGradient}
                >
                  <Text style={styles.pickerDoneButtonText}>Done</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#000000',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 40,
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
    overflow: 'hidden',
  },
  imageUploadContainerWithImage: {
    borderStyle: 'solid',
    borderColor: '#8A53C2',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  changeImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  changeImageText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
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
  // Picker button styles
  pickerButton: {
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
  pickerButtonText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
  },
  pickerButtonTextSelected: {
    color: '#000000',
  },
  pickerButtonTextPlaceholder: {
    color: '#999999',
  },
  // Picker modal styles
  pickerModalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    maxHeight: '60%',
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  pickerModalTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  pickerModalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  pickerModalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopColor: '#E0E0E0',
  },
  pickerDoneButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  pickerDoneButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  pickerDoneButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  dateTimePicker: {
    width: '100%',
    height: 200,
  },
});
