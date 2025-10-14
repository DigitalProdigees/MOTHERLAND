import { Fonts } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DanceClassCard from './dance-class-card';

interface FeaturedClassesSectionProps {
  onSeeAllPress?: () => void;
  onClassPress?: (classId: string) => void;
}

const FeaturedClassesSection: React.FC<FeaturedClassesSectionProps> = ({
  onSeeAllPress,
  onClassPress,
}) => {
  const featuredClasses = [
    {
      id: 'urban-hip-hop',
      title: 'Urban Hip-Hop Masterclass',
      price: '$0',
      instructor: 'James Ray',
      rating: '4.9',
      students: '2,847 students',
      description: 'Lorem ipsum dolor sit amet risus phasellus. Morbi Read more...',
      status: 'Trending Now',
      statusIcon: '🔥',
    },
    {
      id: 'urban-hip-hop-2',
      title: 'Urban Hip-Hop Masterclass',
      price: '$0',
      instructor: 'James Ray',
      rating: '4.9',
      students: '2,847 students',
      description: 'Lorem ipsum dolor sit amet risus phasellus. Morbi Read more...',
      status: 'Trending Now',
      statusIcon: '🔥',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured Dance Classes</Text>
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

      <View style={styles.classesList}>
        {featuredClasses.map((danceClass) => (
          <DanceClassCard
            key={danceClass.id}
            title={danceClass.title}
            price={danceClass.price}
            instructor={danceClass.instructor}
            rating={danceClass.rating}
            students={danceClass.students}
            description={danceClass.description}
            status={danceClass.status}
            statusIcon={danceClass.statusIcon}
            onPress={() => onClassPress?.(danceClass.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  classesList: {
    gap: 0,
  },
});

export default FeaturedClassesSection;
