import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TermsScreen() {
  const router = useRouter();

  const handleAccept = () => {
    router.push('/(auth)/privacy-policy');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.subtitle}>
          Please read and accept our terms
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing and using MotherLand Jams, you accept and agree to be bound by the terms and provision of this agreement.
        </Text>

        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.paragraph}>
          Permission is granted to temporarily download one copy of the materials on MotherLand Jams for personal, non-commercial transitory viewing only.
        </Text>

        <Text style={styles.sectionTitle}>3. Disclaimer</Text>
        <Text style={styles.paragraph}>
          The materials on MotherLand Jams are provided on an 'as is' basis. MotherLand Jams makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </Text>

        <Text style={styles.sectionTitle}>4. Limitations</Text>
        <Text style={styles.paragraph}>
          In no event shall MotherLand Jams or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MotherLand Jams.
        </Text>

        <Text style={styles.sectionTitle}>5. Accuracy of Materials</Text>
        <Text style={styles.paragraph}>
          The materials appearing on MotherLand Jams could include technical, typographical, or photographic errors. MotherLand Jams does not warrant that any of the materials on its website are accurate, complete or current.
        </Text>

        <Text style={styles.sectionTitle}>6. Links</Text>
        <Text style={styles.paragraph}>
          MotherLand Jams has not reviewed all of the sites linked to its app and is not responsible for the contents of any such linked site.
        </Text>

        <Text style={styles.sectionTitle}>7. Modifications</Text>
        <Text style={styles.paragraph}>
          MotherLand Jams may revise these terms of service at any time without notice. By using this app you are agreeing to be bound by the then current version of these terms of service.
        </Text>

        <Text style={styles.sectionTitle}>8. Governing Law</Text>
        <Text style={styles.paragraph}>
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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

