import GradientBackButton from '@/components/ui/gradient-back-button';
import GradientButton from '@/components/ui/gradient-button';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

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
    // TODO: Implement Google sign up
    console.log('Google sign up');
  };

  const handleAppleSignUp = () => {
    // TODO: Implement Apple sign up
    console.log('Apple sign up');
  };

  const handleBack = () => {
    animateToSection1();
    // Delay state change to sync with animation
    setTimeout(() => setCurrentSection(1), 50);
  };

  const handleCreateAccount = () => {
    // TODO: Implement account creation
    console.log('Create account:', { fullName, email, password, confirmPassword });
    router.push('/(auth)/terms');
  };

  const handleSignIn = () => {
    router.push('/(auth)/signin');
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
          onPress={handleGoogleSignUp}
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
          onPress={handleAppleSignUp}
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
      <Text style={section2Styles.title}>Get Started</Text>
      <Text style={section2Styles.subtitle}>Create new account to continue</Text>
      
      {/* Input fields */}
        <View style={section2Styles.inputContainer}>
        {/* Full Name */}
        <View style={section2Styles.inputField}>
          <View style={section2Styles.inputIcon}>
            <Text style={section2Styles.inputIconText}>👤</Text>
          </View>
          <TextInput
            style={section2Styles.input}
            placeholder="ex, john doe"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <View style={section2Styles.inputField}>
          <View style={section2Styles.inputIcon}>
            <Text style={section2Styles.inputIconText}>✉</Text>
          </View>
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
          
        {/* Password */}
        <View style={section2Styles.inputField}>
          <View style={section2Styles.inputIcon}>
            <Text style={section2Styles.inputIconText}>🔒</Text>
          </View>
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
          
        {/* Confirm Password */}
        <View style={section2Styles.inputField}>
          <View style={section2Styles.inputIcon}>
            <Text style={section2Styles.inputIconText}>🔒</Text>
          </View>
          <TextInput
            style={section2Styles.input}
            placeholder="Confirm password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
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

      {/* Footer for Section 2 - Inside ScrollView */}
      <View style={section2Styles.footerInScroll}>
        <GradientButton
          title="Create account now"
          onPress={handleCreateAccount}
        />
        <Text style={footerStyles.section2FooterText}>
          Already have an account? <Pressable onPress={handleSignIn}><Text style={footerStyles.loginText}>Login</Text></Pressable>
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
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <ScrollView
              ref={scrollViewRef}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 40 }}
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
        
    </SafeAreaView>
  );
}

// Section 1 Styles (Sign Up Options)
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

// Section 2 Styles (Sign Up Form)
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
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 3, 194, 0.03)',
    borderRadius: 100,
    marginBottom: 16,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  toggleContainer: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    marginTop: 20,
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
    color: '#000000',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
  },
  footerInScroll: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 60,
    paddingBottom: 20,
  },
});

// Footer Styles
const footerStyles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
    paddingBottom: 32,
    paddingTop: 20,
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
  loginText: {
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
