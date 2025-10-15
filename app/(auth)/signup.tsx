import GradientButton from '@/components/ui/gradient-button';
import Header from '@/components/ui/header';
import LoadingModal from '@/components/ui/loading-modal';
import { Fonts, Icons } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [fullName, setFullName] = useState('Tamoor Malik');
  const [email, setEmail] = useState('tamoormalik088@gmail.com');
  const [password, setPassword] = useState('88888888');
  const [confirmPassword, setConfirmPassword] = useState('88888888');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [isInstructor, setIsInstructor] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const fullNameRef = useRef<View>(null);
  const emailRef = useRef<View>(null);
  const passwordRef = useRef<View>(null);
  const confirmPasswordRef = useRef<View>(null);

  // Animation values for section transitions
  const section1TranslateX = useState(new Animated.Value(0))[0];
  const section1Scale = useState(new Animated.Value(1))[0];
  const section2TranslateX = useState(new Animated.Value(400))[0];
  const section2Scale = useState(new Animated.Value(0.8))[0];

  // Keyboard event listeners for section 2
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (currentSection === 2 && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [currentSection]);

  const animateToSection2 = () => {
    Animated.parallel([
      // Slide out and scale down section 1
      Animated.spring(section1TranslateX, {
        toValue: -400,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(section1Scale, {
        toValue: 0.8,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      // Slide in and scale up section 2
      Animated.spring(section2TranslateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(section2Scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();
  };

  const animateToSection1 = () => {
    Animated.parallel([
      // Slide in and scale up section 1
      Animated.spring(section1TranslateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(section1Scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      // Slide out and scale down section 2
      Animated.spring(section2TranslateX, {
        toValue: 400,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.spring(section2Scale, {
        toValue: 0.8,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();
  };

  const handleEmailSignUp = () => {
    animateToSection2();
    // Delay state change to sync with animation
    setTimeout(() => setCurrentSection(2), 50);
  };

  const handleGoogleSignUp = () => {
    Alert.alert(
      'Coming Soon',
      'Google Sign Up will be available soon!',
      [{ text: 'OK' }]
    );
  };

  const handleAppleSignUp = () => {
    Alert.alert(
      'Coming Soon',
      'Apple Sign Up will be available soon!',
      [{ text: 'OK' }]
    );
  };

  const handleBack = () => {
    animateToSection1();
    // Delay state change to sync with animation
    setTimeout(() => setCurrentSection(1), 50);
  };

  const handleCreateAccount = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill in all fields correctly');
      return;
    }

    // Store current values before setting loading state
    const currentFullName = fullName;
    const currentEmail = email;
    const currentPassword = password;
    const currentConfirmPassword = confirmPassword;
    
    setIsLoading(true);
    
    try {
      // Create user with Firebase Auth using stored values
      const userCredential = await createUserWithEmailAndPassword(auth, currentEmail, currentPassword);
      const user = userCredential.user;

      // Save user details to Realtime Database under users/{id}/personalInfo
      const userRef = ref(database, `users/${user.uid}/personalInfo`);
      await set(userRef, {
        fullName: currentFullName.trim(),
        email: currentEmail.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
        uid: user.uid,
        userType: isInstructor ? 'instructor' : 'dancer',
      });

      console.log('Account created successfully:', { uid: user.uid, email: user.email });
      
      // Navigate to terms screen first (for both user types)
      router.push('/(auth)/terms');
      
    } catch (error: any) {
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in or use a different email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      Alert.alert('Sign Up Failed', errorMessage);
      
      // Restore the values after error
      setFullName(currentFullName);
      setEmail(currentEmail);
      setPassword(currentPassword);
      setConfirmPassword(currentConfirmPassword);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.replace('/(auth)/signin');
  };

  const scrollToInput = (inputRef: React.RefObject<View | null>) => {
    if (inputRef.current && scrollViewRef.current) {
      setTimeout(() => {
        inputRef.current?.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y: y-300, animated: true });
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

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPass: string, pass: string) => {
    if (!confirmPass) {
      return 'Please confirm your password';
    }
    if (confirmPass !== pass) {
      return 'Passwords do not match';
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

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors({ ...errors, email: '' });
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Clear error when user starts typing
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
    // Also clear confirm password error if it exists
    if (confirmPassword && errors.confirmPassword) {
      setErrors({ ...errors, password: '', confirmPassword: '' });
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    // Clear error when user starts typing
    if (errors.confirmPassword) {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const handleBlurFullName = () => {
    setFocusedInput(null);
    setErrors({ ...errors, fullName: validateFullName(fullName) });
  };

  const handleBlurEmail = () => {
    setFocusedInput(null);
    setErrors({ ...errors, email: validateEmail(email) });
  };

  const handleBlurPassword = () => {
    setFocusedInput(null);
    setErrors({ ...errors, password: validatePassword(password) });
  };

  const handleBlurConfirmPassword = () => {
    setFocusedInput(null);
    setErrors({ ...errors, confirmPassword: validateConfirmPassword(confirmPassword, password) });
  };

  const isFormValid = () => {
    const nameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
    
    return (
      !nameError &&
      !emailError &&
      !passwordError &&
      !confirmPasswordError &&
      agreeTerms &&
      agreePrivacy
    );
  };

  const renderSection1 = () => (
    <>
      {/* Title */}
      <Text style={section1Styles.title}>Sign Up</Text>

      {/* Sign up options */}
      <View style={section1Styles.optionsContainer}>
        {/* Email option */}
        <Pressable
          style={({ pressed }) => [
            section1Styles.optionButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={handleEmailSignUp}
        >
          <View style={section1Styles.optionContent}>
            <View style={section1Styles.emailIcon}>
              <Icons.Email width={24} height={24} />
            </View>
            <Text style={section1Styles.optionText}>Email</Text>
          </View>
        </Pressable>

        {/* Google option */}
        <Pressable
          style={({ pressed }) => [
            section1Styles.optionButton,
            { opacity: pressed ? 0.7 : 1, justifyContent: 'center', alignItems: 'center' }
          ]}
          onPress={handleGoogleSignUp}
        >
          <View style={section1Styles.optionContent}>
            <View style={section1Styles.googleIcon}>
              <Icons.Google width={32} height={32} />
            </View>
            <Text style={section1Styles.optionText}>Google ID</Text>
          </View>
        </Pressable>

        {/* Apple option */}
        <Pressable
          style={({ pressed }) => [
            section1Styles.optionButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={handleAppleSignUp}
        >
          <View style={section1Styles.optionContent}>
            <View style={section1Styles.appleIcon}>
              <Icons.Apple width={32} height={32} />
            </View>
            <Text style={section1Styles.optionText}>Apple ID</Text>
          </View>
        </Pressable>
      </View>
    </>
  );

  const renderSection2 = () => (
    <>
      {/* Header */}
      <Header 
        title="Get Started"
        subtitle="Create new account to continue"
        onBackPress={handleBack}
      />

      {/* Input fields */}
      <View style={section2Styles.inputContainer}>
        {/* Full Name */}
        <View style={section2Styles.fieldWrapper} ref={fullNameRef}>
          <Text style={section2Styles.inputLabel}>Full Name</Text>
          <View style={[
            section2Styles.inputField,
            focusedInput === 'fullName' && section2Styles.inputFieldFocused,
            errors.fullName && section2Styles.inputFieldError
          ]}>
            <View style={section2Styles.inputIcon}>
              <Icons.Name width={24} height={24} />
            </View>
            <TextInput
              style={section2Styles.input}
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
            />
          </View>
          {errors.fullName ? <Text style={section2Styles.errorText}>{errors.fullName}</Text> : null}
        </View>

        {/* Email */}
        <View style={section2Styles.fieldWrapper} ref={emailRef}>
          <Text style={section2Styles.inputLabel}>Email</Text>
          <View style={[
            section2Styles.inputField,
            focusedInput === 'email' && section2Styles.inputFieldFocused,
            errors.email && section2Styles.inputFieldError
          ]}>
            <View style={section2Styles.inputIcon}>
              <Icons.Email width={24} height={24} />
            </View>
            <TextInput
              style={section2Styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={handleEmailChange}
              onFocus={() => {
                setFocusedInput('email');
                scrollToInput(emailRef);
              }}
              onBlur={handleBlurEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {errors.email ? <Text style={section2Styles.errorText}>{errors.email}</Text> : null}
        </View>

        {/* Password */}
        <View style={section2Styles.fieldWrapper} ref={passwordRef}>
          <Text style={section2Styles.inputLabel}>Password</Text>
          <View style={[
            section2Styles.inputField,
            focusedInput === 'password' && section2Styles.inputFieldFocused,
            errors.password && section2Styles.inputFieldError
          ]}>
            <View style={section2Styles.inputIcon}>
              <Icons.Password width={24} height={24} />
            </View>
            <TextInput
              style={[section2Styles.input, { color: '#000000' }]}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={handlePasswordChange}
              onFocus={() => {
                setFocusedInput('password');
                scrollToInput(passwordRef);
              }}
              onBlur={handleBlurPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          {errors.password ? <Text style={section2Styles.errorText}>{errors.password}</Text> : null}
        </View>

        {/* Confirm Password */}
        <View style={section2Styles.fieldWrapper} ref={confirmPasswordRef}>
          <Text style={section2Styles.inputLabel}>Confirm Password</Text>
          <View style={[
            section2Styles.inputField,
            focusedInput === 'confirmPassword' && section2Styles.inputFieldFocused,
            errors.confirmPassword && section2Styles.inputFieldError
          ]}>
            <View style={section2Styles.inputIcon}>
              <Icons.ConfirmPassword width={24} height={24} />
            </View>
            <TextInput
              style={[section2Styles.input, { color: '#000000' }]}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              onFocus={() => {
                setFocusedInput('confirmPassword');
                scrollToInput(confirmPasswordRef);
              }}
              onBlur={handleBlurConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
          {errors.confirmPassword ? <Text style={section2Styles.errorText}>{errors.confirmPassword}</Text> : null}
        </View>

        {/* Instructor/Dancer Toggle */}
        <View style={section2Styles.fieldWrapper}>
          <Text style={section2Styles.inputLabel}>I am signing up as:</Text>
          <View style={section2Styles.userTypeContainer}>
              {!isInstructor ? (
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[section2Styles.userTypeButton, section2Styles.userTypeButtonActive]}
                >
                  <Pressable
                    style={section2Styles.userTypeButton}
                    onPress={() => setIsInstructor(false)}
                  >
                    <Text style={[
                      section2Styles.userTypeText,
                      section2Styles.userTypeTextActive
                    ]}>
                      Dancer
                    </Text>
                  </Pressable>
                </LinearGradient>
              ) : (
                <Pressable
                  style={section2Styles.userTypeButton}
                  onPress={() => setIsInstructor(false)}
                >
                  <Text style={section2Styles.userTypeText}>
                    Dancer
                  </Text>
                </Pressable>
              )}
              {isInstructor ? (
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[section2Styles.userTypeButton, section2Styles.userTypeButtonActive]}
                >
                  <Pressable
                    style={section2Styles.userTypeButton}
                    onPress={() => setIsInstructor(true)}
                  >
                    <Text style={[
                      section2Styles.userTypeText,
                      section2Styles.userTypeTextActive
                    ]}>
                      Instructor
                    </Text>
                  </Pressable>
                </LinearGradient>
              ) : (
                <Pressable
                  style={section2Styles.userTypeButton}
                  onPress={() => setIsInstructor(true)}
                >
                  <Text style={section2Styles.userTypeText}>
                    Instructor
                  </Text>
                </Pressable>
              )}
          </View>
        </View>
      </View>

      {/* Toggle Options */}
      <View style={section2Styles.toggleContainer}>
        {/* Terms and Conditions Toggle */}
        <Pressable
          style={section2Styles.toggleOption}
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={section2Styles.toggleIcon}>
            {agreeTerms ? (
              <LinearGradient
                colors={['#F708F7', '#C708F7', '#F76B0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                style={section2Styles.toggleGradient}
              >
                <Text style={section2Styles.checkmark}>✓</Text>
              </LinearGradient>
            ) : (
              <View style={section2Styles.toggleEmpty}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1.2, y: 0 }}
                  style={section2Styles.toggleBorder}
                >
                  <View style={section2Styles.toggleInner} />
                </LinearGradient>
              </View>
            )}
          </View>
          <Text style={section2Styles.toggleText}>
            By sign up I agree with <Text style={section2Styles.boldText}>Terms</Text> and <Text style={section2Styles.boldText}>Conditions</Text>
          </Text>
        </Pressable>

        {/* Privacy Policy Toggle */}
        <Pressable
          style={section2Styles.toggleOption}
          onPress={() => setAgreePrivacy(!agreePrivacy)}
        >
          <View style={section2Styles.toggleIcon}>
            {agreePrivacy ? (
              <LinearGradient
                colors={['#F708F7', '#C708F7', '#F76B0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                style={section2Styles.toggleGradient}
              >
                <Text style={section2Styles.checkmark}>✓</Text>
              </LinearGradient>
            ) : (
              <View style={section2Styles.toggleEmpty}>
                <LinearGradient
                  colors={['#F708F7', '#C708F7', '#F76B0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1.2, y: 0 }}
                  style={section2Styles.toggleBorder}
                >
                  <View style={section2Styles.toggleInner} />
                </LinearGradient>
              </View>
            )}
          </View>
          <Text style={section2Styles.toggleText}>
            By sign up I agree with <Text style={section2Styles.boldText}>Privacy</Text> and <Text style={section2Styles.boldText}>Policy</Text>
          </Text>
        </Pressable>
      </View>

    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Section 1 - Animated */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              transform: [
                { translateX: section1TranslateX },
                { scale: section1Scale }
              ],
              opacity: currentSection === 1 ? 1 : 0,
              pointerEvents: currentSection === 1 ? 'auto' : 'none',
            },
          ]}
        >
          {renderSection1()}
        </Animated.View>

        {/* Section 2 - Animated */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              transform: [
                { translateX: section2TranslateX },
                { scale: section2Scale }
              ],
              opacity: currentSection === 2 ? 1 : 0,
              pointerEvents: currentSection === 2 ? 'auto' : 'none',
            },
          ]}
        >
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
                  {renderSection2()}
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>

      {/* Footer - Fixed at bottom - Only for Section 1 */}
      {currentSection === 1 && (
        <View style={footerStyles.footer}>
          <Text style={footerStyles.section1FooterText}>Already have an account?</Text>
          <GradientButton
            title="Sign In"
            onPress={handleSignIn}
          />
        </View>
      )}

      {/* Footer - Fixed at bottom - Only for Section 2 */}
      {currentSection === 2 && (
        <View style={footerStyles.footer}>
          <GradientButton
            title={isLoading ? "Creating account..." : "Create account now"}
            onPress={handleCreateAccount}
            disabled={!isFormValid() || isLoading}
          />
          <Text style={footerStyles.section2FooterText}>
            Already have an account? <Pressable onPress={handleSignIn}><Text style={footerStyles.loginText}>Login</Text></Pressable>
          </Text>
        </View>
      )}

      <LoadingModal visible={isLoading} message="Creating your account..." />
    </SafeAreaView>
  );
}

// Section 1 Styles (Sign Up Options)
const section1Styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 60,
  },
  optionsContainer: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  optionButton: {
    backgroundColor: '#8A53C210',
    borderRadius: 100,
    marginBottom: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emailIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  googleIconText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#8B5CF6',
  },
  appleIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#8A53C2',
  },
});

// Section 2 Styles (Sign Up Form)
const section2Styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop:32,
    paddingHorizontal:16,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 4,
    marginLeft: 4,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8A53C210',
    borderRadius: 100,
    height: 56,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  toggleContainer: {
    width: '100%',
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    
  },
  toggleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBorder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    lineHeight: 20,
  },
  boldText: {
    fontFamily: Fonts.bold,
  },
  userTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    marginTop: 8,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 19,
    borderRadius: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTypeButtonActive: {
    shadowColor: '#F708F7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  userTypeText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#666666',
  },
  userTypeTextActive: {
    color: '#FFFFFF',
  },
});

// Footer Styles
const footerStyles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  section1FooterText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 20,
  },
  section2FooterText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    marginTop: 10,
    textAlign: 'center',
  },
  loginText: {
    color: '#F708F7',
    fontFamily: Fonts.bold,
    fontSize: 16,
    top: 4,
  },
});

// Common Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  sectionContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
