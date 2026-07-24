import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Navigation } from './src/navigation';
import { ProcessingOverlay } from './src/components/common/ProcessingOverlay';
import { Toast } from './src/components/common/Toast';
import { useTheme } from './src/theme/useTheme';

export default function App() {
  const theme = useTheme();

  return (
    <GestureHandlerRootView style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} backgroundColor={theme.bg} />
      <Navigation />
      <ProcessingOverlay />
      <Toast />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
