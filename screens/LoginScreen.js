import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, signInWithEmailAndPassword } from '../FirebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter email and password');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format');
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      console.log('Login error:', error.code);
      switch (error.code) {
        case 'auth/user-not-found':
          setErrorMessage('No account found with this email');
          break;
        case 'auth/wrong-password':
          setErrorMessage('Incorrect password');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Invalid email format');
          break;
        case 'auth/user-disabled':
          setErrorMessage('Account disabled');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Too many attempts. Try again later');
          break;
        default:
          setErrorMessage('Login failed. Please try again');
      }
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Doctor Illustration */}
        <View style={styles.doctorContainer}>
          <View style={styles.doctorHead}>
            <Ionicons name="eye" size={32} color="#6c5ce7" style={styles.eyeIcon}/>
            <View style={styles.glasses}>
              <View style={styles.glassLens}/>
              <View style={styles.glassBridge}/>
              <View style={styles.glassLens}/>
            </View>
          </View>
          
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>
              Welcome back! Please login to access your account.
            </Text>
          </View>
        </View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#7f8c8d" style={styles.inputIcon}/>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#95a5a6"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon}/>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#95a5a6"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            autoComplete="password"
            textContentType="password"
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#7f8c8d"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        {/* Register Link */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')}
          style={styles.registerLink}
          disabled={isLoading}
        >
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerLinkText}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f5f6fa' // Light background
  },
  // Doctor Cartoon Styles (now in purple)
  doctorContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  doctorHead: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 15
  },
  eyeIcon: {
    marginBottom: 25,
    color: '#6c5ce7' // Purple eye
  },
  glasses: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 30
  },
  glassLens: {
    width: 30,
    height: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#6c5ce7', // Purple glasses
    backgroundColor: 'rgba(108, 92, 231, 0.1)'
  },
  glassBridge: {
    width: 10,
    height: 2,
    backgroundColor: '#6c5ce7', // Purple bridge
    alignSelf: 'center',
    marginHorizontal: 2
  },
  speechBubble: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  speechText: {
    color: '#2f3640',
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic'
  },
  // Form Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  inputIcon: {
    marginRight: 10
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2f3640'
  },
  eyeButton: {
    padding: 5
  },
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14
  },
  loginButton: {
    backgroundColor: '#6c5ce7', // Purple button
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  registerText: {
    textAlign: 'center',
    marginTop: 25,
    color: '#7f8c8d'
  },
  registerLink: {
    color: '#6c5ce7', // Purple link
    fontWeight: '600'
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerLink: {
    marginTop: 20,
  },
  registerLinkText: {
    color: '#6c5ce7',
    fontWeight: '600'
  }
});