import { Fonts, Icons } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface CategoriesSectionProps {
  onSeeAllPress?: () => void;
  onCategoryPress?: (category: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  onSeeAllPress,
  onCategoryPress,
}) => {
  const categories = [
    { id: 'all', label: 'All Classes', icon: 'vector', isVector: true },
    { id: 'hip-hop', label: 'Hip-Hop', icon: 'hiphop', isVector: true },
    { id: 'salsa', label: 'Salsa', icon: 'salsa', isVector: true },
    { id: 'ballet', label: 'Ballet Dance', icon: 'ballet', isVector: true },
    { id: 'modern', label: 'Modern Dance', icon: 'modern', isVector: true },
    { id: 'swing', label: 'Swing', icon: 'swing', isVector: true },
    { id: 'contemporary', label: 'Contemporary', icon: 'contemporary', isVector: true },
    { id: 'tap', label: 'Tap Dance', icon: 'tap', isVector: true },
    { id: 'jazz', label: 'Jazz Dance', icon: 'jazz', isVector: true },
  ];

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
        {categories.map((category, index) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.categoryButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
            onPress={() => onCategoryPress?.(category.id)}
          >
            <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
              {category.isVector ? (
                <>
                  {category.icon === 'vector' && <Icons.Vector width={35} height={35} marginLeft={4} />}
                  {category.icon === 'hiphop' && <Icons.HipHop width={35} height={35} marginLeft={4}/>}
                  {category.icon === 'salsa' && <Icons.Salsa width={35} height={35} marginLeft={4}/>}
                      {category.icon === 'ballet' && <Icons.Ballet width={40} height={40} marginLeft={4}/>}
                  {category.icon === 'modern' && <Icons.Modern width={35} height={35} marginLeft={4}/>}
                  {category.icon === 'swing' && <Icons.Swing width={40} height={40} marginLeft={4}/>}
                  {category.icon === 'contemporary' && <Icons.Contemporary width={35} height={35} marginLeft={4}/>}
                  {category.icon === 'tap' && <Icons.Tap width={35} height={35} marginLeft={4}/>}
                  {category.icon === 'jazz' && <Icons.Jazz width={35} height={35} marginLeft={4}/>}
                </>
              ) : (
                <Text style={styles.categoryIcon}>{category.icon}</Text>
              )}
              <Text style={styles.categoryLabel}>{category.label}</Text>
            </View>
          </Pressable>
        ))}
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
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#222222',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default CategoriesSection;
