import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { getDashboardSummary, getTestPerformanceStats } from '../utils/testResults';
import { COGNITIVE_TESTS } from '../utils/cognitiveTests';
import ModernNavbar from '../components/ModernNavbar';
import WebIcon from '../components/WebIcons';
import Colors from '../constants/Colors';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const { width, height } = Dimensions.get('window');

interface DashboardData {
  totalTests: number;
  testsThisWeek: number;
  testsThisMonth: number;
  averageScore: number;
  recentTrend: string;
  topPerformingTests: Array<{
    testId: string;
    testName: string;
    totalTests: number;
    averageScore: number;
  }>;
  severityBreakdown: Record<string, number>;
}

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentTests, setRecentTests] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const summary = await getDashboardSummary();
      setDashboardData(summary);
      
      // Load recent test performance
      const recentStats = await getTestPerformanceStats();
      setRecentTests(recentStats.improvementTrend || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set default data for demo purposes
      setDashboardData({
        totalTests: 0,
        testsThisWeek: 0,
        testsThisMonth: 0,
        averageScore: 0,
        recentTrend: 'stable',
        topPerformingTests: [],
        severityBreakdown: {}
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleStartTest = () => {
    navigation.navigate('TestList');
  };

  const handleViewHistory = () => {
    navigation.navigate('History');
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleHelp = () => {
    navigation.navigate('Help');
  };

  const handleSOS = () => {
    navigation.navigate('SOS');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'improving': return '#28A745';
      case 'declining': return '#DC3545';
      case 'stable': return '#6C757D';
      default: return '#6C757D';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'normal': return '#28A745';
      case 'mild': return '#FFC107';
      case 'moderate': return '#FD7E14';
      case 'severe': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const renderQuickStats = () => (
    <View style={styles.quickStatsContainer}>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{dashboardData?.totalTests || 0}</Text>
        <Text style={styles.statLabel}>Total Tests</Text>
      </View>
      
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{dashboardData?.testsThisWeek || 0}</Text>
        <Text style={styles.statLabel}>This Week</Text>
      </View>
      
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{dashboardData?.testsThisMonth || 0}</Text>
        <Text style={styles.statLabel}>This Month</Text>
      </View>
      
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{dashboardData?.averageScore || 0}%</Text>
        <Text style={styles.statLabel}>Avg Score</Text>
      </View>
    </View>
  );

  const renderTrendCard = () => (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendTitle}>Performance Trend</Text>
        <Text style={styles.trendIcon}>{getTrendIcon(dashboardData?.recentTrend || 'stable')}</Text>
      </View>
      
      <View style={styles.trendContent}>
        <Text style={[
          styles.trendText,
          { color: getTrendColor(dashboardData?.recentTrend || 'stable') }
        ]}>
          {dashboardData?.recentTrend === 'improving' ? 'Improving' : 
           dashboardData?.recentTrend === 'declining' ? 'Declining' : 'Stable'}
        </Text>
        <Text style={styles.trendSubtext}>
          Based on your recent test performance
        </Text>
      </View>
    </View>
  );

  const renderTopTests = () => (
    <View style={styles.topTestsCard}>
      <Text style={styles.cardTitle}>Top Performing Tests</Text>
      
      {dashboardData?.topPerformingTests && dashboardData.topPerformingTests.length > 0 ? (
        dashboardData.topPerformingTests.slice(0, 3).map((test, index) => (
          <View key={test.testId} style={styles.topTestItem}>
            <View style={styles.topTestRank}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            
            <View style={styles.topTestInfo}>
              <Text style={styles.topTestName}>{test.testName}</Text>
              <Text style={styles.topTestStats}>
                {test.totalTests} tests • {test.averageScore}% avg
              </Text>
            </View>
            
            <View style={styles.topTestScore}>
              <Text style={styles.topTestScoreText}>{test.averageScore}%</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No test data available yet</Text>
          <Text style={styles.noDataSubtext}>Take your first test to see your performance</Text>
        </View>
      )}
    </View>
  );

  const renderSeverityBreakdown = () => {
    const breakdown = dashboardData?.severityBreakdown || {};
    const total = Object.values(breakdown).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) return null;

    return (
      <View style={styles.severityCard}>
        <Text style={styles.cardTitle}>Cognitive Health Overview</Text>
        
        <View style={styles.severityItems}>
          {Object.entries(breakdown).map(([severity, count]) => (
            <View key={severity} style={styles.severityItem}>
              <View style={[
                styles.severityIndicator,
                { backgroundColor: getSeverityColor(severity) }
              ]} />
              
              <View style={styles.severityInfo}>
                <Text style={styles.severityName}>{severity}</Text>
                <Text style={styles.severityCount}>{count} tests</Text>
              </View>
              
              <Text style={styles.severityPercentage}>
                {Math.round((count / total) * 100)}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.actionGrid}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleStartTest}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🧪</Text>
          <Text style={styles.actionText}>Start Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleViewHistory}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>View History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleViewProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>👤</Text>
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleSettings}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>⚙️</Text>
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleHelp}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>❓</Text>
          <Text style={styles.actionText}>Help</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleSOS}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🚨</Text>
          <Text style={styles.actionText}>SOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.recentActivityCard}>
      <Text style={styles.cardTitle}>Recent Activity</Text>
      
      {recentTests.length > 0 ? (
        recentTests.map((test, index) => (
          <View key={index} style={styles.recentTestItem}>
            <View style={styles.recentTestIcon}>
              <Text style={styles.recentTestIconText}>📝</Text>
            </View>
            
            <View style={styles.recentTestInfo}>
              <Text style={styles.recentTestName}>Test #{test.testNumber}</Text>
              <Text style={styles.recentTestDate}>
                {new Date(test.date).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.recentTestScore}>
              <Text style={styles.recentTestScoreText}>{test.score}%</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No recent activity</Text>
          <Text style={styles.noDataSubtext}>Complete your first test to see activity</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ModernNavbar title="Dashboard" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ModernNavbar title="Dashboard" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.fullName || 'User'}!</Text>
          </View>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        {renderQuickStats()}

        {/* Performance Trend */}
        {renderTrendCard()}

        {/* Top Performing Tests */}
        {renderTopTests()}

        {/* Severity Breakdown */}
        {renderSeverityBreakdown()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Recent Activity */}
        {renderRecentActivity()}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 17,
    color: Colors.textSecondary,
    marginBottom: 5,
    fontWeight: '500',
  },
  userName: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    minHeight: 44,
    cursor: 'pointer',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: Colors.cardBackground,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.tint,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  trendCard: {
    backgroundColor: Colors.cardBackground,
    padding: 24,
    borderRadius: 24,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  trendTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  trendIcon: {
    fontSize: 24,
  },
  trendContent: {
    alignItems: 'center',
  },
  trendText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trendSubtext: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  topTestsCard: {
    backgroundColor: Colors.cardBackground,
    padding: 24,
    borderRadius: 24,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 22,
    letterSpacing: 0.3,
  },
  topTestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: Colors.backgroundNav,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  topTestRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  topTestInfo: {
    flex: 1,
  },
  topTestName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  topTestStats: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  topTestScore: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  topTestScoreText: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 17,
    color: Colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  noDataSubtext: {
    fontSize: 15,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  severityCard: {
    backgroundColor: Colors.cardBackground,
    padding: 24,
    borderRadius: 24,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  severityItems: {
    gap: 16,
  },
  severityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: Colors.backgroundNav,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  severityIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 16,
  },
  severityInfo: {
    flex: 1,
  },
  severityName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  severityCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  severityPercentage: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.tint,
  },
  quickActionsContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: Colors.cardBackground,
    width: (width - 72) / 3,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    cursor: 'pointer',
  },
  actionIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  recentActivityCard: {
    backgroundColor: Colors.cardBackground,
    padding: 24,
    borderRadius: 24,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  recentTestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: Colors.backgroundNav,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
  },
  recentTestIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.tint + '25',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.tint + '40',
  },
  recentTestIconText: {
    fontSize: 24,
  },
  recentTestInfo: {
    flex: 1,
  },
  recentTestName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  recentTestDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  recentTestScore: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  recentTestScoreText: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default HomeScreen;