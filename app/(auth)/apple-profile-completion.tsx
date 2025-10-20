import GradientButton from '@/components/ui/gradient-button';
import Header from '@/components/ui/header';
import LoadingModal from '@/components/ui/loading-modal';
import { Fonts, Icons } from '@/constants/theme';
import { database } from '@/firebase.config';
import { AuthService } from '@/services/authService';
import { useRouter } from 'expo-router';
import { get, ref, set } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppleProfileCompletionScreen() {
  console.log('🍎 Apple Profile Completion Screen loaded');
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<string>('');
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    userType: '',
  });

  const userTypeOptions = [
    { id: 'dancer', name: 'Dancer' },
    { id: 'instructor', name: 'Instructor' },
  ];
  const scrollViewRef = useRef<ScrollView>(null);
  const fullNameRef = useRef<View>(null);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const scrollToInput = (inputRef: React.RefObject<View | null>) => {
    if (inputRef.current && scrollViewRef.current) {
      setTimeout(() => {
        inputRef.current?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y - 300, animated: true });
          },
          () => {}
        );
      }, 100);
    }
  };

  const validateFullName = (name: string) => {
    if (!name.trim()) {
      return 'Full name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'Name can only contain letters and spaces';
    }
    return '';
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    // Clear error when user starts typing
    if (errors.fullName) {
      setErrors({ ...errors, fullName: '' });
    }
  };

  const handleBlurFullName = () => {
    setFocusedInput(null);
    setErrors({ ...errors, fullName: validateFullName(fullName) });
  };

  const handleUserTypeSelect = (selectedType: string) => {
    setUserType(selectedType);
    setShowUserTypeDropdown(false);
    setFocusedInput(null);
    // Clear error when user selects a type
    if (errors.userType) {
      setErrors({ ...errors, userType: '' });
    }
  };

  const isFormValid = () => {
    const nameError = validateFullName(fullName);
    const userTypeError = !userType ? 'Please select a user type' : '';
    return !nameError && !userTypeError;
  };

  // Debug function to clear user data
  const clearUserData = async () => {
    try {
      const { auth } = await import('@/firebase.config');
      const user = auth.currentUser;
      if (user) {
        console.log('🍎 Clearing user data for UID:', user.uid);
        await AuthService.deleteUserData(user.uid);
        Alert.alert('Success', 'User data cleared from database');
      }
    } catch (error) {
      console.log('🍎 Error clearing user data:', error);
      Alert.alert('Error', 'Failed to clear user data');
    }
  };

  // Debug function to check specific user ID
  const checkSpecificUser = async () => {
    try {
      const specificUID = 'jo8RGKuZqTO03XHpbYyP5REWzzg1';
      console.log('🍎 Checking specific user ID:', specificUID);
      const exists = await AuthService.userExistsInDatabase(specificUID);
      Alert.alert('Debug Info', `User ${specificUID} exists: ${exists}`);
    } catch (error) {
      console.log('🍎 Error checking specific user:', error);
      Alert.alert('Error', 'Failed to check user');
    }
  };

  const handleCompleteProfile = async () => {
    console.log('🍎 Profile completion started');
    if (!isFormValid()) {
      Alert.alert('Error', 'Please enter a valid name');
      return;
    }

    setIsLoading(true);
    
    try {
      // Get current user from Firebase Auth
      const { auth } = await import('@/firebase.config');
      const user = auth.currentUser;
      
      console.log('🍎 Current user:', { uid: user?.uid, email: user?.email });
      
      if (!user) {
        console.log('🍎 No user found, redirecting to signin');
        Alert.alert('Error', 'No user found. Please sign in again.');
        router.replace('/(auth)/signin');
        return;
      }

      // Update user data in database
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      
      // Get existing user data first
      const snapshot = await get(userRef);
      const existingData = snapshot.val() || {};
      
      // Update with new data while preserving existing data
      await set(userRef, {
        ...existingData,
        fullName: fullName.trim(),
        userType: userType,
        email: user.email || null, // Save email if available
        lastSignIn: new Date().toISOString(),
      });

      console.log('🍎 Profile completed successfully:', { uid: user.uid, fullName: fullName.trim(), userType: userType, email: user.email });
      
      // Navigate to terms screen
      console.log('🍎 Navigating to terms screen');
      router.push('/(auth)/terms');
      
    } catch (error: any) {
      console.log('Profile completion error:', error);
      Alert.alert('Error', 'Failed to complete profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <Header 
          title="Complete Your Profile"
          subtitle="Add your name and choose your role"
          onBackPress={() => router.back()}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 150 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={true}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                {/* Input fields */}
                <View style={styles.inputContainer}>
                  {/* Full Name */}
                  <View style={styles.fieldWrapper} ref={fullNameRef}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <View style={[
                      styles.inputField,
                      focusedInput === 'fullName' && styles.inputFieldFocused,
                      errors.fullName && styles.inputFieldError
                    ]}>
                      <View style={styles.inputIcon}>
                        <Icons.Name width={24} height={24} />
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="ex, john doe"
                        placeholderTextColor="#999"
                        value={fullName}
                        onChangeText={handleFullNameChange}
                        onFocus={() => {
                          setFocusedInput('fullName');
                          scrollToInput(fullNameRef);
                        }}
                        onBlur={handleBlurFullName}
                        autoCapitalize="words"
                        autoFocus
                      />
                    </View>
                    {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
                  </View>

                  {/* User Type Selection */}
                  <View style={styles.fieldWrapper}>
                    <Text style={styles.inputLabel}>I am signing up as:</Text>
                    <Pressable 
                      style={[
                        styles.inputField,
                        focusedInput === 'userType' && styles.inputFieldFocused,
                        errors.userType && styles.inputFieldError
                      ]}
                      onPress={() => {
                        setFocusedInput('userType');
                        setShowUserTypeDropdown(!showUserTypeDropdown);
                      }}
                    >
                      <View style={styles.inputIcon}>
                        <Icons.Name width={24} height={24} />
                      </View>
                      <Text style={[
                        styles.input, 
                        userType ? styles.selectedText : styles.placeholderText
                      ]}>
                        {userType ? userTypeOptions.find(option => option.id === userType)?.name : 'Select type'}
                      </Text>
                      <View style={styles.dropdownIcon}>
                        <Text style={[
                          styles.dropdownIconText,
                          showUserTypeDropdown && styles.dropdownIconRotated
                        ]}>▼</Text>
                      </View>
                    </Pressable>
                    {errors.userType ? <Text style={styles.errorText}>{errors.userType}</Text> : null}
                    
                    {/* Dropdown Options */}
                    {showUserTypeDropdown && (
                      <TouchableWithoutFeedback onPress={() => setShowUserTypeDropdown(false)}>
                        <View style={styles.dropdownOverlay}>
                          <View style={styles.dropdownContainer}>
                            {userTypeOptions.map((option, index) => (
                              <Pressable
                                key={index}
                                style={[
                                  styles.dropdownItem,
                                  userType === option.id && styles.dropdownItemSelected
                                ]}
                                onPress={() => handleUserTypeSelect(option.id)}
                              >
                                <Text style={[
                                  styles.dropdownItemText,
                                  userType === option.id && styles.dropdownItemTextSelected
                                ]}>
                                  {option.name}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer */}
        <View style={styles.footer}>
          <GradientButton
            title={isLoading ? "Completing profile..." : "Complete Profile"}
            onPress={handleCompleteProfile}
            disabled={!isFormValid() || isLoading}
          />
          
       
        </View>
      </Animated.View>

      <LoadingModal visible={isLoading} message="Completing your profile..." />
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
  },
  inputContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
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
  inputFieldFocused: {
    borderWidth: 1,
    borderColor: '#8A53C2',
  },
  inputFieldError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#FF3B30',
    marginTop: 4,
    marginLeft: 4,
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
  dropdownIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIconText: {
    fontSize: 12,
    color: '#666666',
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    zIndex: 1001,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemSelected: {
    backgroundColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  dropdownItemTextSelected: {
    fontFamily: Fonts.semiBold,
    color: '#8A53C2',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  debugButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
  },
  debugButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: Fonts.medium,
  },
});
