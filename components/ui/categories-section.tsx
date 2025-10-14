import { Fonts } from '@/constants/theme';
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
    { id: 'all', label: 'All Classes', icon: '✓👋' },
    { id: 'hip-hop', label: 'Hip-Hop', icon: '💃' },
    { id: 'contemporary', label: 'Contemporary', icon: '🕺' },
    { id: 'salsa', label: 'Salsa', icon: '💃🕺' },
    { id: 'ballet', label: 'Ballet Dance', icon: '🩰' },
    { id: 'modern', label: 'Modern Dance', icon: '💃' },
    { id: 'swing', label: 'Swing', icon: '💃🕺' },
    { id: 'tap', label: 'Tap Dance', icon: '👞' },
    { id: 'jazz', label: 'Jazz Dance', icon: '💃' },
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
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryLabel}>{category.label}</Text>
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
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: '#8B5CF6',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default CategoriesSection;
