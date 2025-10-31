import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [email] = useState('ex***@email.com'); // This would come from props or state

  const handleBack = () => {
    router.back();
  };

  const handleResendLink = () => {
    router.push('/(home)/settings/reset-password');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('@/assets/images/chevron-left.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.message}>
          We send you the link to {email}, please check and click it to reset your password
        </Text>

        {/* Resend Link Button */}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.resendButton} onPress={handleResendLink}>
            <LinearGradient
              colors={['#F708F7', '#C708F7', '#F76B0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.resendButtonText}>Resend The Link</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 80,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginTop: 30,
  },
  content: {
    
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  resendButton: {
    borderRadius: 100,
    overflow: 'hidden',
    shadowColor: '#C708F7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  resendButtonText: {
    fontSize: 18,
fontWeight:'500',    color: '#FFFFFF',
  },
});

export default ForgotPassword;
