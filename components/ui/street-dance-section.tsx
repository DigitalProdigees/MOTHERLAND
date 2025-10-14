import React from 'react';
import { StyleSheet, View } from 'react-native';
import DanceClassCard from './dance-class-card';

interface StreetDanceSectionProps {
  onClassPress?: (classId: string) => void;
}

const StreetDanceSection: React.FC<StreetDanceSectionProps> = ({
  onClassPress,
}) => {
  const streetDanceClasses = [
    {
      id: 'street-dance-basics-1',
      title: 'Street Dance Basics',
      price: '$0',
      instructor: 'James Ray',
      rating: '4.9',
      students: '1,234 students',
      description: 'Lorem ipsum dolor sit amet risus phasellus. Morbi Lorem ipsum dolor sit amet risus phasellus. Morbi Read more...',
      duration: '45 min',
      seatAvailability: 'Seat Availability',
    },
    {
      id: 'street-dance-basics-2',
      title: 'Street Dance Basics',
      price: '$0',
      instructor: 'James Ray',
      rating: '4.9',
      students: '1,234 students',
      description: 'Lorem ipsum dolor sit amet risus phasellus. Morbi Lorem ipsum dolor sit amet risus phasellus. Morbi Read more...',
      duration: '45 min',
      seatAvailability: 'Seat Availability',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.classesList}>
        {streetDanceClasses.map((danceClass) => (
          <DanceClassCard
            key={danceClass.id}
            title={danceClass.title}
            price={danceClass.price}
            instructor={danceClass.instructor}
            rating={danceClass.rating}
            students={danceClass.students}
            description={danceClass.description}
            duration={danceClass.duration}
            seatAvailability={danceClass.seatAvailability}
            onPress={() => onClassPress?.(danceClass.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100, // Space for tab bar
  },
  classesList: {
    gap: 0,
  },
});

export default StreetDanceSection;
