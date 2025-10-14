import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface AppHeaderProps {
  onMenuPress?: () => void;
  onAddPress?: () => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onMenuPress,
  onAddPress,
  onSearchPress,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.iconButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
        onPress={onMenuPress}
      >
        <Text style={styles.icon}>☰</Text>
      </Pressable>

      <View style={styles.rightIcons}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={onAddPress}
        >
          <Text style={styles.icon}>+</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={onSearchPress}
        >
          <Text style={styles.icon}>🔍</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={onNotificationPress}
        >
          <Text style={styles.icon}>🔔</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50, // Account for status bar
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AppHeader;
