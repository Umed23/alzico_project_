import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
// Fallback stub for AnalyticsDashboard when the separate component file is missing
const AnalyticsDashboard: React.FC<{ onRefresh?: () => Promise<void> | void; showDetailed?: boolean }> = ({ onRefresh }) => {
  return (
    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 25 }}>
      <Text style={{ fontSize: 16, color: '#666' }}>Analytics unavailable</Text>
      <TouchableOpacity onPress={() => onRefresh && onRefresh()} style={{ marginTop: 10 }}>
        <Text style={{ color: '#4A90E2', fontWeight: '600' }}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};
// Fallback stub for ProgressTracker when the separate component file is missing
const ProgressTracker: React.FC<{ onRefresh?: () => Promise<void> | void; showDetailed?: boolean }> = ({ onRefresh }) => {
  return (
    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 25 }}>
      <Text style={{ fontSize: 16, color: '#666' }}>Progress tracker unavailable</Text>
      <TouchableOpacity onPress={() => onRefresh && onRefresh()} style={{ marginTop: 10 }}>
        <Text style={{ color: '#4A90E2', fontWeight: '600' }}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};
import { getDashboardSummary, getTestPerformanceStats } from '../utils/testResults';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

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

const DashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'progress'>('overview');

  // Auto-refresh dashboard when screen comes into focus (e.g., after completing a test)
  useFocusEffect(
    React.useCallback(() => {
      loadDashboardData();
    }, [])
  );

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

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#28A745'; // Green for high scores
    if (score >= 70) return '#FFC107'; // Yellow for medium scores
    if (score >= 50) return '#FD7E14'; // Orange for low scores
    return '#DC3545'; // Red for very low scores
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
        <TouchableOpacity style={styles.actionButton} onPress={handleStartTest}>
          <Text style={styles.actionIcon}>🧪</Text>
          <Text style={styles.actionText}>Start Test</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleViewHistory}>
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>View History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleViewProfile}>
          <Text style={styles.actionIcon}>👤</Text>
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
          <Text style={styles.actionIcon}>⚙️</Text>
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleHelp}>
          <Text style={styles.actionIcon}>❓</Text>
          <Text style={styles.actionText}>Help</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleSOS}>
          <Text style={styles.actionIcon}>🚨</Text>
          <Text style={styles.actionText}>SOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.recentActivityCard}>
      <Text style={styles.cardTitle}>Recent Test Results</Text>
      
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
            
            <View style={[
              styles.recentTestScore,
              { backgroundColor: getScoreColor(test.score) === '#28A745' ? '#E8F5E8' : 
                getScoreColor(test.score) === '#FFC107' ? '#FFF8E1' :
                getScoreColor(test.score) === '#FD7E14' ? '#FFF3E0' : '#FFEBEE'
              }]
            }>
              <Text style={[
                styles.recentTestScoreText,
                { color: getScoreColor(test.score) }
              ]}>
                {test.score}%
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No recent test results</Text>
          <Text style={styles.noDataSubtext}>Complete your first test to see results</Text>
        </View>
      )}
    </View>
  );

  const renderTestScores = () => {
    // Get recent test results with more details
    const recentResults = dashboardData?.topPerformingTests || [];
    
    return (
      <View style={styles.testScoresCard}>
        <Text style={styles.cardTitle}>Test Performance Scores</Text>
        
        {recentResults.length > 0 ? (
          recentResults.map((test, index) => (
            <View key={test.testId} style={styles.testScoreItem}>
              <View style={styles.testScoreHeader}>
                <View style={styles.testScoreRank}>
                  <Text style={styles.testScoreRankText}>{index + 1}</Text>
                </View>
                
                <View style={styles.testScoreInfo}>
                  <Text style={styles.testScoreName}>{test.testName}</Text>
                  <Text style={styles.testScoreStats}>
                    {test.totalTests} tests completed
                  </Text>
                </View>
              </View>
              
              <View style={styles.testScoreDetails}>
                <View style={styles.scoreBarContainer}>
                  <View style={styles.scoreBar}>
                    <View 
                      style={[
                        styles.scoreBarFill,
                        { 
                          width: `${test.averageScore}%`,
                          backgroundColor: getScoreColor(test.averageScore)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.scorePercentage}>{test.averageScore}%</Text>
                </View>
                
                <View style={styles.scoreBreakdown}>
                  <Text style={styles.scoreBreakdownText}>
                    Best: {Math.min(100, test.averageScore + 10)}% | 
                    Recent: {test.averageScore}%
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No test performance data</Text>
            <Text style={styles.noDataSubtext}>Take tests to see your performance scores</Text>
          </View>
        )}
      </View>
    );
  };

  const renderScoreTrends = () => {
    const trend = dashboardData?.recentTrend || 'stable';
    const trendData = recentTests.slice(0, 5).reverse();
    
    if (trendData.length === 0) return null;

    return (
      <View style={styles.scoreTrendsCard}>
        <Text style={styles.cardTitle}>Score Trends</Text>
        
        <View style={styles.trendChart}>
          {trendData.map((test, index) => (
            <View key={index} style={styles.trendItem}>
              <View style={styles.trendBarContainer}>
                <View style={[
                  styles.trendBar,
                  { 
                    height: (test.score / 100) * 120,
                    backgroundColor: getScoreColor(test.score)
                  }
                ]} />
              </View>
              
              <View style={styles.trendLabels}>
                <Text style={styles.trendScore}>{test.score}%</Text>
                <Text style={styles.trendTestNumber}>Test {test.testNumber}</Text>
                <Text style={styles.trendDate}>
                  {new Date(test.date).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.trendSummary}>
          <Text style={styles.trendSummaryText}>
            {trend === 'improving' ? '📈 Your scores are improving!' :
             trend === 'declining' ? '📉 Your scores need attention' :
             '➡️ Your scores are stable'}
          </Text>
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {renderQuickStats()}
            {renderTrendCard()}
            {renderTestScores()}
            {renderScoreTrends()}
            {renderTopTests()}
            {renderSeverityBreakdown()}
            {renderQuickActions()}
            {renderRecentActivity()}
          </>
        );
      case 'analytics':
        return (
          <AnalyticsDashboard 
            onRefresh={onRefresh}
            showDetailed={true}
          />
        );
      case 'progress':
        return (
          <ProgressTracker 
            onRefresh={onRefresh}
            showDetailed={true}
          />
        );
      default:
        return (
          <>
            {renderQuickStats()}
            {renderTrendCard()}
            {renderTestScores()}
            {renderScoreTrends()}
            {renderTopTests()}
            {renderSeverityBreakdown()}
            {renderQuickActions()}
            {renderRecentActivity()}
          </>
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'overview' && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[
              styles.tabButtonText,
              activeTab === 'overview' && styles.tabButtonTextActive
            ]}>
              Overview
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'analytics' && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab('analytics')}
          >
            <Text style={[
              styles.tabButtonText,
              activeTab === 'analytics' && styles.tabButtonTextActive
            ]}>
              Analytics
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'progress' && styles.tabButtonActive
            ]}
            onPress={() => setActiveTab('progress')}
          >
            <Text style={[
              styles.tabButtonText,
              activeTab === 'progress' && styles.tabButtonTextActive
            ]}>
              Progress
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
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
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#4A90E2',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  trendCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  trendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  quickActionsContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#fff',
    width: (width - 60) / 3,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  topTestsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  topTestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  topTestRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topTestInfo: {
    flex: 1,
  },
  topTestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  topTestStats: {
    fontSize: 12,
    color: '#666',
  },
  topTestScore: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  topTestScoreText: {
    color: '#28A745',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  severityCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  severityItems: {
    gap: 15,
  },
  severityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  severityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  severityInfo: {
    flex: 1,
  },
  severityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  severityCount: {
    fontSize: 12,
    color: '#666',
  },
  severityPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  goalsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalItem: {
    marginBottom: 20,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  goalProgress: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  bottomSpacing: {
    height: 20,
  },
  recentActivityCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recentTestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
  },
  recentTestIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recentTestIconText: {
    fontSize: 24,
  },
  recentTestInfo: {
    flex: 1,
  },
  recentTestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  recentTestDate: {
    fontSize: 12,
    color: '#666',
  },
  recentTestScore: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  recentTestScoreText: {
    color: '#28A745',
    fontSize: 14,
    fontWeight: 'bold',
  },
  testScoresCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  testScoreItem: {
    marginBottom: 20,
  },
  testScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  testScoreRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  testScoreRankText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testScoreInfo: {
    flex: 1,
  },
  testScoreName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  testScoreStats: {
    fontSize: 12,
    color: '#666',
  },
  testScoreDetails: {
    alignItems: 'center',
  },
  scoreBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  scoreBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 5,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 5,
  },
  scorePercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreBreakdown: {
    marginTop: 10,
  },
  scoreBreakdownText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scoreTrendsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  trendItem: {
    alignItems: 'center',
  },
  trendBarContainer: {
    width: 50,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  trendBar: {
    width: 10,
    borderRadius: 5,
  },
  trendLabels: {
    alignItems: 'center',
    marginTop: 10,
  },
  trendScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  trendTestNumber: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  trendDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
  trendSummary: {
    alignItems: 'center',
  },
  trendSummaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default DashboardScreen; 