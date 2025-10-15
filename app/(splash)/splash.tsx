import { auth, database } from '@/firebase.config';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { get, ref } from 'firebase/database';
import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const timer = setTimeout(async () => {
        if (user) {
          try {
            // Get user type
            const userRef = ref(database, `users/${user.uid}/personalInfo/userType`);
            const snapshot = await get(userRef);
            const userType = snapshot.val();
            
            // Simple navigation based on user type
            if (userType === 'instructor') {
              router.replace('/(instructor)/home');
            } else {
              router.replace('/(home)/home');
            }
          } catch (error) {
            // If fetching user type fails, go to auth
            router.replace('/(auth)/signin');
          }
        } else {
          router.replace('/(onboarding)/onboarding');
        }
      }, 2000);

      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
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
