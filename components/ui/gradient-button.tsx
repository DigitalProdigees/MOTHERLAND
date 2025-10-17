import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function GradientButton({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false 
}: GradientButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        style,
        { opacity: disabled ? 0.5 : (pressed ? 0.8 : 1) }
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={disabled ? ['#CCCCCC', '#999999', '#CCCCCC'] : ['#F708F7', '#C708F7', '#F76B0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    maxWidth: 320,
    height: 56,
    borderRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
