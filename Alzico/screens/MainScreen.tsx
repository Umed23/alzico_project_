import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import ModernNavbar from '../components/ModernNavbar';
import WebIcon from '../components/WebIcons';
import Colors from '../constants/Colors';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const { width } = Dimensions.get('window');

const MainScreen = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const { user } = useAuth();

  const handleNavigateToDashboard = () => {
    navigation.navigate('MainTabs');
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

  const handleAbout = () => {
    navigation.navigate('About');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ModernNavbar title="Alzico" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Header */}
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeText}>Welcome to Alzico</Text>
            <Text style={styles.welcomeSubtext}>
              Your cognitive health companion for early Alzheimer's detection
            </Text>
          </View>
        </View>

        {/* Main Dashboard Card */}
        <View style={styles.dashboardCard}>
          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardIcon}>📊</Text>
            <Text style={styles.dashboardTitle}>Dashboard</Text>
          </View>
          <Text style={styles.dashboardDescription}>
            Get a comprehensive overview of your cognitive health, test performance, and progress tracking
          </Text>
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={handleNavigateToDashboard}
            activeOpacity={0.8}
          >
            <Text style={styles.dashboardButtonText}>Open Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleStartTest}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>🧪</Text>
              </View>
              <Text style={styles.quickActionTitle}>Take a Test</Text>
              <Text style={styles.quickActionSubtitle}>Start cognitive assessment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleViewHistory}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>📊</Text>
              </View>
              <Text style={styles.quickActionTitle}>View History</Text>
              <Text style={styles.quickActionSubtitle}>Track your results</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleViewProfile}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>👤</Text>
              </View>
              <Text style={styles.quickActionTitle}>Profile</Text>
              <Text style={styles.quickActionSubtitle}>Manage your account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleSettings}
              activeOpacity={0.8}
            >
              <View style={styles.quickActionIcon}>
                <Text style={styles.quickActionIconText}>⚙️</Text>
              </View>
              <Text style={styles.quickActionTitle}>Settings</Text>
              <Text style={styles.quickActionSubtitle}>Customize your app</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Help */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Support & Help</Text>
          <View style={styles.supportGrid}>
            <TouchableOpacity
              style={styles.supportCard}
              onPress={handleHelp}
              activeOpacity={0.8}
            >
              <View style={styles.supportIcon}>
                <Text style={styles.supportIconText}>❓</Text>
              </View>
              <Text style={styles.supportTitle}>Help Center</Text>
              <Text style={styles.supportSubtitle}>Get assistance and guidance</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.supportCard}
              onPress={handleSOS}
              activeOpacity={0.8}
            >
              <View style={styles.supportIcon}>
                <Text style={styles.supportIconText}>🚨</Text>
              </View>
              <Text style={styles.supportTitle}>Emergency Help</Text>
              <Text style={styles.supportSubtitle}>Urgent support and resources</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.supportCard}
              onPress={handleAbout}
              activeOpacity={0.8}
            >
              <View style={styles.supportIcon}>
                <Text style={styles.supportIconText}>ℹ️</Text>
              </View>
              <Text style={styles.supportTitle}>About Alzico</Text>
              <Text style={styles.supportSubtitle}>Learn more about the app</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Information Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoTitle}>Why Regular Testing?</Text>
            <Text style={styles.infoText}>
              Regular cognitive assessments help detect early signs of cognitive decline, 
              allowing for timely intervention and better outcomes.
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>🔒</Text>
            <Text style={styles.infoTitle}>Privacy First</Text>
            <Text style={styles.infoText}>
              Your test results and personal data are stored locally on your device 
              and are never shared without your explicit consent.
            </Text>
          </View>
          
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📱</Text>
            <Text style={styles.infoTitle}>Always Accessible</Text>
            <Text style={styles.infoText}>
              Take tests anywhere, anytime. Your cognitive health monitoring 
              is just a tap away, 24/7.
            </Text>
          </View>
        </View>

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
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  welcomeTextContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  welcomeSubtext: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 300,
    fontWeight: '500',
  },
  dashboardCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 24,
    padding: 28,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dashboardIcon: {
    fontSize: 36,
    marginRight: 14,
  },
  dashboardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.3,
  },
  dashboardDescription: {
    fontSize: 17,
    color: Colors.textSecondary,
    lineHeight: 26,
    marginBottom: 26,
    fontWeight: '500',
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.buttonPrimary,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
    shadowColor: Colors.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 64,
    cursor: 'pointer',
  },
  dashboardButtonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 22,
    letterSpacing: 0.3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 72) / 2,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.tint + '25',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: Colors.tint + '40',
  },
  quickActionIconText: {
    fontSize: 36,
  },
  quickActionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  supportSection: {
    marginBottom: 32,
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  supportCard: {
    width: (width - 72) / 2,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  supportIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.buttonWarning + '25',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 2,
    borderColor: Colors.buttonWarning + '40',
  },
  supportIconText: {
    fontSize: 32,
  },
  supportTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  supportSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 18,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 18,
    marginTop: 2,
  },
  infoTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    flex: 1,
    letterSpacing: 0.2,
  },
  infoText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    flex: 1,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default MainScreen;