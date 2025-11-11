import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ModernNavbar from '../components/ModernNavbar';
import Colors from '../constants/Colors';

// --- TYPE DEFINITIONS ---
// This defines the structure of the data we expect from the server
type PredictionData = {
  prediction: 'CN' | 'MCI' | 'AD' | string; // The model's final prediction
  probabilities: {
    [key: string]: number; // e.g., { "CN": 0.1, "MCI": 0.7, "AD": 0.2 }
  };
};

// Update the route parameters to include our new prediction data
type ResultsScreenRouteProp = RouteProp<
  RootStackParamList,
  'Results'
>;

type ResultsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Results'
>;

const { width } = Dimensions.get('window');

const ResultsScreen = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  
  // --- 1. EXTRACT DATA ---
  // Get the new `predictionData` object from the route params.
  // Also get the old `score` and `error` for fallback cases.
  const params = (route.params || {}) as {
    testId?: string;
    testName?: string;
    score?: number;
    predictionData?: PredictionData;
    error?: string;
  };
  const { predictionData, testName, score, error } = params;

  const getPredictionDetails = (prediction: string) => {
    switch (prediction) {
      case 'AD':
        return {
          title: 'Alzheimer\'s Disease (AD)',
          description: 'The results suggest a pattern consistent with Alzheimer\'s Disease. It is highly recommended to consult a healthcare professional for a comprehensive evaluation.',
          color: '#FF3B30', // Red
        };
      case 'MCI':
        return {
          title: 'Mild Cognitive Impairment (MCI)',
          description: 'The results indicate potential Mild Cognitive Impairment. This is an intermediate stage. Consulting with a doctor for further assessment and monitoring is advised.',
          color: '#FF9500', // Orange
        };
      case 'CN':
        return {
          title: 'Cognitively Normal (CN)',
          description: 'The results fall within the normal range for cognitive function. Continue to monitor your cognitive health regularly.',
          color: '#34C759', // Green
        };
      default:
        return {
          title: 'Analysis Result',
          description: 'The analysis is complete. Please review the details below and consult with a healthcare provider for a full interpretation.',
          color: '#007AFF', // Blue
        };
    }
  };

  const renderContent = () => {
    // --- 2. RENDER PREDICTION (Primary View) ---
    // If we have predictionData and no error, show the AI-powered results.
    if (predictionData && !error) {
      const details = getPredictionDetails(predictionData.prediction);
      const probabilities = predictionData.probabilities || {};

      return (
        <>
          <View style={[styles.resultBox, { borderColor: details.color }]}>
            <Text style={styles.resultHeader}>AI-Powered Analysis</Text>
            <Text style={[styles.predictionTitle, { color: details.color }]}>
              {details.title}
            </Text>
            <Text style={styles.predictionDescription}>{details.description}</Text>
          </View>

          <View style={styles.probabilityBox}>
            <Text style={styles.probabilityHeader}>Confidence Levels</Text>
            {Object.entries(probabilities).map(([key, value]) => (
              <View key={key} style={styles.probRow}>
                <Text style={styles.probLabel}>{key}</Text>
                <View style={styles.probBarContainer}>
                  <View
                    style={[
                      styles.probBar,
                      { width: `${Math.round(value * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.probValue}>{`${(value * 100).toFixed(1)}%`}</Text>
              </View>
            ))}
          </View>
        </>
      );
    }

    // --- 3. RENDER FALLBACK (Error or No Prediction) ---
    // If there was an error or we only have a local score, show this view.
    return (
      <>
        {error && (
            <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
        )}
        <View style={styles.resultBox}>
          <Text style={styles.resultHeader}>Test Score</Text>
          <Text style={styles.scoreText}>{score}%</Text>
          <Text style={styles.predictionDescription}>
            This is your score based on the test answers. For a more detailed analysis, please ensure you are connected to the internet and try again.
          </Text>
        </View>
      </>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <ModernNavbar title="Test Results" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
            <Text style={styles.title}>Test Results</Text>
            <Text style={styles.subtitle}>{testName}</Text>
        </View>

        {renderContent()}

        <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerTitle}>Disclaimer</Text>
            <Text style={styles.disclaimerText}>
            This analysis is not a medical diagnosis. It is an informational tool based on a predictive model. Always consult a qualified healthcare professional for any health concerns.
            </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('MainTabs')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Return to Dashboard</Text>
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
  scrollContainer: {
    padding: 24,
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 19,
    color: Colors.textSecondary,
    marginTop: 10,
    fontWeight: '500',
  },
  resultBox: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.tint,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  resultHeader: {
    fontSize: 17,
    color: Colors.textSecondary,
    marginBottom: 18,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  predictionTitle: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  predictionDescription: {
    fontSize: 17,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  scoreText: {
    fontSize: 72,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 1,
  },
  probabilityBox: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  probabilityHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 22,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  probRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  probLabel: {
    color: Colors.text,
    fontSize: 17,
    width: 60,
    fontWeight: '600',
  },
  probBarContainer: {
    flex: 1,
    height: 24,
    backgroundColor: Colors.backgroundNav,
    borderRadius: 12,
    marginHorizontal: 14,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  probBar: {
    height: '100%',
    backgroundColor: Colors.tint,
    borderRadius: 10,
  },
  probValue: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    width: 65,
    textAlign: 'right',
  },
  errorBox: {
    width: '100%',
    backgroundColor: Colors.error + '25',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
  disclaimerBox: {
    width: '100%',
    backgroundColor: Colors.buttonWarning + '25',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.buttonWarning,
  },
  disclaimerTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  disclaimerText: {
    color: Colors.text,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  button: {
    backgroundColor: Colors.tint,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 36,
    alignItems: 'center',
    width: '100%',
    minHeight: 64,
    cursor: 'pointer',
    shadowColor: Colors.tint,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default ResultsScreen;