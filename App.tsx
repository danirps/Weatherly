import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { WeatherProvider } from './src/contexts/WeatherContext';
import AppLayout from './src/screens/AppLayout';

export default function App() {
  return (
    <SafeAreaProvider>
      <WeatherProvider>
        <AppLayout>
          <Navigation />
          <StatusBar style="light" />
        </AppLayout>
      </WeatherProvider>
    </SafeAreaProvider>
  );
}
