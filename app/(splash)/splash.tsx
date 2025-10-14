import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to signin after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 300,
    height: 300,
  },
});
