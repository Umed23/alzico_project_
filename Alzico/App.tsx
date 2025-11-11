import React, { useRef, useEffect } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { StatusBar, View, Text, ActivityIndicator, Platform, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider, useAuth } from './context/AuthContext';

const AuthNavigator = () => {
  const { isAuthenticated, user } = useAuth();
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    // Prevent going back to login screens when authenticated
    if (isAuthenticated && navigationRef.current) {
      const currentRoute = navigationRef.current.getCurrentRoute();
      
      // If somehow on Welcome/Login/Signup screen while authenticated, redirect
      if (currentRoute && ['Welcome', 'Login', 'Signup'].includes(currentRoute.name)) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    }
  }, [isAuthenticated]);

  return <AppNavigator ref={navigationRef} isAuthenticated={isAuthenticated} user={user} />;
};

const App = () => {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  // Handle web browser back button
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handlePopState = () => {
        // Let React Navigation handle it
        return false;
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, width: '100%', height: '100%' }}>
          <NavigationContainer 
            ref={navigationRef}
            documentTitle={{
              formatter: (options, route) =>
                `Alzico - ${options?.title ?? route?.name ?? 'Cognitive Health'}`,
            }}
          >
            <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
            <AuthNavigator />
          </NavigationContainer>
        </View>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App; 