import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ModernNavbar from '../components/ModernNavbar';
import WebIcon from '../components/WebIcons';

type AboutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'About'>;

const AboutScreen = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLearnMore = (url: string) => {
    Linking.openURL(url);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@memorycare.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ModernNavbar title="About Alzheimer's" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIcon}>
            <Ionicons name="medical" size={60} color="#4A90E2" />
          </View>
          <Text style={styles.heroTitle}>Understanding Alzheimer's Disease</Text>
          <Text style={styles.heroSubtitle}>
            Learn about the most common form of dementia and how early detection can help
          </Text>
        </View>

        {/* What is Alzheimer's */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>What is Alzheimer's Disease?</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Alzheimer's disease is a progressive brain disorder that slowly destroys memory, 
              thinking skills, and eventually the ability to carry out simple tasks. It's the 
              most common cause of dementia among older adults.
            </Text>
          </View>
        </View>

        {/* WHO Awareness Section */}
        <View style={styles.whoSection}>
          <Text style={styles.sectionTitle}>WHO Alzheimer's Resources</Text>
          <View style={styles.whoCard}>
            <View style={styles.whoLogoContainer}>
              <Ionicons name="globe-outline" size={40} color="#4A90E2" />
            </View>
            <Text style={styles.whoTitle}>World Health Organization</Text>
            <Text style={styles.whoDescription}>
              Access official resources, research, and guidance from the World Health Organization
              about Alzheimer's disease and other forms of dementia.
            </Text>
            <TouchableOpacity 
              style={styles.whoButton}
              onPress={() => handleLearnMore('https://www.who.int/news-room/fact-sheets/detail/dementia')}
            >
              <Text style={styles.whoButtonText}>Visit WHO Alzheimer's Page</Text>
              <Ionicons name="open-outline" size={16} color="#FFFFFF" style={{marginLeft: 8}} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Early Signs */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Early Warning Signs</Text>
          <View style={styles.signsList}>
            <View style={styles.signItem}>
              <View style={styles.signIcon}>
                <Ionicons name="alert-circle" size={20} color="#FF9500" />
              </View>
              <Text style={styles.signText}>
                Memory loss that disrupts daily life
              </Text>
            </View>
            
            <View style={styles.signItem}>
              <View style={styles.signIcon}>
                <Ionicons name="alert-circle" size={20} color="#FF9500" />
              </View>
              <Text style={styles.signText}>
                Difficulty planning or solving problems
              </Text>
            </View>
            
            <View style={styles.signItem}>
              <View style={styles.signIcon}>
                <Ionicons name="alert-circle" size={20} color="#FF9500" />
              </View>
              <Text style={styles.signText}>
                Confusion with time or place
              </Text>
            </View>
            
            <View style={styles.signItem}>
              <View style={styles.signIcon}>
                <Ionicons name="alert-circle" size={20} color="#FF9500" />
              </View>
              <Text style={styles.signText}>
                Trouble understanding visual images
              </Text>
            </View>
            
            <View style={styles.signItem}>
              <View style={styles.signIcon}>
                <Ionicons name="alert-circle" size={20} color="#FF9500" />
              </View>
              <Text style={styles.signText}>
                New problems with words in speaking or writing
              </Text>
            </View>
          </View>
        </View>

        {/* Risk Factors */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Risk Factors</Text>
          <View style={styles.riskFactorsGrid}>
            <View style={styles.riskFactorCard}>
              <View style={styles.riskFactorIcon}>
                <Ionicons name="time" size={24} color="#FF6B6B" />
              </View>
              <Text style={styles.riskFactorTitle}>Age</Text>
              <Text style={styles.riskFactorText}>
                Risk increases significantly after age 65
              </Text>
            </View>
            
            <View style={styles.riskFactorCard}>
              <View style={styles.riskFactorIcon}>
                <Ionicons name="people" size={24} color="#4A90E2" />
              </View>
              <Text style={styles.riskFactorTitle}>Family History</Text>
              <Text style={styles.riskFactorText}>
                Having a parent or sibling with Alzheimer's
              </Text>
            </View>
            
            <View style={styles.riskFactorCard}>
              <View style={styles.riskFactorIcon}>
                <Ionicons name="heart" size={24} color="#FF3B30" />
              </View>
              <Text style={styles.riskFactorTitle}>Heart Health</Text>
              <Text style={styles.riskFactorText}>
                High blood pressure, heart disease, stroke
              </Text>
            </View>
            
            <View style={styles.riskFactorCard}>
              <View style={styles.riskFactorIcon}>
                <Ionicons name="school" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.riskFactorTitle}>Education</Text>
              <Text style={styles.riskFactorText}>
                Lower levels of formal education
              </Text>
            </View>
          </View>
        </View>

        {/* Prevention */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Prevention & Management</Text>
          <View style={styles.preventionList}>
            <View style={styles.preventionItem}>
              <View style={styles.preventionIcon}>
                <Ionicons name="bulb" size={20} color="#34C759" />
              </View>
              <Text style={styles.preventionText}>
                Stay mentally active with puzzles, reading, and learning new skills
              </Text>
            </View>
            
            <View style={styles.preventionItem}>
              <View style={styles.preventionIcon}>
                <Ionicons name="walk" size={20} color="#34C759" />
              </View>
              <Text style={styles.preventionText}>
                Regular physical exercise to improve blood flow to the brain
              </Text>
            </View>
            
            <View style={styles.preventionItem}>
              <View style={styles.preventionIcon}>
                <Ionicons name="people" size={20} color="#34C759" />
              </View>
              <Text style={styles.preventionText}>
                Maintain social connections and engage in meaningful activities
              </Text>
            </View>
            
            <View style={styles.preventionItem}>
              <View style={styles.preventionIcon}>
                <Ionicons name="leaf" size={20} color="#34C759" />
              </View>
              <Text style={styles.preventionText}>
                Eat a healthy diet rich in fruits, vegetables, and omega-3 fatty acids
              </Text>
            </View>
          </View>
        </View>

        {/* When to Seek Help */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>When to Seek Medical Help</Text>
          <View style={styles.warningCard}>
            <Ionicons name="warning" size={24} color="#FF9500" />
            <Text style={styles.warningText}>
              If you or a loved one experience any of these symptoms, it's important to 
              consult with a healthcare provider for proper evaluation and diagnosis. 
              Early detection can lead to better treatment options and quality of life.
            </Text>
          </View>
        </View>

        {/* Resources */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Helpful Resources</Text>
          <View style={styles.resourcesList}>
            <TouchableOpacity
              style={styles.resourceCard}
              onPress={() => handleLearnMore('https://www.alz.org')}
            >
              <Ionicons name="globe" size={24} color="#4A90E2" />
              <Text style={styles.resourceTitle}>Alzheimer's Association</Text>
              <Text style={styles.resourceText}>Comprehensive information and support</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.resourceCard}
              onPress={() => handleLearnMore('https://www.nia.nih.gov')}
            >
              <Ionicons name="library" size={24} color="#34C759" />
              <Text style={styles.resourceTitle}>National Institute on Aging</Text>
              <Text style={styles.resourceText}>Research and educational resources</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.resourceCard}
              onPress={() => handleLearnMore('https://www.cdc.gov/aging')}
            >
              <Ionicons name="medical" size={24} color="#FF9500" />
              <Text style={styles.resourceTitle}>CDC Aging & Health</Text>
              <Text style={styles.resourceText}>Government health information</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Support */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactSupport}
            activeOpacity={0.8}
          >
            <Ionicons name="mail" size={24} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
          <Text style={styles.contactSubtext}>
            Our team is here to help answer your questions
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerSection}>
          <View style={styles.disclaimerCard}>
            <Ionicons name="information-circle" size={20} color="#FF9500" />
            <Text style={styles.disclaimerText}>
              This information is for educational purposes only and should not replace 
              professional medical advice. Always consult with qualified healthcare 
              providers for diagnosis and treatment.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  whoSection: {
    marginBottom: 24,
  },
  whoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  whoLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  whoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  whoDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  whoButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 16,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heroIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 24,
  },
  signsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  signItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  signIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  signText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 22,
  },
  riskFactorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  riskFactorCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  riskFactorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskFactorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  riskFactorText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 16,
  },
  preventionList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  preventionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  preventionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  preventionText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    lineHeight: 22,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 16,
    padding: 20,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  warningText: {
    flex: 1,
    fontSize: 16,
    color: '#F57C00',
    lineHeight: 24,
    marginLeft: 12,
  },
  resourcesList: {
    gap: 16,
  },
  resourceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resourceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 8,
  },
  resourceText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  contactSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  contactButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  contactSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  disclaimerSection: {
    marginBottom: 20,
  },
  disclaimerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    fontSize: 14,
    color: '#F57C00',
    lineHeight: 20,
    marginLeft: 12,
  },
});

export default AboutScreen;