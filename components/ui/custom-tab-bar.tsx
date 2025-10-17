import { Fonts, Icons } from '@/constants/theme';
import { useDrawer } from '@/contexts/DrawerContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { isDrawerOpen } = useDrawer();
  const currentRoute = state.routes[state.index].name;
  
  // Check if we're on a class details screen or class booking screen (nested under home tab)
  const nestedRoute = state.routes[state.index].state?.routes?.[state.routes[state.index].state?.index || 0]?.name;
  const isClassDetailsScreen = currentRoute === 'home' && nestedRoute === 'classDetails';
  const isClassBookingScreen = currentRoute === 'home' && nestedRoute === 'class-booking';
  const shouldUseGradientTabBar = isClassDetailsScreen || isClassBookingScreen;
  
  // Hide tab bar when drawer is open
  if (isDrawerOpen) {
    return null;
  }
  
  // Debug logging
  console.log('Tab Bar Debug:', { currentRoute, nestedRoute, isClassDetailsScreen, isClassBookingScreen, shouldUseGradientTabBar });

  const getTabBarStyle = () => {
    if (shouldUseGradientTabBar) {
      return styles.gradientTabBar;
    }
    return styles.whiteTabBar;
  };

  const getTabBarLabelStyle = () => {
    if (shouldUseGradientTabBar) {
      return styles.gradientTabBarLabel;
    }
    return styles.whiteTabBarLabel;
  };

  const getTabIconColor = (focused: boolean) => {
    if (shouldUseGradientTabBar) {
      return '#FFFFFF';
    }
    return focused ? '#8B5CF6' : '#999999';
  };

  const getTabLabelColor = (focused: boolean) => {
    if (shouldUseGradientTabBar) {
      return '#FFFFFF';
    }
    return focused ? '#8B5CF6' : '#999999';
  };

  const renderTabBar = () => {
    if (shouldUseGradientTabBar) {
      return (
        <LinearGradient
          colors={['#F708F7', '#C708F7', '#F76B0B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientTabBar}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            const color = getTabIconColor(isFocused);
            const labelColor = getTabLabelColor(isFocused);

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabButton}
              >
                <View style={styles.tabIconContainer}>
                  {route.name === 'home' && (
                    <Icons.Home width={24} height={24} color={color} />
                  )}
                  {route.name === 'classes' && (
                    <View style={styles.tabIconContainer}>
                      <Icons.Classes width={24} height={24} color={color} />
                      {isFocused && <View style={styles.activeIndicator} />}
                    </View>
                  )}
                  {route.name === 'community' && (
                    <Icons.Community width={24} height={24} color={color} />
                  )}
                  {route.name === 'profile' && (
                    <Icons.Profile width={24} height={24} color={color} />
                  )}
                </View>
                <Text style={[styles.tabLabel, { color: labelColor }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </LinearGradient>
      );
    }

    // White background for home and other tabs
    return (
      <View style={styles.whiteTabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const color = getTabIconColor(isFocused);
          const labelColor = getTabLabelColor(isFocused);

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <View style={styles.tabIconContainer}>
                {route.name === 'home' && (
                  <Icons.Home width={24} height={24} color={color} />
                )}
                {route.name === 'classes' && (
                  <Icons.Classes width={24} height={24} color={color} />
                )}
                {route.name === 'community' && (
                  <Icons.Community width={24} height={24} color={color} />
                )}
                {route.name === 'profile' && (
                  <Icons.Profile width={24} height={24} color={color} />
                )}
              </View>
              <Text style={[styles.tabLabel, { color: labelColor }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return renderTabBar();
}

const styles = StyleSheet.create({
  whiteTabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    flexDirection: 'row',
  },
  gradientTabBar: {
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    flexDirection: 'row',
  },
  whiteTabBarLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: 4,
  },
  gradientTabBarLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: 4,
    color: '#FFFFFF',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: 12,
    marginTop: 4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
});
