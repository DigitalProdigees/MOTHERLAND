import { Fonts, Icons } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface SearchBarProps {
  onPress?: () => void;
  onFilterPress?: () => void;
  onSearchChange?: (text: string) => void;
  placeholder?: string;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const { 
    onPress, 
    onFilterPress, 
    onSearchChange, 
    placeholder = "Search here",
    value 
  } = props;
  
  const [searchText, setSearchText] = useState(value || '');
  
  // Update search text when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSearchText(value);
    }
  }, [value]);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    onSearchChange?.(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.leftContent}>
          <Icons.Map width={29} height={29} />
          <Icons.Search width={25} height={25} />
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#222222"
            value={searchText}
            onChangeText={handleTextChange}
            onFocus={onPress}
            multiline={false}
            returnKeyType="search"
          />
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
            <Icons.Setting width={23} height={23} />
          </Pressable>
        </View>
      </View>
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
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingRight:10,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateRange: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#222222',
  },
  filterButton: {
    padding: 4,
  },
});

export default SearchBar;
