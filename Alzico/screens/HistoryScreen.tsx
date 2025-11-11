import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TestResultsManager } from '../utils/testResults';
import { useAuth } from '../context/AuthContext';
import WebIcon from '../components/WebIcons';
import ModernNavbar from '../components/ModernNavbar';
import Colors from '../constants/Colors';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

interface TestResult {
  id: string;
  testId: string;
  testName: string;
  score: number;
  maxScore: number;
  percentage: number;
  date: string;
  duration?: number;
  answers?: any;
  prediction?: any;
}

const HistoryScreen = () => {
  const navigation = useNavigation<HistoryScreenNavigationProp>();
  const { user, sessionToken } = useAuth();
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load history when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTestHistory();
    }, [])
  );

  const loadTestHistory = async () => {
    try {
      setLoading(true);
      
      // First, try to load from backend if available
      if (sessionToken) {
        try {
          const API_URL =
            process.env.REACT_APP_API_URL ||
            process.env.MODEL_API_URL ||
            'http://localhost:5000';
          const response = await fetch(`${API_URL}/user/history`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.history) {
              // Format backend data
              const formattedHistory = data.history.map((item: any) => ({
                id: item.id || item[0],
                testName: item.test_name || item[1] || 'Unknown Test',
                testId: item.test_name || item[1],
                score: item.score || item[3] || 0,
                maxScore: 100,
                percentage: item.score || item[3] || 0,
                date: item.created_at || item[5] || new Date().toISOString(),
                prediction: item.prediction || item[4],
              }));
              setTestHistory(formattedHistory);
              setLoading(false);
              return;
            }
          }
        } catch (backendError) {
          console.log('Could not fetch from backend, using local storage');
        }
      }

      // Fallback to local storage
      const resultsManager = new TestResultsManager();
      const localResults = await resultsManager.getAllResults();
      
      if (localResults && localResults.length > 0) {
        // Sort by date, newest first
        const sortedResults = localResults.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setTestHistory(sortedResults);
      } else {
        setTestHistory([]);
      }
    } catch (error) {
      console.error('Error loading test history:', error);
      setTestHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTestHistory();
    setRefreshing(false);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return '#34C759';
    if (percentage >= 60) return '#4A90E2';
    if (percentage >= 40) return '#FFC107';
    return '#FF3B30';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
        return 'Today';
      } else if (diffInDays === 1) {
        return 'Yesterday';
      } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
      }
    } catch {
      return 'Unknown date';
    }
  };

  const handleViewResult = (result: TestResult) => {
    navigation.navigate('ReportDetail', {
      date: result.date,
      score: result.percentage
    });
  };

  const renderTestCard = (result: TestResult) => {
    const scoreColor = getScoreColor(result.percentage);
    
    return (
      <TouchableOpacity
        key={result.id}
        style={styles.testCard}
        onPress={() => handleViewResult(result)}
        activeOpacity={0.8}
      >
        <View style={styles.testCardHeader}>
          <View style={styles.testIconContainer}>
            <WebIcon name="clipboard" size={24} color="#4A90E2" />
          </View>
          <View style={styles.testInfoContainer}>
            <Text style={styles.testName}>{result.testName}</Text>
            <Text style={styles.testDate}>{formatDate(result.date)}</Text>
          </View>
          <View style={[styles.scoreContainer, { backgroundColor: `${scoreColor}20` }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>
              {result.percentage}%
            </Text>
          </View>
        </View>

        <View style={styles.testCardFooter}>
          <View style={styles.detailItem}>
            <WebIcon name="star" size={16} color="#888" />
            <Text style={styles.detailText}>
              Score: {result.score}/{result.maxScore}
            </Text>
          </View>
          {result.duration && (
            <View style={styles.detailItem}>
              <WebIcon name="time" size={16} color="#888" />
              <Text style={styles.detailText}>
                {result.duration} min
              </Text>
            </View>
          )}
          {result.prediction && (
            <View style={styles.detailItem}>
              <WebIcon name="analytics" size={16} color="#888" />
              <Text style={styles.detailText}>
                Analyzed
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ModernNavbar title="Test History" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Test History</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.tint} />
          <Text style={styles.loadingText}>Loading your test history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ModernNavbar title="Test History" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Test History</Text>
        <Text style={styles.headerSubtitle}>
          {testHistory.length} test{testHistory.length !== 1 ? 's' : ''} completed
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.tint}
            colors={[Colors.tint]}
          />
        }
      >
        {testHistory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Test History</Text>
            <Text style={styles.emptyText}>
              You haven't completed any tests yet. Start your first cognitive assessment to track your progress!
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('TestList')}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>Take a Test</Text>
              <WebIcon name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.historyList}>
            {testHistory.map(renderTestCard)}
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
  header: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: Colors.backgroundNav,
    borderBottomWidth: 2,
    borderBottomColor: Colors.cardBorder,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 17,
    marginTop: 18,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 36,
    maxWidth: 350,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: Colors.tint,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 20,
    gap: 10,
    minHeight: 56,
    cursor: 'pointer',
    shadowColor: Colors.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  historyList: {
    gap: 16,
  },
  testCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    cursor: 'pointer',
  },
  testCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  testIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.tint + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.tint + '40',
  },
  testInfoContainer: {
    flex: 1,
  },
  testName: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  testDate: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  scoreContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  testCardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#888',
  },
});

export default HistoryScreen;
