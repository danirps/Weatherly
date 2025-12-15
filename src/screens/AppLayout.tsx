import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { colors } from '../theme/colors';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  // DEFINIÇÃO CLARA DE DARK MODE
  const isDarkTheme = colors.background === '#0A192F' || colors.background === '#000000';

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Ícones da navigation bar (quando o sistema permitir)
      NavigationBar.setButtonStyleAsync(isDarkTheme ? 'light' : 'dark');
    }
  }, [isDarkTheme]);

  return (
    <View style={styles.root}>
      {/* Status Bar (hora, bateria, wifi, notificações) */}
      <StatusBar
        style={isDarkTheme ? 'light' : 'dark'}
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
