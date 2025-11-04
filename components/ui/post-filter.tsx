import { Fonts } from '@/constants/theme';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PostFilterProps {
  visible: boolean;
  onClose: () => void;
  onSelectFilter: (filterId: string) => void;
  selectedFilter: string;
}

const filterOptions = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'newest', label: 'Newest' },
  { id: 'oldest', label: 'Oldest' },
];

const PostFilter: React.FC<PostFilterProps> = ({
  visible,
  onClose,
  onSelectFilter,
  selectedFilter,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['40%'], []);

  // Handle opening and closing the bottom sheet based on visible prop
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleSheetClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleFilterSelect = (filterId: string) => {
    onSelectFilter(filterId);
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
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filters</Text>
          <Pressable onPress={handleSheetClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        {/* Filter Options */}
        <View style={styles.filterOptions}>
          {filterOptions.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.filterOption,
                selectedFilter === option.label && styles.selectedFilterBackground,
              ]}
              onPress={() => handleFilterSelect(option.id)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  selectedFilter === option.label && styles.selectedFilterText,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleIndicator: {
    backgroundColor: '#CCCCCC',
    width: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 23,
    color: '#000000',
    fontWeight: 'bold',
  },
  filterOptions: {
    paddingBottom: 40,
  },
  filterOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  filterOptionText: {
    fontSize: 19,
    fontWeight: '500',
    color: '#000000',
  },
  selectedFilterText: {
    fontWeight: '500',
    color: '#C708F7',
  },
  selectedFilterBackground: {
    backgroundColor: 'rgba(247, 8, 247, 0.05)',
  },
});

export default PostFilter;

