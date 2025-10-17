import { Fonts } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onMenuPress: (menuItem: string) => void;
  onLogout: () => void;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  onMenuPress,
  onLogout,
}) => {
  const translateX = useSharedValue(-width);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateX.value = withTiming(-width, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isOpen]);

  const drawerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleOverlayPress = () => {
    onClose();
  };

  const menuItems = [
    'Library',
    'Switch as Instructor',
    'Products',
    'My Post',
    'My Favourites',
    'Subscriptions',
    'Change Password',
    'Notifications',
    'Contact Us',
    'Terms of services',
    'Privacy Policy',
  ];

  return (
    <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
      <Pressable style={styles.overlayPressable} onPress={handleOverlayPress} />
      <Animated.View style={[styles.drawer, drawerAnimatedStyle]}>
        <SafeAreaView style={styles.container}>
          {/* Header with close button */}
          <View style={styles.header}>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Image
                source={require('@/assets/images/closs.png')}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* User Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileRow}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={require('@/assets/images/annie-bens.png')}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                  <View style={styles.profileBorder} />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.userName}>Jhon Dea</Text>
                  <Pressable style={styles.editProfileButton}>
                    <LinearGradient
                      colors={['#F708F7', '#C708F7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{borderRadius:100,width:120,alignItems:'center'}}
                    >
                      <Text style={styles.editButtonText}>Edit Profile</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              {menuItems.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.menuItem}
                  onPress={() => onMenuPress(item)}
                >
                  <Text style={styles.menuText}>{item}</Text>
                  {item === 'Notifications' && (
                    <View style={styles.toggleContainer}>
                      <View style={styles.toggleOff}>
                        <View style={styles.toggleCircle} />
                      </View>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>

            {/* Logout Section */}
            <View style={styles.logoutSection}>
              <Pressable style={styles.logoutButton} onPress={onLogout}>
                <Image
                  source={require('@/assets/images/signout.png')}
                  style={styles.logoutIcon}
                  resizeMode="contain"
                />
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  overlayPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75, // 75% of screen width to match image
    height: height,
    backgroundColor: '#FFFFFF',
    zIndex: 1001,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  closeButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 32,
    height: 32,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    marginBottom: 40,
    borderWidth:1,
    paddingHorizontal:-20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileInfo: {
    flex: 1,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  userName: {
    fontSize: 30,
    fontFamily: Fonts.bold,
    color: '#333333',
    marginBottom: 8,
  },
  editProfileButton: {
  

  },
 
  editButtonText: {
    fontSize: 14,
    fontWeight:'bold',
    color: '#FFFFFF',
    paddingHorizontal:20,
    paddingVertical:11,
  },
  menuSection: {
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#333333',
  },
  toggleContainer: {
    marginLeft: 16,
  },
  toggleOff: {
    width: 44,
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutSection: {
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoutIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: '#333333',
  },
});

export default Drawer;
