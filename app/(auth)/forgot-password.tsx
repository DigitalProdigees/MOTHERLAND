import GradientButton from '@/components/ui/gradient-button';
import Header from '@/components/ui/header';
import LoadingModal from '@/components/ui/loading-modal';
import { Fonts } from '@/constants/theme';
import { auth } from '@/firebase.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('tamoormalik088@gmail.com');
  const [emailSent, setEmailSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const STORAGE_KEY = 'forgot_password_timer';

  const maskEmail = (email: string) => {
    if (!email) return '@ex***@email.com';
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 2) return email;
    const maskedLocal = localPart.charAt(0) + '***';
    return `${maskedLocal}@${domain}`;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load timer state from storage on component mount
  useEffect(() => {
    loadTimerState();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            setIsTimerActive(false);
            AsyncStorage.removeItem(STORAGE_KEY);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, timeLeft]);

  // Save timer state to storage whenever it changes
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
        timeLeft,
        timestamp: Date.now(),
      }));
    }
  }, [timeLeft, isTimerActive]);

  const loadTimerState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { timeLeft: storedTime, timestamp } = JSON.parse(stored);
        const elapsed = Math.floor((Date.now() - timestamp) / 1000);
        const remainingTime = Math.max(0, storedTime - elapsed);
        
        if (remainingTime > 0) {
          setTimeLeft(remainingTime);
          setIsTimerActive(true);
          setEmailSent(true);
        } else {
          AsyncStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.log('Error loading timer state:', error);
    }
  };

  const startTimer = () => {
    const timerDuration = 5 * 60; // 5 minutes in seconds
    setTimeLeft(timerDuration);
    setIsTimerActive(true);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Store current email value before setting loading state
    const currentEmail = email;
    
    setIsLoading(true);
    
    try {
      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, currentEmail);
      
      // Email sent successfully
      setEmailSent(true);
      startTimer();
      
      // Show success alert with guidelines
      Alert.alert(
        'Email Sent Successfully!',
        `We've sent a password reset link to ${email}. Please check your email and follow these steps:\n\n1. Check your inbox (and spam folder)\n2. Click the reset link in the email\n3. Create a new password\n4. Sign in with your new password\n\nYou can resend the link after 5 minutes.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Optionally navigate back to signin
              // router.replace('/(auth)/signin');
            }
          }
        ]
      );
    } catch (error: any) {
      
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = async () => {
    if (isTimerActive) {
      return; // Button should be disabled, but just in case
    }
    
    setIsLoading(true);
    
    try {
      // Resend password reset email using Firebase
      await sendPasswordResetEmail(auth, email);
      
      startTimer();
      Alert.alert(
        'Link Resent!',
        `A new password reset link has been sent to ${email}. Please check your email.\n\nYou can resend again after 5 minutes.`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      
      let errorMessage = 'Failed to resend reset email. Please try again.';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    router.push('/(auth)/signin');
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <Header 
          title="Forgot Password"
          onBackPress={handleBackToSignIn}
        />
        
        <View style={styles.contentContainer}>
          <Text style={styles.instructionText}>
            We send you the link to {maskEmail(email)}, please check and click it to reset your password
          </Text>
          

          
          <View style={styles.buttonContainer}>
            <GradientButton
              title={isLoading ? "Sending..." : (isTimerActive && timeLeft > 0 ? `Resend The Link (${formatTime(timeLeft)})` : "Resend The Link")}
              onPress={handleResendLink}
              disabled={(isTimerActive && timeLeft > 0) || isLoading}
            />
          </View>
        </View>
        <LoadingModal visible={isLoading} message="Resending reset link..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Forgot Password"
          subtitle='Enter your email address and we will send you a link to reset your password.'
        onBackPress={handleBackToSignIn}
      />
      
      <View style={styles.contentContainer}>
    
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="example@email.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <GradientButton
            title={isLoading ? "Sending..." : "Send Reset Link"}
            onPress={handleResetPassword}
            disabled={isLoading}
          />
        </View>
      </View>
      <LoadingModal visible={isLoading} message="Sending reset link..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  timerText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#F708F7',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: '#8A53C210',
    borderRadius: 100,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
