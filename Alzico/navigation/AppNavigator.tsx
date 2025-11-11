import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainerRef } from '@react-navigation/native';
import { View, Text, ActivityIndicator } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ConsentScreen from '../screens/ConsentScreen';
import MainScreen from '../screens/MainScreen';
import TestInterfaceScreen from '../screens/TestInterfaceScreen';
import ResultsScreen from '../screens/ResultsScreen';
import HelpScreen from '../screens/HelpScreen';
import SOSScreen from '../screens/SOSScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import BottomTabNavigator from './BottomTabNavigator';
import TestListScreen from '../screens/TestListScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReportScreen from '../screens/ReportScreen';
import ReportDetailScreen from '../screens/ReportDetailScreen';
import SummaryScreen from '../screens/SummaryScreen';
import ScoringScreen from '../screens/ScoringScreen';
import TestSequenceScreen from '../screens/TestSequenceScreen';
import Colors from '../constants/Colors';

interface AppNavigatorProps {
  isAuthenticated: boolean;
  user: any;
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Consent: undefined;
  Main: undefined;
  MainTabs: undefined;
  TestList: undefined;
  TestInterface: { testId: string; testName: string };
  Results: { testId: string; testName: string; score: number; predictionData?: any; error?: string };
  Help: undefined;
  SOS: undefined;
  History: undefined;
  Profile: undefined;
  Settings: undefined;
  About: undefined;
  Report: { score: number; date: string };
  ReportDetail: { date: string; score: number };
  Summary: { scores: number[] };
  Scoring: { score: number; testName: string };
  TestSequence: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = React.forwardRef<any, AppNavigatorProps>(({ isAuthenticated, user }, ref) => {
  // Determine initial route based on authentication status
  const getInitialRoute = () => {
    if (isAuthenticated) {
      return 'MainTabs';
    }
    return 'Welcome';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.backgroundNav,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          color: Colors.text,
        },
        headerShadowVisible: false,
        cardStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{ 
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Login' }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen 
        name="Consent" 
        component={ConsentScreen}
        options={{ title: 'Assessment Consent' }}
      />
      <Stack.Screen 
        name="Main" 
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TestList" 
        component={TestListScreen}
        options={{ title: 'Cognitive Tests', headerShown: false }}
      />
      <Stack.Screen 
        name="TestInterface" 
        component={TestInterfaceScreen}
        options={({ route }) => ({ 
          title: route.params.testName,
          headerShown: false 
        })}
      />
      <Stack.Screen 
        name="Results" 
        component={ResultsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Help" 
        component={HelpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SOS" 
        component={SOSScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="History" 
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Report" 
        component={ReportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ReportDetail" 
        component={ReportDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Summary" 
        component={SummaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Scoring" 
        component={ScoringScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="TestSequence" 
        component={TestSequenceScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
});

AppNavigator.displayName = 'AppNavigator';

export default AppNavigator;