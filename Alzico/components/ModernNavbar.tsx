import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import WebIcon from './WebIcons';
import Colors from '../constants/Colors';

type ModernNavbarProps = {
  title?: string;
  showBackButton?: boolean;
  transparent?: boolean;
  showAwareness?: boolean;
};

const { width } = Dimensions.get('window');

const ModernNavbar: React.FC<ModernNavbarProps> = ({
  title = 'Alzico',
  showBackButton = false,
  transparent = false,
  showAwareness = true,
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate('Main');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const handleHelp = () => {
    navigation.navigate('Help');
  };

  const handleAwareness = () => {
    Linking.openURL('https://www.who.int/news-room/fact-sheets/detail/dementia');
  };

  const handleTests = () => {
    navigation.navigate('TestList');
  };

  const handleHistory = () => {
    navigation.navigate('History');
  };

  return (
    <>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={transparent ? 'transparent' : Colors.backgroundNav} 
        translucent={transparent}
      />
      <View
        style={[
          styles.container,
          transparent && styles.transparentContainer,
        ]}
      >
        {/* Left Section */}
        <View style={styles.leftSection}>
        {showBackButton ? (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <WebIcon name="arrow-back" size={28} color={Colors.tint} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleHome}
            activeOpacity={0.7}
          >
            <WebIcon name="home" size={28} color={Colors.tint} />
          </TouchableOpacity>
        )}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>Cognitive Health</Text>
          </View>
        </View>

        {/* Center Navigation */}
        <View style={styles.centerSection}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={handleTests}
            activeOpacity={0.7}
          >
            <WebIcon name="clipboard" size={22} color={Colors.tint} />
            <Text style={styles.navButtonText}>Tests</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={handleHistory}
            activeOpacity={0.7}
          >
            <WebIcon name="time" size={22} color={Colors.tint} />
            <Text style={styles.navButtonText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showAwareness && (
            <TouchableOpacity 
              style={styles.awarenessButton} 
              onPress={handleAwareness}
              activeOpacity={0.8}
            >
              <WebIcon name="information-circle" size={18} color="#FFFFFF" />
              <Text style={styles.awarenessText}>WHO Info</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleHelp}
            activeOpacity={0.7}
          >
            <WebIcon name="help-circle" size={28} color={Colors.tint} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleProfile}
            activeOpacity={0.7}
          >
            <WebIcon name="person-circle" size={28} color={Colors.tint} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: Colors.backgroundNav,
    borderBottomWidth: 2,
    borderBottomColor: Colors.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  transparentContainer: {
    backgroundColor: 'rgba(232, 242, 247, 0.95)',
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: -2,
  },
  iconButton: {
    padding: 12,
    borderRadius: 28,
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 28,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: Colors.cardBorder,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    minHeight: 48,
    cursor: 'pointer',
  },
  navButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  awarenessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tint,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    shadowColor: Colors.tint,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minHeight: 48,
    cursor: 'pointer',
  },
  awarenessText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
});

export default ModernNavbar;