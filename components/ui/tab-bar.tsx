import { Fonts } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'classes', label: 'Classes', icon: '📚' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          style={({ pressed }) => [
            styles.tab,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={[
            styles.icon,
            activeTab === tab.id && styles.activeIcon
          ]}>
            {tab.icon}
          </Text>
          <Text style={[
            styles.label,
            activeTab === tab.id && styles.activeLabel
          ]}>
            {tab.label}
          </Text>
          {activeTab === tab.id && <View style={styles.activeIndicator} />}
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.5,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: '#999999',
  },
  activeLabel: {
    color: '#8B5CF6',
    fontFamily: Fonts.semiBold,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 2,
    backgroundColor: '#8B5CF6',
    borderRadius: 1,
  },
});

export default TabBar;
