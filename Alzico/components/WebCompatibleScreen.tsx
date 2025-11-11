import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ModernNavbar from '../components/ModernNavbar';
import WebIcon from '../components/WebIcons';

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface WebCompatibleScreenProps {
  title: string;
  content: string;
  showBackButton?: boolean;
}

const WebCompatibleScreen: React.FC<WebCompatibleScreenProps> = ({
  title,
  content,
  showBackButton = true,
}) => {
  const navigation = useNavigation<ScreenNavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <ModernNavbar title={title} showBackButton={showBackButton} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentCard}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
        
        <View style={styles.infoCard}>
          <WebIcon name="information-circle" size={24} color="#4A90E2" />
          <Text style={styles.infoText}>
            This screen is optimized for web compatibility. 
            Full functionality will be available in the mobile app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  scrollContent: {
    padding: 20,
  },
  contentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  contentText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.2)',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default WebCompatibleScreen;

