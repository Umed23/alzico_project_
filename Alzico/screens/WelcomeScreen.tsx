import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import Colors from '../constants/Colors';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  
  // Signup state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  // Force focus on this screen and reset any cached state
  useFocusEffect(
    React.useCallback(() => {
      // Reset any cached navigation state
      setActiveTab('login');
      setLoginEmail('');
      setLoginPassword('');
      setSignupFullName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupConfirmPassword('');
    }, [])
  );

  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoginLoading(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        // Navigate directly to MainTabs screen (with bottom tabs) without showing alert
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert('Error', 'Invalid email or password. Try demo@alzico.com / password123');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async () => {
    console.log('Signup button clicked');
    
    if (!signupFullName.trim() || !signupEmail.trim() || !signupPassword.trim() || !signupConfirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    console.log('Starting signup process...', { email: signupEmail, fullName: signupFullName });
    setIsSignupLoading(true);
    
    try {
      const success = await signup(signupEmail, signupPassword, signupFullName);
      console.log('Signup result:', success);
      
      if (success) {
        console.log('Signup successful, navigating to MainTabs');
        // Navigate directly to MainTabs screen (with bottom tabs) without showing alert
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        console.error('Signup failed - returned false');
        Alert.alert(
          'Signup Failed', 
          'Unable to create account. The backend server may be unavailable, but you can still try again to create a local account.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Signup exception:', error);
      Alert.alert('Error', error?.message || 'An error occurred during signup. Please try again.');
    } finally {
      setIsSignupLoading(false);
    }
  };

  const handleLoginSubmitEditing = () => {
    Keyboard.dismiss();
    handleLogin();
  };

  const handleResetApp = () => {
    // Force reset the app to this screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🧠 Alzico</Text>
          <Text style={styles.subtitle}>Alzheimer's Detection App</Text>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetApp}
          activeOpacity={0.7}
        >
          <Text style={styles.resetButtonText}>🔄 Reset App</Text>
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'login' && styles.activeTabButton]}
            onPress={() => setActiveTab('login')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
              Login
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'signup' && styles.activeTabButton]}
            onPress={() => setActiveTab('signup')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'login' ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={loginEmail}
                onChangeText={setLoginEmail}
                placeholder="Enter your email"
                placeholderTextColor={Colors.inputPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                editable={!isLoginLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password:</Text>
              <TextInput
                style={styles.input}
                value={loginPassword}
                onChangeText={setLoginPassword}
                placeholder="Enter your password"
                placeholderTextColor={Colors.inputPlaceholder}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLoginSubmitEditing}
                editable={!isLoginLoading}
              />
            </View>

            <View style={styles.demoCredentials}>
              <Text style={styles.demoText}>Demo: demo@alzico.com / password123</Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isLoginLoading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={isLoginLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isLoginLoading ? 'Logging in...' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create Account</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name:</Text>
              <TextInput
                style={styles.input}
                value={signupFullName}
                onChangeText={setSignupFullName}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.inputPlaceholder}
                autoCapitalize="words"
                editable={!isSignupLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={signupEmail}
                onChangeText={setSignupEmail}
                placeholder="Enter your email"
                placeholderTextColor={Colors.inputPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isSignupLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password:</Text>
              <TextInput
                style={styles.input}
                value={signupPassword}
                onChangeText={setSignupPassword}
                placeholder="Enter your password"
                placeholderTextColor={Colors.inputPlaceholder}
                secureTextEntry
                editable={!isSignupLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password:</Text>
              <TextInput
                style={styles.input}
                value={signupConfirmPassword}
                onChangeText={setSignupConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor={Colors.inputPlaceholder}
                secureTextEntry
                editable={!isSignupLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSignupLoading && styles.disabledButton]}
              onPress={handleSignup}
              disabled={isSignupLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSignupLoading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: Colors.cardBackground,
    padding: 14,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: Colors.error,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButtonText: {
    color: Colors.error,
    fontSize: 15,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 8,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  tabButton: {
    flex: 1,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: Colors.tint,
    shadowColor: Colors.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  tabText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  formContainer: {
    backgroundColor: Colors.cardBackground,
    padding: 28,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    marginBottom: 20,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  formTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 0.5,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderWidth: 2,
    borderColor: Colors.inputBorder,
    borderRadius: 16,
    padding: 18,
    fontSize: 17,
    color: Colors.text,
    minHeight: 56,
  },
  demoCredentials: {
    backgroundColor: Colors.buttonWarning + '20',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.buttonWarning,
    marginBottom: 24,
  },
  demoText: {
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: Colors.buttonPrimary,
    padding: 22,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Colors.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
    minHeight: 60,
    justifyContent: 'center',
    cursor: 'pointer',
    transform: [{ scale: 1 }],
  },
  disabledButton: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default WelcomeScreen; 