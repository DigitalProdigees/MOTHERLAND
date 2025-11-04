import { Fonts } from '@/constants/theme';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

interface PostFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  selectedFilter?: string;
}

const filterOptions = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
];

const PostFilterModal: React.FC<PostFilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(initialFilters?.selectedFilter || '');

  // Bottom Sheet Ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Update internal state when initialFilters changes (e.g., when Clear All is clicked)
  useEffect(() => {
    setSelectedFilter(initialFilters?.selectedFilter || '');
  }, [initialFilters]);
  
  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['40%'], []);

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

  const handleSheetClose = useCallback(() => {
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  const handleFilterSelect = (filterId: string) => {
    const filters: FilterOptions = {
      selectedFilter: filterId
    };
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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
            {/* Filter Options */}
            <View style={styles.filterSection}>
              <View style={styles.filterOptionsContainer}>
                {filterOptions.map((option) => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.filterOption,
                      selectedFilter === option.id && styles.filterOptionSelected,
                    ]}
                    onPress={() => handleFilterSelect(option.id)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedFilter === option.id && styles.filterOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
        </BottomSheetScrollView>
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
    paddingTop: 20,
    
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: '#000000',
    marginBottom: 12,
  },
  filterOptionsContainer: {  },
  filterOption: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  filterOptionSelected: {
    backgroundColor: 'rgba(247, 8, 247, 0.05)',
    borderColor: '#C708F7',
  },
  filterOptionText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    fontWeight:'bold',
    color: '#666666',
  },
  filterOptionTextSelected: {
    color: '#F708F7',
    fontWeight:'bold'
  },
  footer: {
    flexDirection: 'row',
    marginBottom: 19,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 20,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
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

export default PostFilterModal;

