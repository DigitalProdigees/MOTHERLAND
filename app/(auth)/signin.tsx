import GradientButton from '@/components/ui/gradient-button';
import Header from '@/components/ui/header';
import LoadingModal from '@/components/ui/loading-modal';
import { Fonts, Icons } from '@/constants/theme';
import { auth, database } from '@/firebase.config';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignInScreen() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [email, setEmail] = useState('tamoormalik088@gmail.com');
  const [password, setPassword] = useState('88888888');
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preservedFormData, setPreservedFormData] = useState<{email: string, password: string} | null>(null);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const emailRef = useRef<View>(null);
  const passwordRef = useRef<View>(null);

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

  // Restore form data when loading finishes
  useEffect(() => {
    if (!isLoading && preservedFormData) {
      setEmail(preservedFormData.email);
      setPassword(preservedFormData.password);
      setPreservedFormData(null);
    }
  }, [isLoading, preservedFormData]);

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

  const handleEmailSignIn = () => {
    animateToSection2();
    // Delay state change to sync with animation
    setTimeout(() => setCurrentSection(2), 50);
  };

  const handleGoogleSignIn = () => {
    Alert.alert(
      'Coming Soon',
      'Google Sign In will be available soon!',
      [{ text: 'OK' }]
    );
  };

  const handleAppleSignIn = () => {
    Alert.alert(
      'Coming Soon',
      'Apple Sign In will be available soon!',
      [{ text: 'OK' }]
    );
  };

  const handleBack = () => {
    animateToSection1();
    // Delay state change to sync with animation
    setTimeout(() => setCurrentSection(1), 50);
  };

  const handleSignIn = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill in all fields correctly');
      return;
    }

    // Store current values in preserved state
    setPreservedFormData({ email, password });
    setIsLoading(true);
    
    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Sign in successful:', { uid: user.uid, email: user.email });
      
      // Check user type and navigate accordingly
      try {
        const userRef = ref(database, `users/${user.uid}/personalInfo/userType`);
        const snapshot = await get(userRef);
        const userType = snapshot.val();
        
        if (userType === 'instructor') {
          router.replace('/(instructor)/home');
        } else {
          router.replace('/(home)/home');
        }
      } catch (userTypeError) {
        // If user type fetch fails, go back to auth
        router.replace('/(auth)/signin');
      }
      
    } catch (error: any) {
      
      let errorMessage = 'Failed to sign in. Please try again.';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
      }
      
      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.replace('/(auth)/signup');
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
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
  };

  const handleBlurEmail = () => {
    setFocusedInput(null);
    setErrors({ ...errors, email: validateEmail(email) });
  };

  const handleBlurPassword = () => {
    setFocusedInput(null);
    setErrors({ ...errors, password: validatePassword(password) });
  };

  const isFormValid = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    return !emailError && !passwordError;
  };

  const renderSection1 = () => (
    <>
      {/* Title */}
      <Text style={section1Styles.title}>Sign In</Text>
      
      {/* Sign in options */}
      <View style={section1Styles.optionsContainer}>
        {/* Email option */}
        <Pressable
          style={({ pressed }) => [
            section1Styles.optionButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={handleEmailSignIn}
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
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={handleGoogleSignIn}
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
          onPress={handleAppleSignIn}
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
        title="Hi! Welcome Back"
        subtitle="Login to your account"
        onBackPress={handleBack}
      />
      
      {/* Input fields */}
      <View style={section2Styles.inputContainer}>
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
              selectionColor="#8A53C2"
              importantForAutofill="no"
            />
          </View>
          {errors.password ? <Text style={section2Styles.errorText}>{errors.password}</Text> : null}
        </View>
      </View>
      
      {/* Remember me and Forgot password */}
      <View style={section2Styles.optionsRow}>
        <Pressable style={section2Styles.rememberMeContainer} onPress={toggleRememberMe}>
          {rememberMe ? (
            <LinearGradient
              colors={['#F708F7', '#C708F7', '#F76B0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1.2, y: 0 }}
              style={section2Styles.checkbox}
            >
              <Text style={section2Styles.checkmark}>✓</Text>
            </LinearGradient>
          ) : (
            <View style={section2Styles.checkboxEmpty}>
              <LinearGradient
                colors={['#F708F7', '#C708F7', '#F76B0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.2, y: 0 }}
                style={section2Styles.checkboxBorder}
              >
                <View style={section2Styles.checkboxInner} />
              </LinearGradient>
            </View>
          )}
          <Text style={section2Styles.rememberMeText}>Remember me</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={section2Styles.forgotPasswordText}>Forgot Password?</Text>
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
              paddingHorizontal: 32,
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
          <Text style={footerStyles.section1FooterText}>Don't have an account?</Text>
          <GradientButton
            title="Sign Up"
            onPress={handleSignUp}
          />
        </View>
      )}

      {/* Footer - Fixed at bottom - Only for Section 2 */}
      {currentSection === 2 && (
        <View style={footerStyles.footer}>
          <GradientButton
            title={isLoading ? "Signing in..." : "Login"}
            onPress={handleSignIn}
            disabled={!isFormValid() || isLoading}
          />
          <Text style={footerStyles.section2FooterText}>
            Don't have an account? <Pressable onPress={handleSignUp}><Text style={footerStyles.signUpText}>Sign Up</Text></Pressable>
          </Text>
        </View>
      )}

      <LoadingModal visible={isLoading} message="Signing you in..." />
    </SafeAreaView>
  );
}

// Section 1 Styles (Sign In Options)
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

// Section 2 Styles (Sign In Form)
const section2Styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 60,
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
    marginTop: 32,
    marginBottom: 20,
    paddingHorizontal: 16,
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
    color: '#000000 !important',
    padding: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxEmpty: {
    width: 24,
    height: 24,
    borderRadius: 60,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBorder: {
    width: 24,
    height: 24,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rememberMeText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#222222',
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
  signUpText: {
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
