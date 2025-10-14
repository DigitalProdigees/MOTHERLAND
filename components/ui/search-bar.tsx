import { Fonts } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface SearchBarProps {
  onPress?: () => void;
  onFilterPress?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onPress, onFilterPress }) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.searchContainer,
          { opacity: pressed ? 0.9 : 1 }
        ]}
        onPress={onPress}
      >
        <View style={styles.leftContent}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.placeholder}>Search here</Text>
        </View>
        
        <View style={styles.rightContent}>
          <Text style={styles.dateRange}>7/6 - 7/12</Text>
          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={onFilterPress}
          >
            <Text style={styles.filterIcon}>⚙️</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  placeholder: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#999999',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateRange: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#999999',
  },
  filterButton: {
    padding: 4,
  },
  filterIcon: {
    fontSize: 16,
  },
});

export default SearchBar;
