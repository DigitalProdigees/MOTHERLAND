import CancellationPolicySheet from '@/components/ui/cancellation-policy-sheet';
import GuestRequirementSheet from '@/components/ui/guest-requirement-sheet';
import TermsConditionsSheet from '@/components/ui/terms-conditions-sheet';
import { Fonts } from '@/constants/theme';
import { auth, database, storage } from '@/firebase.config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { get, push, ref, remove, set } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  { label: 'Belly Dance', value: 'belly' },
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

  // Custom policies state
  const [customTerms, setCustomTerms] = useState(params?.customTerms as string || '');
  const [customRequirements, setCustomRequirements] = useState<string[]>(() => {
    // Handle both old string format and new array format
    const requirements = params?.customRequirements;
    if (Array.isArray(requirements)) {
      return requirements;
    } else if (typeof requirements === 'string' && requirements) {
      // Convert string format to array (split by newlines and remove bullets)
      return requirements.split('\n')
        .map(r => r.replace(/^[•\-\*]\s*/, '').trim())
        .filter(r => r !== '');
    }
    return [];
  });
  const [customCancellation, setCustomCancellation] = useState(params?.customCancellation as string || '');
  const [cancellationPolicyHeading, setCancellationPolicyHeading] = useState(params?.cancellationPolicyHeading as string || '');

  const [mainImage, setMainImage] = useState<string | null>(params?.mainImage as string || null);
  const [subImages, setSubImages] = useState<(string | null)[]>([
    params?.subImage1 as string || null,
    params?.subImage2 as string || null,
    params?.subImage3 as string || null,
    params?.subImage4 as string || null,
  ]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleMainImageUpload = async () => {
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
        setMainImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubImageUpload = async (index: number) => {
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
        const updatedSubImages = [...subImages];
        updatedSubImages[index] = result.assets[0].uri;
        setSubImages(updatedSubImages);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeSubImage = (index: number) => {
    const updatedSubImages = [...subImages];
    updatedSubImages[index] = null;
    setSubImages(updatedSubImages);
  };

  const uploadImageToStorage = async (imageUri: string): Promise<string> => {
    try {
      setIsUploadingImage(true);
      console.log('Storage upload: starting', { imageUri });
  
      // Compress/convert to JPEG to ensure file:// URI and compatibility (avoids ph:// on iOS)
      const manipulated = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Convert image URI to blob
      const response = await fetch(manipulated.uri);
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
      console.log('Storage upload: success', { downloadURL });
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploadingImage(false);
      console.log('Storage upload: failed');
      throw error;
    }
  };
  

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      const user = auth.currentUser;
      if (!user) {
        setIsSaving(false);
        Alert.alert('Error', 'You must be logged in to save a draft.');
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.availableSeats) {
        setIsSaving(false);
        Alert.alert('Error', 'Please fill in all required fields (Title, Description, Category, Available Seats).');
        return;
      }

      // Upload main image if selected
      let mainImageUrl = mainImage || '';
      if (mainImage && !mainImage.startsWith('http')) {
        try {
          console.log('Draft: uploading main image');
          mainImageUrl = await uploadImageToStorage(mainImage);
        } catch (error) {
          console.log('Draft: main image upload failed');
          Alert.alert('Warning', 'Failed to upload main image. Saving without main image.');
          mainImageUrl = '';
        }
      }

      // Upload sub images if selected
      const subImageUrls: string[] = [];
      for (let i = 0; i < subImages.length; i++) {
        if (subImages[i] && !subImages[i]!.startsWith('http')) {
          try {
            console.log('Draft: uploading sub image', { index: i + 1 });
            const url = await uploadImageToStorage(subImages[i]!);
            subImageUrls.push(url);
          } catch (error) {
            console.error(`Failed to upload sub image ${i + 1}:`, error);
            console.log('Draft: sub image upload failed', { index: i + 1 });
            subImageUrls.push('');
          }
        } else if (subImages[i]) {
          console.log('Draft: using existing sub image URL', { index: i + 1 });
          subImageUrls.push(subImages[i]!);
        } else {
          console.log('Draft: no sub image provided', { index: i + 1 });
          subImageUrls.push('');
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
        mainImage: mainImageUrl,
        subImage1: subImageUrls[0] || '',
        subImage2: subImageUrls[1] || '',
        subImage3: subImageUrls[2] || '',
        subImage4: subImageUrls[3] || '',
        // Keep imageUrl for backward compatibility
        imageUrl: mainImageUrl || 'placeholder',
        rating: 0,
        subscribers: 0,
        reviewCount: 0,
        availability: parseInt(formData.availableSeats) || 0, // Use availableSeats value
        // Custom policies - convert requirements array to string with newlines
        customTerms: customTerms,
        customRequirements: customRequirements.length > 0 
          ? customRequirements.map(req => `• ${req}`).join('\n')
          : '',
        customCancellation: customCancellation,
        cancellationPolicyHeading: cancellationPolicyHeading,
      };

      if (isEditMode && listingId && isDraftStatus) {
        // EDIT MODE: Update existing draft
        const draftRef = ref(database, `users/${user.uid}/draftListing/${listingId}`);
        await set(draftRef, listingData);
        setIsSaving(false);
        Alert.alert('Success', 'Draft updated successfully!');
      } else {
        // CREATE MODE: Create new draft
        const draftRef = ref(database, `users/${user.uid}/draftListing`);
        const newDraftRef = push(draftRef);
        await set(newDraftRef, listingData);
        setIsSaving(false);
        Alert.alert('Success', 'Class saved as draft successfully!');
      }

      router.back();
    } catch (error) {
      console.error('Error saving draft:', error);
      setIsSaving(false);
      Alert.alert('Error', 'Failed to save draft. Please try again.');
    }
  };

  const handlePublish = async () => {
    try {
      setIsSaving(true);
      const user = auth.currentUser;
      if (!user) {
        setIsSaving(false);
        Alert.alert('Error', 'You must be logged in to publish a class.');
        return;
      }

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.availableSeats) {
        setIsSaving(false);
        Alert.alert('Error', 'Please fill in all required fields (Title, Description, Category, Available Seats).');
        return;
      }

      // Validate images: Must have main image and at least 1 sub image
      if (!mainImage) {
        setIsSaving(false);
        Alert.alert('Error', 'Please upload a main image before publishing.');
        return;
      }

      const hasAtLeastOneSubImage = subImages.some(img => img !== null);
      if (!hasAtLeastOneSubImage) {
        setIsSaving(false);
        Alert.alert('Error', 'Please upload at least one sub image before publishing.');
        return;
      }

      // Upload main image if selected
      let mainImageUrl = mainImage || '';
      if (mainImage && !mainImage.startsWith('http')) {
        try {
          console.log('Publish: uploading main image');
          mainImageUrl = await uploadImageToStorage(mainImage);
        } catch (error) {
          setIsSaving(false);
          console.log('Publish: main image upload failed');
          Alert.alert('Error', 'Failed to upload main image. Please try again.');
          return;
        }
      }

      // Upload sub images if selected
      const subImageUrls: string[] = [];
      for (let i = 0; i < subImages.length; i++) {
        if (subImages[i] && !subImages[i]!.startsWith('http')) {
          try {
            console.log('Publish: uploading sub image', { index: i + 1 });
            const url = await uploadImageToStorage(subImages[i]!);
            subImageUrls.push(url);
          } catch (error) {
            console.error(`Failed to upload sub image ${i + 1}:`, error);
            console.log('Publish: sub image upload failed', { index: i + 1 });
            subImageUrls.push('');
          }
        } else if (subImages[i]) {
          console.log('Publish: using existing sub image URL', { index: i + 1 });
          subImageUrls.push(subImages[i]!);
        } else {
          console.log('Publish: no sub image provided', { index: i + 1 });
          subImageUrls.push('');
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
        mainImage: mainImageUrl,
        subImage1: subImageUrls[0] || '',
        subImage2: subImageUrls[1] || '',
        subImage3: subImageUrls[2] || '',
        subImage4: subImageUrls[3] || '',
        // Keep imageUrl for backward compatibility
        imageUrl: mainImageUrl || 'placeholder',
        rating: 0,
        subscribers: 0,
        reviewCount: 0,
        availability: parseInt(formData.availableSeats) || 0, // Use availableSeats value
        // Custom policies - convert requirements array to string with newlines
        customTerms: customTerms,
        customRequirements: customRequirements.length > 0 
          ? customRequirements.map(req => `• ${req}`).join('\n')
          : '',
        customCancellation: customCancellation,
        cancellationPolicyHeading: cancellationPolicyHeading,
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

          setIsSaving(false);
          Alert.alert('Success', 'Draft published successfully and submitted for admin approval!');
        } else {
          setIsSaving(false);
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
          
          setIsSaving(false);
          Alert.alert('Success', 'Class updated successfully!');
        } else {
          setIsSaving(false);
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

        setIsSaving(false);
        Alert.alert('Success', 'Class submitted for admin approval!');
      }
      
      router.back();
    } catch (error) {
      console.error('Error publishing class:', error);
      setIsSaving(false);
      Alert.alert('Error', 'Failed to publish class. Please try again.');
    }
  };

  const handleLogout = () => {
    // Logout handled by main instructor layout drawer
  };

  // Check if all booking policies are filled
  const areAllBookingPoliciesFilled = 
    customTerms.trim() !== '' && 
    customRequirements.length > 0 && 
    customCancellation.trim() !== '';


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

  const handleSaveCancellationPolicy = (policy: string, policyHeading?: string) => {
    setCustomCancellation(policy);
    setCancellationPolicyHeading(policyHeading || '');
  };

  const handleSaveTermsConditions = (terms: string) => {
    setCustomTerms(terms);
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
        {/* Main Image Upload Section */}
        <View style={styles.imageSection}>
          <Text style={styles.imageSectionTitle}>Main Image <Text style={styles.required}>*</Text></Text>
          <Text style={styles.imageSectionSubtitle}>This will be the primary image displayed first</Text>
          <Pressable 
            style={[styles.mainImageUploadContainer, mainImage && styles.imageUploadContainerWithImage]} 
            onPress={handleMainImageUpload}
            disabled={isUploadingImage}
          >
            {mainImage ? (
              <>
                <Image
                  source={{ uri: mainImage }}
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
                  {isUploadingImage ? 'Uploading...' : 'Upload main image'}
                </Text>
              </>
            )}
          </Pressable>

          {/* Sub Images Upload Section - Horizontal Row */}
          <View style={styles.subImagesSection}>
            <Text style={styles.subImagesSectionTitle}>Additional Images <Text style={styles.required}>* (At least 1)</Text></Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.subImagesScrollView}
              contentContainerStyle={styles.subImagesContainer}
            >
              {subImages.map((image, index) => (
                <Pressable 
                  key={index}
                  style={[styles.subImageUploadContainer, image && styles.imageUploadContainerWithImage]} 
                  onPress={() => handleSubImageUpload(index)}
                  disabled={isUploadingImage}
                >
                  {image ? (
                    <>
                      <Image
                        source={{ uri: image }}
                        style={styles.subUploadedImage}
                        resizeMode="cover"
                      />
                    <Pressable 
                      style={styles.removeImageButtonContainer}
                      onPress={() => removeSubImage(index)}
                    >
                      <LinearGradient
                        colors={['#F708F7', '#C708F7', '#F76B0B']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.removeImageButton}
                      >
                        <Text style={styles.removeImageText}>✕</Text>
                      </LinearGradient>
                    </Pressable>
                    </>
                  ) : (
                    <>
                      <Image
                        source={require('@/assets/images/upload1.png')}
                        style={styles.subUploadIcon}
                        resizeMode="contain"
                      />
                    </>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

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
          <Text style={styles.sectionTitle}>Booking Policies</Text>
          
      

          <View style={styles.bookingCard}>
            <Pressable style={styles.bookingItem} onPress={() => handleBookingOptionPress('terms')}>
              <View style={styles.bookingItemContent}>
                <Text style={styles.bookingItemText}>Terms and Conditions</Text>
                {customTerms ? (
                  <Text style={styles.bookingItemSubtext}>✓ Added</Text>
                ) : (
                  <Text style={[styles.bookingItemSubtext, styles.notAddedText]}>Not added</Text>
                )}
              </View>
            </Pressable>
            <View style={styles.bookingDivider} />
            <Pressable style={styles.bookingItem} onPress={() => handleBookingOptionPress('requirements')}>
              <View style={styles.bookingItemContent}>
                <Text style={styles.bookingItemText}>Guest requirements</Text>
                {customRequirements.length > 0 ? (
                  <Text style={styles.bookingItemSubtext}>✓ Added</Text>
                ) : (
                  <Text style={[styles.bookingItemSubtext, styles.notAddedText]}>Not added</Text>
                )}
              </View>
            </Pressable>
            <View style={styles.bookingDivider} />
            <Pressable style={styles.bookingItem} onPress={() => handleBookingOptionPress('cancellation')}>
              <View style={styles.bookingItemContent}>
                <Text style={styles.bookingItemText}>Cancellation policy</Text>
                {customCancellation ? (
                  <Text style={styles.bookingItemSubtext}>✓ Added</Text>
                ) : (
                  <Text style={[styles.bookingItemSubtext, styles.notAddedText]}>Not added</Text>
                )}
              </View>
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
          <Pressable 
            style={[styles.publishButton, !areAllBookingPoliciesFilled && styles.publishButtonDisabled]} 
            onPress={handlePublish}
            disabled={!areAllBookingPoliciesFilled}
          >
            <LinearGradient
              colors={areAllBookingPoliciesFilled ? ['#F708F7', '#C708F7', '#F76B0B'] : ['#CCCCCC', '#999999', '#CCCCCC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.publishButtonGradient, !areAllBookingPoliciesFilled && styles.publishButtonGradientDisabled]}
            >
              <Text style={styles.publishButtonText}>
                {isEditMode && isDraftStatus ? 'Publish' : isEditMode ? 'Update' : 'Publish'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>


      {/* Terms and Conditions Bottom Sheet */}
      <TermsConditionsSheet
        visible={termsModalVisible}
        onClose={closeTermsModal}
        onSave={handleSaveTermsConditions}
        initialTerms={customTerms}
      />

      {/* Guest Requirements Bottom Sheet */}
      <GuestRequirementSheet
        visible={requirementsModalVisible}
        onClose={closeRequirementsModal}
        onSave={(requirements) => setCustomRequirements(requirements)}
        initialRequirements={customRequirements}
      />

      {/* Cancellation Policy Bottom Sheet */}
      <CancellationPolicySheet
        visible={cancellationModalVisible}
        onClose={closeCancellationModal}
        onSave={handleSaveCancellationPolicy}
        initialPolicy={customCancellation}
        initialPolicyHeading={cancellationPolicyHeading}
      />

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
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  themeVariant="light"
                  textColor="#000000"
                />
              ) : (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
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
              {Platform.OS === 'ios' ? (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  themeVariant="light"
                  textColor="#000000"
                />
              ) : (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="default"
                  onChange={handleTimeChange}
                />
              )}
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

      {/* Beautiful Loading Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isSaving}
        onRequestClose={() => {}}
      >
        <View style={styles.loadingModalOverlay}>
          <View style={styles.loadingModalContainer}>
            <LinearGradient
              colors={['#F708F7', '#C708F7', '#F76B0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loadingGradient}
            >
              <View style={styles.loadingContent}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingTitle}>Saving Your Class</Text>
                <Text style={styles.loadingSubtitle}>Please wait while we upload your images and save your listing...</Text>
              </View>
            </LinearGradient>
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
    width: 40,
    height: 40,
    right:10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
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
  imageSection: {
    marginBottom: 24,
  },
  imageSectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 4,
  },
  imageSectionSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
    marginBottom: 12,
  },
  required: {
    color: '#FF0000',
  },
  mainImageUploadContainer: {
    height: 200,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
  },
  subImagesSection: {
    marginTop: 16,
  },
  subImagesSectionTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 8,
  },
  subImagesScrollView: {
    flexGrow: 0,
  },
  subImagesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  subImageUploadContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    overflow: 'hidden',
    position: 'relative',
  },
  imageUploadContainerWithImage: {
    borderStyle: 'solid',
    borderColor: '#8A53C2',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  subUploadedImage: {
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
  removeImageButtonContainer: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 10,
  },
  removeImageButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  uploadIcon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  subUploadIcon: {
    width: 24,
    height: 24,
    marginBottom: 2,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#666666',
  },
  subUploadText: {
    fontSize: 10,
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 16,
    marginBottom: 16,
  },
  toggleLabelContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 4,
  },
  toggleSubtext: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
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
  bookingItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingItemText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  bookingItemSubtext: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#8A53C2',
  },
  notAddedText: {
    color: '#999999',
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
  publishButtonDisabled: {
    opacity: 0.6,
  },
  publishButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  publishButtonGradientDisabled: {
    opacity: 1,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  modalLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 12,
  },
  modalTextArea: {
    height: 300,
    textAlignVertical: 'top',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
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
    width: width - 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden',
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
    paddingHorizontal: 0,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
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
  // Loading modal styles
  loadingModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingModalContainer: {
    width: width - 80,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  loadingGradient: {
    padding: 40,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
});
