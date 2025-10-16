import { Fonts, Icons } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface CategoriesSectionProps {
  onSeeAllPress?: () => void;
  onCategoryPress?: (category: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSeeAllPress,
  onCategoryPress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all'); // Default to 'All Classes'
  
  const categories = [
    { id: 'all', label: 'All Classes', icon: 'vector', isVector: true },
    { id: 'hip-hop', label: 'Hip-Hop', icon: 'hiphop', isVector: true },
    { id: 'salsa', label: 'Salsa', icon: 'salsa', isVector: true },
    { id: 'tap', label: 'Tap Dance', icon: 'tap', isVector: true },
    { id: 'swing', label: 'Swing', icon: 'swing', isVector: true },
    { id: 'jazz', label: 'Jazz Dance', icon: 'jazz', isVector: true },
    { id: 'ballet', label: 'Ballet Dance', icon: 'ballet', isVector: true },
    { id: 'contemporary', label: 'Contemporary', icon: 'contemporary', isVector: true },
    { id: 'modern', label: 'Modern Dance', icon: 'modern', isVector: true },


  ];

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryPress?.(categoryId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Pressable
          style={({ pressed }) => [
            styles.seeAllButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={onSeeAllPress}
        >
          <Text style={styles.seeAllText}>See all</Text>
        </Pressable>
      </View>

      <View style={styles.categoriesGrid}>
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id;
          return (
            <Pressable
              key={category.id}
              style={({ pressed }) => [
                styles.categoryButton,
                isSelected && styles.categoryButtonSelected,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View style={styles.categoryContent}>
                {/* Tick mark for selected category */}
                {isSelected && (
                  <LinearGradient
                    colors={['#F708F7', '#C708F7', '#F76B0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tickContainer}
                  >
                    <Text style={styles.tickMark}>✓</Text>
                  </LinearGradient>
                )}
                
                <View style={styles.categoryIconContainer}>
                  {category.isVector ? (
                    <>
                      {category.icon === 'vector' && <Icons.Vector width={35} height={35} marginLeft={5} marginRight={-8}/>}
                      {category.icon === 'hiphop' && <Icons.HipHop width={35} height={35} marginLeft={9} marginRight={-8}/>}
                      {category.icon === 'salsa' && <Icons.Salsa width={35} height={35} marginLeft={9} marginRight={-8}/>}
                      {category.icon === 'ballet' && <Icons.Ballet width={35} height={35} marginLeft={9} marginRight={-8}/>}
                      {category.icon === 'modern' && <Icons.Modern width={35} height={35} marginLeft={10} marginRight={-3}/>}
                      {category.icon === 'swing' && <Icons.Swing width={40} height={40} marginLeft={9} marginRight={-8}/>}
                      {category.icon === 'tap' && <Icons.Tap width={35} height={35} marginLeft={5} marginRight={-8}/>}
                      {category.icon === 'jazz' && <Icons.Jazz width={35} height={35} marginLeft={1} marginRight={-12}/>}
                      {category.icon === 'contemporary' && <Icons.Contemporary width={35} height={35} marginLeft={9} marginRight={-8}/>}

                    </>
                  ) : (
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                  )}
                </View>
                
                <Text style={[
                  styles.categoryLabel,
                ]}>
                  {category.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.semiBold,
    color: '#FFFFFF',
  },
  seeAllButton: {
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#FFFFFF',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap:8,
  
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  categoryButtonSelected: {
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  tickContainer: {
    position: 'absolute',
    top: -1,
    left: -7,
    width: 15,
    height: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tickMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#222222',
    textAlign: 'center',
  },
  categoryLabelSelected: {
    color: '#FFFFFF',
  },
});

export default CategoriesSection;
