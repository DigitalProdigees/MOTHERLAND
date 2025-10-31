import { Fonts } from '@/constants/theme';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import GradientButton from './gradient-button';

interface TermsConditionsSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (terms: string) => void;
  initialTerms?: string;
}

const TermsConditionsSheet: React.FC<TermsConditionsSheetProps> = ({
  visible,
  onClose,
  onSave,
  initialTerms,
}) => {
  const [termsText, setTermsText] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);
  const previousTextRef = useRef<string>('');
  const inputContainerRef = useRef<View>(null);
  const [inputHeight, setInputHeight] = useState(250);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Initialize with existing terms
  useEffect(() => {
    if (initialTerms && initialTerms.length > 0) {
      // Check if terms already have numbering, if not add it
      const lines = initialTerms.split('\n');
      const numberedLines = lines.map((line, index) => {
        const trimmedLine = line.trim();
        // Check if line already starts with a number pattern (1., 2., etc.)
        if (/^\d+\.\s/.test(trimmedLine)) {
          return trimmedLine;
        } else if (trimmedLine === '') {
          return '';
        } else {
          // Add number if missing
          return `${index + 1}. ${trimmedLine}`;
        }
      });
      const finalText = numberedLines.join('\n');
      setTermsText(finalText);
      previousTextRef.current = finalText;
    } else {
      const initialValue = '1. ';
      setTermsText(initialValue);
      previousTextRef.current = initialValue;
    }
  }, [initialTerms, visible]);

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
      y: 80, // 👈 controls how far up to move (adjust 40–120 for your layout)
      animated: true,
    });
  }, []);

  const handleTextChange = (text: string) => {
    const previousText = previousTextRef.current;

    // Detect if this is a backspace (text got shorter)
    const isBackspace = text.length < previousText.length;

    if (isBackspace) {
      // Handle backspace on lines with just numbers
      const lines = text.split('\n');
      const lastLine = lines[lines.length - 1] || '';
      
      // Check if last line matches a number pattern at the start (1., 2., etc.) but is now empty or incomplete
      // Match patterns like "1.", "2. ", "1", etc. (just the number prefix without content)
      const numberMatch = lastLine.match(/^(\d+)\.?\s?$/);
      
      // If last line is empty or only has number prefix (just created), remove the entire line
      if (lastLine.trim() === '' || numberMatch) {
        // Remove the last line (which is empty or only has number)
        const newLines = lines.slice(0, -1);
        if (newLines.length > 0) {
          // Join lines and ensure last line ends properly
          const newText = newLines.join('\n');
          setTermsText(newText);
          previousTextRef.current = newText;
        } else {
          // If no lines left, start fresh with "1. "
          const freshStart = '1. ';
          setTermsText(freshStart);
          previousTextRef.current = freshStart;
        }
        return;
      }
      
      // If backspacing on a line that starts with number, allow normal deletion
      setTermsText(text);
      previousTextRef.current = text;
    } else if (text.endsWith('\n')) {
      // Handle new lines - add next number automatically
      const lines = text.split('\n');
      const lastLine = lines[lines.length - 2] || ''; // Get the line before the newline
      
      // Extract current line number
      const numberMatch = lastLine.match(/^(\d+)\.\s/);
      let nextText = text;
      if (numberMatch) {
        const currentNum = parseInt(numberMatch[1], 10);
        const nextNum = currentNum + 1;
        nextText = text + `${nextNum}. `;
      } else {
        // If no number found, start with 1
        const lineCount = lines.filter(l => l.trim() !== '').length;
        nextText = text + `${lineCount + 1}. `;
      }
      setTermsText(nextText);
      previousTextRef.current = nextText;
      
      // Auto-scroll when new line is added
      scrollToInput();
    } else {
      setTermsText(text);
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
    // Save with numbers as-is (preserve format with line breaks)
    const trimmedTerms = termsText.trim();
    
    if (trimmedTerms === '' || trimmedTerms.replace(/\d+\.\s/g, '').trim() === '') {
      return;
    }

    Keyboard.dismiss();
    onSave(trimmedTerms);
    onClose();
  };

  const getTotalCharacters = () => {
    return termsText.length;
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
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      enableDynamicSizing={false}
    >
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Terms and Conditions</Text>
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
              Write your custom terms and conditions that guests should follow before attending the class.
            </Text>
          </View>

          {/* Character Count */}
          <View style={styles.characterCountContainer}>
            <Text style={styles.characterCountText}>
              {getTotalCharacters()}/500
            </Text>
          </View>

          {/* Terms Input Field */}
          <View 
            ref={inputContainerRef}
            style={styles.termsInputContainer}
            onLayout={() => scrollToInput()}
          >
            <TextInput
              ref={textInputRef}
              style={[styles.termsInput, { height: inputHeight }]}
              value={termsText}
              onChangeText={handleTextChange}
              onFocus={handleInputFocus}
              onContentSizeChange={handleContentSizeChange}
              onSelectionChange={scrollToInput}
              placeholder="1. Type your first term and press Enter for the next one"
              placeholderTextColor="#999999"
              multiline
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.saveButtonContainer}>
              <GradientButton
                title="Save Terms"
                onPress={handleSave}
                disabled={termsText.trim() === ''}
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
    paddingBottom: 400,
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
  termsInputContainer: {
    marginBottom: 24,
  },
  termsInput: {
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

export default TermsConditionsSheet;

