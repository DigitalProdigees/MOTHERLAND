import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export default function LoadingModal({ visible, message = 'Loading...' }: LoadingModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      hardwareAccelerated={true}
    >
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#F708F7" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
