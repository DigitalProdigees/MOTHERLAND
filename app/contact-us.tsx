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

interface AttachedFile {
  id: string;
  name: string;
  size: string;
}

const ContactUs: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [problem, setProblem] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([
    { id: '1', name: 'File Name', size: '15 mb' },
    { id: '2', name: 'File Name', size: '15 mb' },
    { id: '3', name: 'File Name', size: '15 mb' },
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', { email, problem, attachedFiles });
    setShowSuccess(true);
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleAttachFile = () => {
    // Handle file attachment
    console.log('Attach file pressed');
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
        title="Your Request Sent!"
        iconSize={130}
      />

      {/* Status Bar Area */}
     

      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
            <Image
              source={require('@/assets/images/chevron-left.png')}
              style={styles.backIcon}
              resizeMode="contain"
            />
          
        </Pressable>
        <Text style={styles.headerTitle}>Contact Us</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <Image
              source={require('@/assets/images/envelope.png')}
              style={styles.inputIcon}
              resizeMode="contain"
            />
            <TextInput
              style={styles.textInput}
              placeholder="example@email.com"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Problem Description Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>What's your problem?</Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="I have problem..."
              placeholderTextColor="#999999"
              value={problem}
              onChangeText={setProblem}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Attached Files Section */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Attached File</Text>
          <View style={styles.filesContainer}>
            {attachedFiles.map((file, index) => (
              <View key={file.id}>
                <View style={styles.fileItem}>
                  <View style={styles.fileIconContainer}>
                    <Image
                      source={require('@/assets/images/filetype.png')}
                      style={styles.fileIcon}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <Text style={styles.fileSize}>{file.size}</Text>
                  </View>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={() => handleRemoveFile(file.id)}
                  >
                    <Image
                      source={require('@/assets/images/Trash-.png')}
                      style={styles.deleteIcon}
                      resizeMode="contain"
                    />
                  </Pressable>
                </View>
                {index < attachedFiles.length - 1 && <View style={styles.fileSeparator} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Attach File Button */}
      <View style={styles.attachFileContainer}>
        <Pressable style={styles.attachFileButton} onPress={handleAttachFile}>
          <Text style={styles.attachFileButtonText}>Attach File</Text>
        </Pressable>
      </View>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <LinearGradient
            colors={['#F708F7', '#C708F7', '#F76B0B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  statusTime: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
  },

  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  backButton: {
    position: 'absolute',
    zIndex:1,
    alignSelf:'flex-start',
    top:16,
    paddingHorizontal: 20,
  },
  backIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginBottom: 12,
    marginTop:10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(138, 83, 193, 0.03)',
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  textAreaContainer: {
    backgroundColor: 'rgba(138, 83, 193, 0.03)',
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 120,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    textAlignVertical: 'top',
  },
  filesContainer: {
    backgroundColor: '#FFFFFF',
     borderColor: '#E0E0E0',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#000000',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#999999',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: '#666666',
  },
  fileSeparator: {
    height: 1,
    backgroundColor: 'rgba(138, 83, 193, 0.15)',
    marginHorizontal:16,
  },
  attachFileContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  attachFileButton: {
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: '#E0E0E0',
  },
  attachFileButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  submitContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  submitButton: {
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
    borderRadius: 100,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});

export default ContactUs;
