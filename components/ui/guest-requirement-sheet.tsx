import { Fonts } from '@/constants/theme';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import GradientButton from './gradient-button';

interface GuestRequirementSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (requirements: string[]) => void;
  initialRequirements?: string[];
}

const GuestRequirementSheet: React.FC<GuestRequirementSheetProps> = ({
  visible,
  onClose,
  onSave,
  initialRequirements,
}) => {
  const [requirementsText, setRequirementsText] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const previousTextRef = useRef<string>('');
  const inputContainerRef = useRef<View>(null);
  const [inputHeight, setInputHeight] = useState(250);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Initialize with existing requirements
  useEffect(() => {
    if (initialRequirements && initialRequirements.length > 0) {
      // Convert array to text with bullets
      const text = initialRequirements.map(req => `• ${req}`).join('\n');
      setRequirementsText(text);
      previousTextRef.current = text;
    } else {
      setRequirementsText('• ');
      previousTextRef.current = '• ';
    }
  }, [initialRequirements, visible]);

  const snapPoints = useMemo(() => ['85%'], []);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const scrollToInput = useCallback(() => {
    if (!scrollViewRef.current) return;
  
    scrollViewRef.current.scrollTo({
      y: 80,
      animated: true,
    });
  }, []);

  const handleTextChange = (text: string) => {
    const previousText = previousTextRef.current;

    // Detect if this is a backspace (text got shorter)
    const isBackspace = text.length < previousText.length;

    if (isBackspace) {
      // Handle backspace on lines with just bullets
      const lines = text.split('\n');
      const lastLine = lines[lines.length - 1] || '';
      
      // If last line is empty or only has bullet prefix (just created), remove the entire line
      if (lastLine.trim() === '' || lastLine === '•' || lastLine === '• ') {
        // Remove the last line (which is empty or only has bullet)
        const newLines = lines.slice(0, -1);
        if (newLines.length > 0) {
          // Join lines and ensure last line ends properly
          const newText = newLines.join('\n');
          setRequirementsText(newText);
          previousTextRef.current = newText;
        } else {
          // If no lines left, start fresh with a bullet
          const freshStart = '• ';
          setRequirementsText(freshStart);
          previousTextRef.current = freshStart;
        }
        return;
      }
      
      // If backspacing on a line that starts with bullet, allow normal deletion
      setRequirementsText(text);
      previousTextRef.current = text;
    } else if (text.endsWith('\n')) {
      // Handle new lines - add bullet automatically
      const newText = text + '• ';
      setRequirementsText(newText);
      previousTextRef.current = newText;
      // Auto-scroll when new line is added
      scrollToInput();
    } else {
      setRequirementsText(text);
      previousTextRef.current = text;
    }
  };

  const handleInputFocus = () => {
    // Delay to ensure keyboard is showing
    setTimeout(() => {
      scrollToInput();
    }, 120);
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
  
    // Auto-scroll when content grows (new lines added)
    scrollToInput();
  };

  const handleSave = () => {
    // Convert text to array by splitting lines and removing bullets
    const lines = requirementsText
      .split('\n')
      .map(line => line.replace(/^•\s*/, '').trim())
      .filter(line => line !== '');
    
    if (lines.length === 0) {
      return;
    }

    Keyboard.dismiss();
    onSave(lines);
    onClose();
  };

  const getTotalCharacters = () => {
    return requirementsText.length;
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  // Keyboard padding handling - keep extra bottom inset equal to keyboard height
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e: any) => {
        setKeyboardHeight(e.endCoordinates?.height ?? 0);
        scrollToInput();
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [scrollToInput]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleSheetClose}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.modalContent}
      handleIndicatorStyle={styles.handleIndicator}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableDynamicSizing={false}
    >
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Guest Requirements</Text>
            <Pressable onPress={handleSheetClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.content}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(210, keyboardHeight + 120) }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
          >
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              Add requirements for your guests that they shouldShowToggle follow before attending the class.
            </Text>
          </View>

          {/* Character Count */}
          <View style={styles.characterCountContainer}>
            <Text style={styles.characterCountText}>
              {getTotalCharacters()}/500
            </Text>
          </View>

          {/* Requirements Input Field */}
          <View 
            style={styles.requirementsInputContainer}
            ref={inputContainerRef}
            onLayout={() => scrollToInput()}
          >
            <TextInput
              ref={textInputRef}
              style={[styles.requirementsInput, { height: inputHeight }]}
              value={requirementsText}
              onChangeText={handleTextChange}
              onFocus={handleInputFocus}
              onContentSizeChange={handleContentSizeChange}
              onSelectionChange={scrollToInput}
              placeholder="• Type your requirement and press Enter for the next one"
              placeholderTextColor="#999999"
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Examples */}
          <View style={styles.footer}>
          <View style={styles.saveButtonContainer}>
            <GradientButton
              title="Save Requirements"
              onPress={handleSave}
              disabled={requirementsText.replace(/[•\s]/g, '').trim() === ''}
              style={styles.saveButton}
              textStyle={styles.saveButtonText}
            />
          </View>
        </View>
         
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#CCCCCC',
    width: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666666',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 200,
  },
  instructionContainer: {
    backgroundColor: '#F5F3FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 18,
  },
  characterCountContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  characterCountText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#666666',
  },
  requirementsInputContainer: {
    marginBottom: 24,
  },
  requirementsInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    backgroundColor: '#F9FAFB',
    minHeight: 250,
    lineHeight: 24,
  },
  exampleContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  exampleTitle: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 12,
  },
  exampleRow: {
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 20,
  },
  footer: {
    paddingBottom: 20,
    paddingTop: 20,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  saveButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    paddingVertical: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
});

export default GuestRequirementSheet;

