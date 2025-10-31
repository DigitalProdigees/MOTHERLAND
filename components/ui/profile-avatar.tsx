import { Fonts } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface ProfileAvatarProps {
  imageUrl?: string | null;
  fullName?: string;
  size?: number;
  style?: ViewStyle;
  textSize?: number;
}

/**
 * ProfileAvatar component that displays user's profile image or a default avatar
 * with the first letter of their name (like WhatsApp)
 */
export default function ProfileAvatar({ 
  imageUrl, 
  fullName = 'U', 
  size = 40,
  style,
  textSize
}: ProfileAvatarProps) {
  // Get the first letter of the full name
  const getInitial = () => {
    if (!fullName || fullName.trim().length === 0) return 'U';
    return fullName.trim()[0].toUpperCase();
  };

  // Generate a consistent color based on the first letter
  const getBackgroundColor = () => {
    const initial = getInitial();
    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#FFA07A', // Light Salmon
      '#98D8C8', // Mint
      '#F7DC6F', // Yellow
      '#BB8FCE', // Purple
      '#85C1E2', // Sky Blue
      '#F8B739', // Orange
      '#52B788', // Green
      '#E76F51', // Coral
      '#2A9D8F', // Dark Teal
      '#E9C46A', // Gold
      '#F4A261', // Sandy
      '#264653', // Dark Blue
      '#8A53C2', // Brand Purple
      '#F708F7', // Brand Pink
      '#C708F7', // Brand Magenta
      '#F76B0B', // Brand Orange
      '#6A4C93', // Deep Purple
    ];
    
    // Use character code to select color
    const index = initial.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const fontSize = textSize || size * 0.4;

  // If we have an image URL, show the image
  if (imageUrl && imageUrl.trim() !== '') {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[styles.avatar, avatarSize, style]}
        resizeMode="cover"
      />
    );
  }

  // Otherwise, show the initial letter with colored background
  return (
    <View 
      style={[
        styles.avatarPlaceholder, 
        avatarSize, 
        { backgroundColor: getBackgroundColor() },
        style
      ]}
    >
      <Text style={[styles.initialText, { fontSize }]}>
        {getInitial()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: '#FFFFFF',
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
  },
});

