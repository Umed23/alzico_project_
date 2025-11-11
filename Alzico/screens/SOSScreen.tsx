import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import ModernNavbar from '../components/ModernNavbar';
import Colors from '../constants/Colors';
import WebIcon from '../components/WebIcons';

type SOSScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SOS'>;

// Emergency phone number - CHANGE THIS to your desired emergency number
const EMERGENCY_PHONE_NUMBER = '+7021388367'; // Change to any number like '+1234567890' or '112'

const SOSScreen = () => {
  const navigation = useNavigation<SOSScreenNavigationProp>();
  const { user, sessionToken } = useAuth();
  const [isSendingSMS, setIsSendingSMS] = useState(false);

  const API_URL =
    process.env.REACT_APP_API_URL ||
    process.env.MODEL_API_URL ||
    'http://localhost:5000';

  const handleBackToMain = () => {
    navigation.navigate('MainTabs');
  };

  const handleCall911 = () => {
    Linking.openURL(`tel:${EMERGENCY_PHONE_NUMBER}`);
  };

  const handleSendSOS = async () => {
    Alert.alert(
      'Send Emergency Alert',
      'This will send an SMS alert to your emergency contact. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: async () => {
            setIsSendingSMS(true);
            try {
              const response = await fetch(`${API_URL}/sos/send`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': sessionToken ? `Bearer ${sessionToken}` : '',
                },
                body: JSON.stringify({
                  location: 'Location not available',
                  timestamp: new Date().toISOString(),
                  user_id: user?.id,
                }),
              });

              const data = await response.json();
              
              if (response.ok && data.success) {
                Alert.alert(
                  'Alert Sent Successfully',
                  'Your emergency contact has been notified via SMS.',
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert(
                  'Alert Failed',
                  data.error || `Failed to send emergency alert. The SMS service may not be configured. Please call ${EMERGENCY_PHONE_NUMBER} directly.`,
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              console.error('SOS error:', error);
              Alert.alert(
                'Connection Error',
                `Could not reach the server to send the alert. Please call ${EMERGENCY_PHONE_NUMBER} directly or try again later.`,
                [{ text: 'OK' }]
              );
            } finally {
              setIsSendingSMS(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ModernNavbar title="Emergency Help" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🚨 Emergency Help</Text>
          <Text style={styles.subtitle}>Get immediate assistance</Text>
        </View>

        <View style={styles.sosSection}>
          <View style={styles.sosIconContainer}>
            <Text style={styles.sosIcon}>🚨</Text>
          </View>
          <Text style={styles.sosTitle}>Send Emergency Alert</Text>
          <Text style={styles.sosDescription}>
            Tap the button below to send an SMS alert to your emergency contact immediately.
          </Text>
          <TouchableOpacity
            style={[styles.sosButton, isSendingSMS && styles.disabledButton]}
            onPress={handleSendSOS}
            disabled={isSendingSMS}
            activeOpacity={0.8}
          >
            {isSendingSMS ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <WebIcon name="warning" size={24} color="#FFFFFF" />
                <Text style={styles.sosButtonText}>Send Emergency Alert</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.emergencySection}>
          <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={handleCall911}
            activeOpacity={0.8}
          >
            <WebIcon name="call" size={24} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Call {EMERGENCY_PHONE_NUMBER}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>What to do in an emergency:</Text>
          <View style={styles.helpItem}>
            <Text style={styles.helpBullet}>•</Text>
            <Text style={styles.helpText}>
              If this is a life-threatening emergency, call {EMERGENCY_PHONE_NUMBER} immediately.
            </Text>
          </View>
          <View style={styles.helpItem}>
            <Text style={styles.helpBullet}>•</Text>
            <Text style={styles.helpText}>
              Use the "Send Emergency Alert" button to notify your emergency contact via SMS.
            </Text>
          </View>
          <View style={styles.helpItem}>
            <Text style={styles.helpBullet}>•</Text>
            <Text style={styles.helpText}>
              Stay calm and provide clear information about the situation.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToMain}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Back to Main</Text>
        </TouchableOpacity>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.error,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sosSection: {
    backgroundColor: Colors.cardBackground,
    padding: 28,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: Colors.error,
    alignItems: 'center',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sosIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sosIcon: {
    fontSize: 48,
  },
  sosTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  sosDescription: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '500',
  },
  sosButton: {
    backgroundColor: Colors.error,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 250,
    justifyContent: 'center',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  sosButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  emergencySection: {
    backgroundColor: Colors.cardBackground,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  emergencyButton: {
    backgroundColor: Colors.error,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  helpSection: {
    backgroundColor: Colors.cardBackground,
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  helpItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  helpBullet: {
    fontSize: 20,
    color: Colors.tint,
    marginRight: 12,
    fontWeight: '700',
  },
  helpText: {
    fontSize: 17,
    color: Colors.text,
    lineHeight: 26,
    flex: 1,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: Colors.tint,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: Colors.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
    minHeight: 64,
    justifyContent: 'center',
    cursor: 'pointer',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default SOSScreen; 