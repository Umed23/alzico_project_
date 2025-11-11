import React from 'react';
import { View } from 'react-native';

// Web-compatible SafeAreaContext polyfill
export const SafeAreaInsetsContext = React.createContext({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});

export const SafeAreaFrameContext = React.createContext({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

export const SafeAreaProvider = ({ children, initialMetrics }) => {
  const insets = initialMetrics?.insets || { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = initialMetrics?.frame || { x: 0, y: 0, width: 0, height: 0 };

  return (
    <SafeAreaFrameContext.Provider value={frame}>
      <SafeAreaInsetsContext.Provider value={insets}>
        {children}
      </SafeAreaInsetsContext.Provider>
    </SafeAreaFrameContext.Provider>
  );
};

export const SafeAreaView = ({ children, style, ...props }) => {
  return (
    <View style={[{ flex: 1 }, style]} {...props}>
      {children}
    </View>
  );
};

export const useSafeAreaInsets = () => {
  return React.useContext(SafeAreaInsetsContext);
};

export const useSafeAreaFrame = () => {
  return React.useContext(SafeAreaFrameContext);
};

export const initialWindowMetrics = {
  frame: {
    x: 0,
    y: 0,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  },
  insets: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

// Default export for compatibility
export default {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
  useSafeAreaFrame,
  initialWindowMetrics,
  SafeAreaInsetsContext,
  SafeAreaFrameContext,
};

