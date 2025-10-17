import SuccessIcon from '@/assets/svg/Success';
import { Fonts } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SuccessPopupProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  iconSize?: number;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  visible,
  title,
  subtitle,
  iconSize = 130,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <SuccessIcon width={iconSize} height={iconSize} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Subtitle */}
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#00000090',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 38,
    borderColor: '#000000',
    borderRadius: 16,
    paddingVertical: 27,
    width:'70%',
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
});

export default SuccessPopup;
