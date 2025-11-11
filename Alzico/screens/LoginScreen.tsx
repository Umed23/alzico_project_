import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (success) {
        // Navigation will be handled by AuthContext and AppNavigator
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const success = await login('demo@alzico.com', 'password123');
      if (success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        Alert.alert('Demo Login Failed', 'Please try again.');
      }
    } catch (error) {
      Alert.alert('Demo Login Failed', 'Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Please contact support to reset your password.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Background Gradient Effect */}
          <View style={styles.backgroundGradient}>
            <View style={styles.gradientCircle1} />
            <View style={styles.gradientCircle2} />
            <View style={styles.gradientCircle3} />
          </View>

          {/* Header Section */}
          <Animated.View 
            style={[
              styles.headerSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🧠</Text>
              <Text style={styles.logoText}>Alzico</Text>
            </View>
            
            <Text style={styles.tagline}>
              Your Cognitive Health Companion
            </Text>
            
            <Text style={styles.welcomeText}>
              Welcome back! Sign in to continue your cognitive health journey.
            </Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
              {!isLoading && <Text style={styles.loginButtonIcon}>→</Text>}
            </TouchableOpacity>

            {/* Demo Login Button */}
            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.demoButtonText}>Try Demo Account</Text>
              <Text style={styles.demoButtonSubtext}>
                demo@alzico.com / password123
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>Create New Account</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            style={[
              styles.footer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.footerText}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  gradientCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  gradientCircle2: {
    position: 'absolute',
    top: 200,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  gradientCircle3: {
    position: 'absolute',
    bottom: 100,
    right: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 48,
    marginRight: 12,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 18,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    // Note: backdropFilter is not supported in React Native
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 16,
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#666',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  loginButtonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  demoButton: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC107',
    marginBottom: 4,
  },
  demoButtonSubtext: {
    fontSize: 12,
    color: '#FFC107',
    opacity: 0.8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    fontSize: 14,
    color: '#B0B0B0',
    marginHorizontal: 16,
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LoginScreen; 