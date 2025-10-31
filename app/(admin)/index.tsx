import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminScreen() {
  const router = useRouter();
  
  // TODO: Before building for TestFlight/APK, update this to your deployed AdminFlow URL
  // Production URL format: 'https://your-adminflow-domain.com'
  // For local development/testing on real device, use your Mac's IP
  const ADMIN_WEB_URL = __DEV__ 
    ? 'http://192.168.30.216:3000'  // Development: local network
    : 'https://YOUR_PRODUCTION_URL_HERE.com'; // Production: Deploy AdminFlow and update this

  const handleOpenWebDashboard = async () => {
    try {
      const supported = await Linking.canOpenURL(ADMIN_WEB_URL);
      if (supported) {
        await Linking.openURL(ADMIN_WEB_URL);
      } else {
        Alert.alert('Error', `Cannot open URL: ${ADMIN_WEB_URL}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open the admin dashboard');
    }
  };

  return (
    <LinearGradient
    colors={['#F708F7', '#C708F7', '#F76B0B']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradient}
  >
    <SafeAreaView style={styles.container}>
    
        <View style={styles.content}>
          <Text style={styles.title}>Hello Admin!</Text>
          <Text style={styles.subtitle}>Welcome to the Admin Dashboard</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              📱 Admin Dashboard Access
            </Text>
            <Text style={styles.infoText}>
              The admin dashboard can only be accessed through the web interface.
            </Text>
            <Text style={styles.infoText}>
              Click the button below to open the dashboard in your browser.
            </Text>
         
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.webButton,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={handleOpenWebDashboard}
          >
            <Text style={styles.webButtonText}>Open Web Dashboard</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => router.replace('/(auth)/signin')}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </Pressable>
        </View>
     
    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 48,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    width: '100%',
    maxWidth: 400,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  urlContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
  },
  urlText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  webButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 16,
  },
  webButtonText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#F708F7',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});

