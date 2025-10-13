import GradientBackButton from '@/components/ui/gradient-back-button';
import GradientButton from '@/components/ui/gradient-button';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Get screen dimensions for dynamic content height
  const { height: screenHeight } = Dimensions.get('window');

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

  const handleEmailSignIn = () => {
    animateToSection2();
    // Delay state change to sync with animation
    setTimeout(() => setCurrentSection(2), 50);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign in
    console.log('Google sign in');
  };

  const handleAppleSignIn = () => {
    // TODO: Implement Apple sign in
    console.log('Apple sign in');
  };

  const handleBack = () => {
    animateToSection1();
    // Delay state change to sync with animation
    setTimeout(() => setCurrentSection(1), 50);
  };

  const handleSignIn = () => {
    // TODO: Implement sign in
    console.log('Sign in:', { email, password });
    router.replace('/(home)/home');
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
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
              <Text style={section1Styles.emailIconText}>✉</Text>
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
              <Text style={section1Styles.googleIconText}>G</Text>
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
              <Text style={section1Styles.appleIconText}>🍎</Text>
            </View>
            <Text style={section1Styles.optionText}>Apple ID</Text>
          </View>
        </Pressable>
      </View>
    </>
  );

  const renderSection2 = () => (
    <>
      {/* Back button */}
      <GradientBackButton onPress={handleBack} />
      <View style={{marginTop:25}}/>

      {/* Title */}
      <Text style={section2Styles.title}>Hi! Welcome Back</Text>
      <Text style={section2Styles.subtitle}>Login to your account</Text>
      
      {/* Input fields */}
      <View style={section2Styles.inputContainer}>
        {/* Email */}
        <View style={section2Styles.inputField}>
          <View style={section2Styles.inputIcon}>
            <Text style={section2Styles.inputIconText}>✉</Text>
          </View>
          <View style={section2Styles.inputContent}>
            <Text style={section2Styles.inputLabel}>Email</Text>
            <TextInput
              style={section2Styles.input}
              placeholder="example@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Password */}
        <View style={section2Styles.inputField}>
          <View style={section2Styles.inputIcon}>
            <Text style={section2Styles.inputIconText}>🔒</Text>
          </View>
          <View style={section2Styles.inputContent}>
            <Text style={section2Styles.inputLabel}>Password</Text>
            <TextInput
              style={section2Styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
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
        <Pressable onPress={() => console.log('Forgot password')}>
          <Text style={section2Styles.forgotPasswordText}>Forgot Password?</Text>
        </Pressable>
      </View>

      {/* Spacer to push button to bottom */}
      <View style={{ minHeight: 200 }} />

      {/* Login button and signup text - Inside ScrollView */}
      <View style={section2Styles.footerInScroll}>
        <GradientButton
          title="Login"
          onPress={handleSignIn}
        />
        <Text style={footerStyles.section2FooterText}>
          Don't have an account? <Pressable onPress={handleSignUp}><Text style={footerStyles.signUpText}>Sign Up</Text></Pressable>
        </Text>
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
              pointerEvents: currentSection === 2 ? 'auto' : 'none',
            },
          ]}
        >
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              minHeight: screenHeight + 200,
              paddingBottom:50
            }}
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
    </SafeAreaView>
  );
}

// Section 1 Styles (Sign In Options)
const section1Styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(138, 83, 194, 0.03)',
    borderRadius: 100,
    marginBottom: 16,
    height: 56,
    justifyContent: 'center',
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
  emailIconText: {
    fontSize: 18,
    color: '#8B5CF6',
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
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  appleIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appleIconText: {
    fontSize: 18,
    color: '#8B5CF6',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
});

// Section 2 Styles (Sign In Form)
const section2Styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 3, 194, 0.03)',
    borderRadius: 100,
    marginBottom: 16,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputIconText: {
    fontSize: 18,
    color: '#8B5CF6',
  },
  inputContent: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#8B5CF6',
    marginBottom: 2,
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    color: '#000000',
    padding: 0,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    marginBottom: 20,
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
    color: '#000000',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#222222',
    fontWeight: '500',
  },
  footerInScroll: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 50,
  },
});

// Footer Styles
const footerStyles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 20
  },
  section1FooterText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  section2FooterText: {
    fontSize: 16,
    color: '#000000',
    marginTop: 10,
    textAlign: 'center',
  },
  signUpText: {
    color: '#F708F7',
    fontWeight: '600',
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
    paddingHorizontal: 32,
    paddingTop: 20,
  },
});
