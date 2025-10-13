import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const handleAccept = () => {
    router.replace('/(home)/home');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subtitle}>
          How we handle your information
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, and any other information you choose to provide.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to provide, maintain, and improve our services, to develop new services, and to protect MotherLand Jams and our users. We also use this information to offer you customized content.
        </Text>

        <Text style={styles.sectionTitle}>3. Information Sharing and Disclosure</Text>
        <Text style={styles.paragraph}>
          We do not share your personal information with companies, organizations, or individuals outside of MotherLand Jams except in the following cases: with your consent, for external processing, or for legal reasons.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We work hard to protect MotherLand Jams and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. We encrypt many of our services using SSL and review our information collection, storage, and processing practices.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Retention</Text>
        <Text style={styles.paragraph}>
          We retain the data we collect for different periods of time depending on what it is, how we use it, and how you configure your settings. We delete or anonymize your information when we no longer need it.
        </Text>

        <Text style={styles.sectionTitle}>6. Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to access, update, or delete your personal information at any time. You can also object to processing of your personal information, ask us to restrict processing, or request portability of your information.
        </Text>

        <Text style={styles.sectionTitle}>7. Cookies and Similar Technologies</Text>
        <Text style={styles.paragraph}>
          We use cookies and similar technologies to provide and support our services and each of the uses outlined and described in this Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may change this privacy policy from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us through our support channels.
        </Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.acceptButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={handleAccept}
        >
          <Text style={styles.acceptButtonText}>Accept & Continue</Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
    marginBottom: 12,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  acceptButton: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

