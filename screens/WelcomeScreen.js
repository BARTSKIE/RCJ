import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Burger Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Ionicons name="menu" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Welcome Message */}
      <Text style={styles.text}>🎉 Welcome to Optical App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#90CAF9',
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#1A237E',
    padding: 10,
    borderRadius: 30,
  },
});
