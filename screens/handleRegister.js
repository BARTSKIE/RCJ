import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../firebaseInit';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');

    if (!username || !email || !password) {
      setErrorMessage('Please fill out all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password should be at least 6 characters');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await set(ref(database, `users/${userId}`), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Account created successfully! Redirecting to login...');
      setUsername('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        navigation.replace('Login');
      }, 500);

    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('This email is already in use. Please try another.');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Invalid email format.');
          break;
        case 'auth/weak-password':
          setErrorMessage('Password should be at least 6 characters.');
          break;
        default:
          setErrorMessage(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>REGISTRATION</Text>

        {errorMessage ? (
          <Text style={styles.error}>{errorMessage}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#000"
          value={username}
          onChangeText={setUsername}
        />
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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#90CAF9', paddingTop: 40 },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginBottom: 10,
  },
  backText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1A237E',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    fontWeight: '500',
    color: '#000',
  },
  loginLink: {
    color: '#0D47A1',
    textDecorationLine: 'underline',
  },
});
