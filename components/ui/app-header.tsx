import { Icons } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

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
        <Icons.Drawer 
          width={30} 
          height={30} 
        />
      </Pressable>

      <View style={styles.rightIcons}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={onAddPress}
        >
          <Icons.PlusAdd 
            width={50} 
            height={50} 
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={onSearchPress}
        >
      <Icons.ProfileIcon 
            width={50} 
            height={50} 
          />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={onNotificationPress}
        >
          <Icons.Notification 
            width={50} 
            height={50} 
          />
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
    marginBottom:20,
    paddingHorizontal: 20,
  },
  iconButton: {
   
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
