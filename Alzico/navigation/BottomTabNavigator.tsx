import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WebIcon from '../components/WebIcons';
import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import TestListScreen from '../screens/TestListScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type BottomTabParamList = {
  Home: undefined;
  Tests: undefined;
  History: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Tests') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return (
            <View style={styles.tabIconContainer}>
              <WebIcon name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.backgroundNav,
          borderTopWidth: 2,
          borderTopColor: Colors.cardBorder,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          ...Platform.select({
            ios: {
              shadowColor: Colors.cardShadow,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.12,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginTop: 4,
          letterSpacing: 0.2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Tests" 
        component={TestListScreen}
        options={{ title: 'Tests' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{ title: 'History' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabNavigator;