import SuccessPopup from '@/components/ui/success-popup';
import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ChangePassword: React.FC = () => {
  const router = useRouter();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // Handle password change
    console.log('Password change submitted:', { confirmPassword, newPassword, confirmNewPassword });
    setShowSuccess(true);
  };

  const handleForgotPassword = () => {
    router.push('/settings/forgot-password');
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        router.replace('/(home)/home');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, router]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Success Popup */}
      <SuccessPopup
        visible={showSuccess}
        title="Your new password is saved!"
        iconSize={130}
      />

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
          <Text style={styles.headerTitle}>Change Password</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Confirm Your Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Confirm Your Password</Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('@/assets/images/lock1.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Confirm your password"
              placeholderTextColor="#999999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Create New Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Create New Password</Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('@/assets/images/lock1.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Create new password"
              placeholderTextColor="#999999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Confirm New Password Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Confirm New Password</Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('@/assets/images/LockConfim.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Confirm new password"
              placeholderTextColor="#999999"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry
            />
          </View>
        </View>

        {/* Forgot Password Link */}
        <View style={styles.forgotPasswordContainer}>
          <Pressable onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={['#F708F7', '#C708F7', '#F76B0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </LinearGradient>
        </Pressable>
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
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 24,
fontWeight: 'bold',    color: '#000000',
marginTop:30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 12,
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 83, 193, 0.03)',
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },
  saveContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  saveButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});

export default ChangePassword;
