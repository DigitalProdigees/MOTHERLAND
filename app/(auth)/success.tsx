import SuccessIcon from '@/assets/svg/Success';
import { Fonts } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SuccessScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to profile info after 3 seconds
    const timer = setTimeout(() => {
      router.dismissAll();
      router.replace('/(onboarding)/profile-info');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <SuccessIcon width={162} height={162} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Successfully Verified</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Your account is set now, we will redirect you to complete your profile
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
});
