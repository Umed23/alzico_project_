import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '../components/WebIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [dataSyncEnabled, setDataSyncEnabled] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAccountSettings = () => {
    Alert.alert('Account Settings', 'Account management coming soon!');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Privacy Settings', 'Privacy options coming soon!');
  };

  const handleDataExport = () => {
    Alert.alert('Export Data', 'Data export feature coming soon!');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your assessment data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => Alert.alert('Data Cleared', 'All data has been cleared.')
        }
      ]
    );
  };

  const handleAboutApp = () => {
    navigation.navigate('About');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Contact support at support@alzico.com');
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'App rating feature coming soon!');
  };

  const handleShareApp = () => {
    Alert.alert('Share App', 'App sharing feature coming soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => navigation.navigate('Welcome')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.8}
          >
            <Icon name="arrow-back" size={24} color="#4A90E2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleAccountSettings}
              activeOpacity={0.8}
            >
              <View style={styles.settingIcon}>
                <Icon name="person-circle" size={24} color="#4A90E2" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Account Information</Text>
                <Text style={styles.settingSubtitle}>Manage your profile and preferences</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handlePrivacySettings}
              activeOpacity={0.8}
            >
              <View style={styles.settingIcon}>
                <Icon name="shield-checkmark" size={24} color="#34C759" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Privacy & Security</Text>
                <Text style={styles.settingSubtitle}>Control your data and privacy</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <View style={styles.sectionCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Icon name="notifications" size={24} color="#FF9500" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSubtitle}>Get reminders for assessments</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E5EA', true: '#4A90E2' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Icon name="volume-high" size={24} color="#9C27B0" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Sound Effects</Text>
                <Text style={styles.settingSubtitle}>Play sounds during tests</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#E5E5EA', true: '#4A90E2' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Icon name="save" size={24} color="#34C759" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Auto-Save Results</Text>
                <Text style={styles.settingSubtitle}>Automatically save assessment results</Text>
              </View>
              <Switch
                value={autoSaveEnabled}
                onValueChange={setAutoSaveEnabled}
                trackColor={{ false: '#E5E5EA', true: '#4A90E2' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Icon name="moon" size={24} color="#2C3E50" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingSubtitle}>Use dark theme</Text>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#E5E5EA', true: '#4A90E2' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <Icon name="cloud-upload" size={24} color="#4A90E2" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Data Sync</Text>
                <Text style={styles.settingSubtitle}>Sync data across devices</Text>
              </View>
              <Switch
                value={dataSyncEnabled}
                onValueChange={setDataSyncEnabled}
                trackColor={{ false: '#E5E5EA', true: '#4A90E2' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleDataExport}
              activeOpacity={0.8}
            >
              <View style={styles.settingIcon}>
                <Icon name="download" size={24} color="#34C759" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Export Data</Text>
                <Text style={styles.settingSubtitle}>Download your assessment data</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleClearData}
              activeOpacity={0.8}
            >
              <View style={styles.settingIcon}>
                <Icon name="trash" size={24} color="#FF3B30" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Clear All Data</Text>
                <Text style={styles.settingSubtitle}>Permanently delete all data</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support & Feedback */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Feedback</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleAboutApp}
              activeOpacity={0.8}
            >
              <View style={styles.settingIcon}>
                <Icon name="information-circle" size={24} color="#4A90E2" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>About App</Text>
                <Text style={styles.settingSubtitle}>Version and app information</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleSupport}
              activeOpacity={0.8}
            >
              <View style={styles.settingIcon}>
                <Icon name="help-circle" size={24} color="#FF9500" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingSubtitle}>Get help and contact support</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleRateApp}
              activeOpacity={0.8}
            >
              <View style={styles.settingIcon}>
                <Icon name="star" size={24} color="#FFD700" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Rate App</Text>
                <Text style={styles.settingSubtitle}>Rate us on the app store</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleShareApp}
              activeOpacity={0.8}
            >
              <View style={styles.settingIcon}>
                <Icon name="share-social" size={24} color="#34C759" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Share App</Text>
                <Text style={styles.settingSubtitle}>Share with friends and family</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Icon name="log-out" size={24} color="#FF3B30" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Alzico v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Alzico. All rights reserved.</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  placeholder: {
    width: 44,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF3B30',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginLeft: 12,
  },
  versionSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
  },
});

export default SettingsScreen; 