import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InstructorProfileTabScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <Text style={styles.text}>Profile</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    color: '#000000',
  },
});
