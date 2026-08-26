import 'react-native-gesture-handler';
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { AppDataProvider, useAppData } from './src/context/AppDataContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function MainApp() {
  const { isDark, theme } = useTheme();
  const { isLoading } = useAppData();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
        <View
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 22,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 2.5,
            borderColor: theme.colors.border,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: '900',
              color: '#121212',
              letterSpacing: 1,
            }}
          >
            SUFIKER+
          </Text>
        </View>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppDataProvider>
            <MainApp />
          </AppDataProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
