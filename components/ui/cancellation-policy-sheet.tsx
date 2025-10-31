import { Fonts } from '@/constants/theme';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import GradientButton from './gradient-button';

interface CancellationPolicySheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (policy: string, policyHeading?: string) => void;
  initialPolicy?: string;
  initialPolicyHeading?: string;
}

const POLICY_OPTIONS = {
  flexible: {
    title: 'Flexible Policy',
    description: 'Full refund for cancellations made at least 24 hours before class start time.\n\nNo refund for cancellations made less than 24 hours before class.\n\nYou can reschedule once for free within 7 days of the original class date.',
  },
  moderate: {
    title: 'Moderate Policy',
    description: '50% refund for cancellations made 48 hours before class start time.\n\nNo refund within 48 hours of the class.\n\nRescheduling is allowed only if requested more than 48 hours in advance.',
  },
  strict: {
    title: 'Strict Policy',
    description: 'No refund for cancellations within 72 hours of class start time.\n\nRescheduling is not available.\n\nRefunds are issued only if the instructor cancels or reschedules the class.',
  },
};

const CancellationPolicySheet: React.FC<CancellationPolicySheetProps> = ({
  visible,
  onClose,
  onSave,
  initialPolicy,
  initialPolicyHeading,
}) => {
  const [selectedPolicy, setSelectedPolicy] = useState<'flexible' | 'moderate' | 'strict' | 'custom' | null>(null);
  const [customPolicyText, setCustomPolicyText] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Bottom Sheet Ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  // Determine initial selection based on initialPolicy and initialPolicyHeading
  useEffect(() => {
    if (initialPolicy) {
      // First check if we have a heading (predefined policy)
      if (initialPolicyHeading) {
        // Match heading to determine policy type
        if (initialPolicyHeading === POLICY_OPTIONS.flexible.title) {
          setSelectedPolicy('flexible');
          setShowCustomInput(false);
          setCustomPolicyText('');
        } else if (initialPolicyHeading === POLICY_OPTIONS.moderate.title) {
          setSelectedPolicy('moderate');
          setShowCustomInput(false);
          setCustomPolicyText('');
        } else if (initialPolicyHeading === POLICY_OPTIONS.strict.title) {
          setSelectedPolicy('strict');
          setShowCustomInput(false);
          setCustomPolicyText('');
        } else {
          // It's a custom policy (fallback)
          setSelectedPolicy('custom');
          setShowCustomInput(true);
          setCustomPolicyText(initialPolicy);
        }
      } else {
        // No heading means it's a custom policy, or check by description match for backward compatibility
        if (initialPolicy === POLICY_OPTIONS.flexible.description) {
          setSelectedPolicy('flexible');
          setShowCustomInput(false);
          setCustomPolicyText('');
        } else if (initialPolicy === POLICY_OPTIONS.moderate.description) {
          setSelectedPolicy('moderate');
          setShowCustomInput(false);
          setCustomPolicyText('');
        } else if (initialPolicy === POLICY_OPTIONS.strict.description) {
          setSelectedPolicy('strict');
          setShowCustomInput(false);
          setCustomPolicyText('');
        } else {
          // It's a custom policy
          setSelectedPolicy('custom');
          setShowCustomInput(true);
          setCustomPolicyText(initialPolicy);
        }
      }
    } else {
      setSelectedPolicy(null);
      setShowCustomInput(false);
      setCustomPolicyText('');
    }
  }, [initialPolicy, initialPolicyHeading]);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['80%'], []);

  // Handle opening and closing the bottom sheet based on visible prop
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
      // Reset scroll position to top on open
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
      }, 50);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handlePolicySelect = (policy: 'flexible' | 'moderate' | 'strict' | 'custom') => {
    setSelectedPolicy(policy);
    if (policy === 'custom') {
      setShowCustomInput(true);
      // Focus the input after a short delay to ensure it's rendered
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 300);
    } else {
      setShowCustomInput(false);
      setCustomPolicyText('');
    }
  };

  const handleCustomInputFocus = () => {
    // Delay to ensure keyboard is showing
    setTimeout(() => {
      textInputRef.current?.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ 
            y: Math.max(0, y - 100), 
            animated: true 
          });
        },
        () => {}
      );
    }, 300);
  };

  const handleSave = () => {
    if (!selectedPolicy) {
      return;
    }

    let policyToSave = '';
    let policyHeading: string | undefined = undefined;
    
    if (selectedPolicy === 'custom') {
      if (customPolicyText.trim() === '') {
        return; // Don't save empty custom policy
      }
      policyToSave = customPolicyText.trim();
      // Custom policies have no heading
      policyHeading = undefined;
    } else {
      policyToSave = POLICY_OPTIONS[selectedPolicy].description;
      policyHeading = POLICY_OPTIONS[selectedPolicy].title;
    }

    Keyboard.dismiss();
    onSave(policyToSave, policyHeading);
    onClose();
  };

  // Render backdrop
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
            <Text style={styles.headerTitle}>Cancellation Policy</Text>
            <Pressable onPress={handleSheetClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
          >
          {/* Flexible Policy */}
          <Pressable
            style={[
              styles.policyOption,
              selectedPolicy === 'flexible' && styles.policyOptionSelected,
            ]}
            onPress={() => handlePolicySelect('flexible')}
          >
            <View style={styles.policyHeader}>
              <View style={[
                styles.radioButton,
                selectedPolicy === 'flexible' && styles.radioButtonSelected,
              ]}>
                {selectedPolicy === 'flexible' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={[
                styles.policyTitle,
                selectedPolicy === 'flexible' && styles.policyTitleSelected,
              ]}>
                {POLICY_OPTIONS.flexible.title}
              </Text>
            </View>
            <Text style={styles.policyDescription}>
              {POLICY_OPTIONS.flexible.description}
            </Text>
          </Pressable>

          {/* Moderate Policy */}
          <Pressable
            style={[
              styles.policyOption,
              selectedPolicy === 'moderate' && styles.policyOptionSelected,
            ]}
            onPress={() => handlePolicySelect('moderate')}
          >
            <View style={styles.policyHeader}>
              <View style={[
                styles.radioButton,
                selectedPolicy === 'moderate' && styles.radioButtonSelected,
              ]}>
                {selectedPolicy === 'moderate' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={[
                styles.policyTitle,
                selectedPolicy === 'moderate' && styles.policyTitleSelected,
              ]}>
                {POLICY_OPTIONS.moderate.title}
              </Text>
            </View>
            <Text style={styles.policyDescription}>
              {POLICY_OPTIONS.moderate.description}
            </Text>
          </Pressable>

          {/* Strict Policy */}
          <Pressable
            style={[
              styles.policyOption,
              selectedPolicy === 'strict' && styles.policyOptionSelected,
            ]}
            onPress={() => handlePolicySelect('strict')}
          >
            <View style={styles.policyHeader}>
              <View style={[
                styles.radioButton,
                selectedPolicy === 'strict' && styles.radioButtonSelected,
              ]}>
                {selectedPolicy === 'strict' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={[
                styles.policyTitle,
                selectedPolicy === 'strict' && styles.policyTitleSelected,
              ]}>
                {POLICY_OPTIONS.strict.title}
              </Text>
            </View>
            <Text style={styles.policyDescription}>
              {POLICY_OPTIONS.strict.description}
            </Text>
          </Pressable>

          {/* Custom Policy Option */}
          <Pressable
            style={[
              styles.policyOption,
              selectedPolicy === 'custom' && styles.policyOptionSelected,
            ]}
            onPress={() => handlePolicySelect('custom')}
          >
            <View style={styles.policyHeader}>
              <View style={[
                styles.radioButton,
                selectedPolicy === 'custom' && styles.radioButtonSelected,
              ]}>
                {selectedPolicy === 'custom' && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={[
                styles.policyTitle,
                selectedPolicy === 'custom' && styles.policyTitleSelected,
              ]}>
                Custom Policy
              </Text>
            </View>
            <Text style={styles.policyDescription}>
              Write your own cancellation policy
            </Text>
          </Pressable>

          {/* Custom Policy Input */}
          {showCustomInput && (
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>
                Write your custom policy ({customPolicyText.length}/300)
              </Text>
              <TextInput
                ref={textInputRef}
                style={styles.customInput}
                value={customPolicyText}
                onChangeText={setCustomPolicyText}
                onFocus={handleCustomInputFocus}
                placeholder="Enter your cancellation policy here...&#10;&#10;Example:&#10;• Full refund if cancelled 48 hours before&#10;• 50% refund if cancelled 24 hours before&#10;• No refund for late cancellations"
                placeholderTextColor="#999999"
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                maxLength={300}
              />
            </View>
          )}
            <View style={styles.footer}>
          <View style={styles.saveButtonContainer}>
            <GradientButton
              title="Save Policy"
              onPress={handleSave}
              disabled={!selectedPolicy || (selectedPolicy === 'custom' && customPolicyText.trim() === '')}
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
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  policyOption: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  policyOptionSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F5F3FF',
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonSelected: {
    borderColor: '#8B5CF6',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  policyTitle: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  policyTitleSelected: {
    color: '#8B5CF6',
  },
  policyDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#666666',
    lineHeight: 22,
    marginLeft: 36,
  },
  customInputContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  customInputLabel: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 12,
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
    minHeight: 150,
    maxHeight: 250,
    backgroundColor: '#F9FAFB',
  },
  footer: {
  
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  saveButtonContainer: {
    width: '100%',
  },
  saveButton: {
    paddingVertical: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
});

export default CancellationPolicySheet;

