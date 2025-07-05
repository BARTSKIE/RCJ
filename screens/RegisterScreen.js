import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, createUserWithEmailAndPassword } from '../FirebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (name, value) => {
    setFormData({...formData, [name]: value});
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    setErrorMessage('');

    // Validation
    if (!formData.firstName || !formData.lastName) {
      setErrorMessage('Please enter your full name');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      Alert.alert('Success', 'Registered successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Registration error:', error.code);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setErrorMessage('This email is already in use');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Invalid email address');
          break;
        case 'auth/weak-password':
          setErrorMessage('Password is too weak');
          break;
        default:
          setErrorMessage('Registration failed. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Doctor Illustration */}
        <View style={styles.doctorContainer}>
          <View style={styles.doctorHead}>
            <Ionicons name="eye" size={32} color="#6c5ce7" style={styles.eyeIcon}/>
            <View style={styles.glasses}>
              <View style={[styles.glassLens, {borderColor: '#6c5ce7'}]}/>
              <View style={[styles.glassBridge, {backgroundColor: '#6c5ce7'}]}/>
              <View style={[styles.glassLens, {borderColor: '#6c5ce7'}]}/>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our eye care community</Text>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        {/* Name Fields */}
        <View style={styles.nameContainer}>
          <View style={[styles.inputContainer, {flex: 1, marginRight: 10}]}>
            <Ionicons name="person-outline" size={20} color="#7f8c8d" style={styles.inputIcon}/>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#95a5a6"
              value={formData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              style={styles.input}
              autoCapitalize="words"
            />
          </View>
          <View style={[styles.inputContainer, {flex: 1}]}>
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#95a5a6"
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              style={styles.input}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#7f8c8d" style={styles.inputIcon}/>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#95a5a6"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#7f8c8d" style={styles.inputIcon}/>
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#95a5a6"
            value={formData.phone}
            onChangeText={(text) => handleChange('phone', text)}
            style={styles.input}
            keyboardType="phone-pad"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon}/>
          <TextInput
            placeholder="Password (min. 6 characters)"
            placeholderTextColor="#95a5a6"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry={!showPassword}
            style={styles.input}
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

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#7f8c8d" style={styles.inputIcon}/>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#95a5a6"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity 
          style={[styles.registerButton, isLoading && styles.disabledButton]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity 
          style={styles.loginLinkContainer}
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLink}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Add this to your existing styles
const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.7,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30,
  },
  doctorContainer: {
    alignItems: 'center',
    marginBottom: 30
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
    color: '#6c5ce7'
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
    backgroundColor: 'rgba(108, 92, 231, 0.1)'
  },
  glassBridge: {
    width: 10,
    height: 2,
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2f3640',
    textAlign: 'center',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30
  },
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
  error: {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14
  },
  registerButton: {
    backgroundColor: '#6c5ce7',
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
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  loginLinkContainer: {
    marginTop: 25
  },
  loginLinkText: {
    textAlign: 'center',
    color: '#7f8c8d'
  },
  loginLink: {
    color: '#6c5ce7',
    fontWeight: '600'
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  eyeButton: {
    padding: 5
  },
  disabledButton: {
    opacity: 0.7,
  }
});