import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface GradientBackButtonProps {
  onPress: () => void;
}

export default function GradientBackButton({ onPress }: GradientBackButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.7 : 1 }
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#F708F7', '#C708F7', '#F76B0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.chevron}>‹</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  chevron: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: -2, // Slight adjustment for visual centering
  },
});
