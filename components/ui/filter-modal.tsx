import { Fonts } from '@/constants/theme';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import GradientButton from './gradient-button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  minAvailableSeats?: string;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
}) => {
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || '');
  const [minRating, setMinRating] = useState(initialFilters?.minRating || '');
  const [minAvailableSeats, setMinAvailableSeats] = useState(initialFilters?.minAvailableSeats || '');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Bottom Sheet Ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Update internal state when initialFilters changes (e.g., when Clear All is clicked)
  useEffect(() => {
    setMinPrice(initialFilters?.minPrice || '');
    setMaxPrice(initialFilters?.maxPrice || '');
    setMinRating(initialFilters?.minRating || '');
    setMinAvailableSeats(initialFilters?.minAvailableSeats || '');
  }, [initialFilters]);
  
  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['65%'], []);

  // Handle opening and closing the bottom sheet based on visible prop
  useEffect(() => {
    console.log('🟣 FILTER MODAL: visible prop changed to:', visible);
    if (visible) {
      console.log('🟣 FILTER MODAL: Expanding bottom sheet');
      bottomSheetRef.current?.expand();
    } else {
      console.log('🟣 FILTER MODAL: Closing bottom sheet');
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  // Listen to keyboard events
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSheetClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setMinAvailableSeats('');
  };

  const handleApply = () => {
    const filters: FilterOptions = {};
    
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (minRating) filters.minRating = minRating;
    if (minAvailableSeats) filters.minAvailableSeats = minAvailableSeats;
    
    Keyboard.dismiss();
    onApplyFilters(filters);
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
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Options</Text>
          <Pressable onPress={handleSheetClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <BottomSheetScrollView 
          style={styles.content} 
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: isKeyboardVisible ? 130 : 0 }
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Price Range ($)</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceInputLabel}>Min</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0"
                    placeholderTextColor="#999"
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.priceInputContainer}>
                  <Text style={styles.priceInputLabel}>Max</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="999"
                    placeholderTextColor="#999"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Rating */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Minimum Rating</Text>
              <View style={styles.ratingRow}>
                {['1', '2', '3', '4', '5'].map((rating) => (
                  <Pressable
                    key={rating}
                    style={[
                      styles.ratingButton,
                      minRating === rating && styles.ratingButtonSelected,
                    ]}
                    onPress={() => setMinRating(minRating === rating ? '' : rating)}
                  >
                    <Text
                      style={[
                        styles.ratingButtonText,
                        minRating === rating && styles.ratingButtonTextSelected,
                      ]}
                    >
                      {rating}+
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Available Seats */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Minimum Available Seats</Text>
              <View style={styles.seatsInputContainer}>
                <TextInput
                  style={styles.seatsInput}
                  placeholder="Enter minimum seats"
                  placeholderTextColor="#999"
                  value={minAvailableSeats}
                  onChangeText={setMinAvailableSeats}
                  keyboardType="numeric"
                />
              </View>
            </View>
              <View style={styles.footer}>
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
          <View style={styles.applyButtonContainer}>
            <GradientButton
              title="Apply Filters"
              onPress={handleApply}
              style={styles.applyButton}
              textStyle={styles.applyButtonText}
            />
          </View>
        </View>
        </BottomSheetScrollView>

        {/* Footer Actions */}
      
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
    fontFamily: Fonts.semiBold,
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

  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceInputLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#666666',
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop:12,
    flexWrap: 'wrap',
  },
  ratingButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  ratingButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  ratingButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#666666',
  },
  ratingButtonTextSelected: {
    color: '#FFFFFF',
  },
  seatsInputContainer: {
    marginTop: 8,
  },
  seatsInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    marginBottom:19,
    gap: 12,
    borderTopColor: '#E0E0E0',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#666666',
  },
  applyButtonContainer: {
    flex: 1,
  },
  applyButton: {
    paddingVertical: 0,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },
});

export default FilterModal;
