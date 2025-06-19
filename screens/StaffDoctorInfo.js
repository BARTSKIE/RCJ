import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StaffDoctorInfo() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👨‍⚕️ Staff & Doctor Information Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E3F2FD' },
  text: { fontSize: 20, fontWeight: 'bold', color: '#1A237E' },
});
