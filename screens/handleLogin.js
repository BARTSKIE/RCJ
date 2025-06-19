import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseInit';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('MainDrawer'); // Redirect to drawer after login
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setErrorMessage('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setErrorMessage('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Invalid email format.');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Too many login attempts. Try again later.');
          break;
        default:
          setErrorMessage(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>

      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#000"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#000"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don’t have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#90CAF9' },
  title: { fontSize: 26, marginBottom: 30, textAlign: 'center', fontWeight: 'bold', color: '#fff' },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1A237E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: {
    color: '#0D47A1',
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});
