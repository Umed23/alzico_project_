import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ConsentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Consent'>;

const ConsentScreen = () => {
  const navigation = useNavigation<ConsentScreenNavigationProp>();

  const handleConsent = () => {
    navigation.navigate('Main');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🧠 Alzico</Text>
          <Text style={styles.subtitle}>Assessment Consent</Text>
        </View>

        <View style={styles.consentContainer}>
          <Text style={styles.consentTitle}>Consent for Cognitive Assessment</Text>
          <Text style={styles.consentText}>
            This cognitive assessment is designed to help evaluate your cognitive function and provide insights into your brain health.
          </Text>
          <Text style={styles.consentText}>
            What to expect:
          </Text>
          <Text style={styles.consentText}>
            • Series of cognitive tests and exercises
          </Text>
          <Text style={styles.consentText}>
            • Assessment takes approximately 15-20 minutes
          </Text>
          <Text style={styles.consentText}>
            • Results are for educational purposes only
          </Text>
          <Text style={styles.consentText}>
            • Your privacy and data are protected
          </Text>
          <Text style={styles.consentText}>
            Note: This is not a medical diagnosis. Please consult healthcare professionals for medical concerns.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.consentButton}
            onPress={handleConsent}
          >
            <Text style={styles.consentButtonText}>I Consent</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  consentContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  consentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
    textAlign: 'center',
  },
  consentText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  consentButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  consentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConsentScreen; 