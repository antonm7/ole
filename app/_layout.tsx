// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import '../global.css';
import { I18nManager } from "react-native";


export const unstable_settings = { initialRouteName: '(auth)' };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Force RTL globally
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{headerShown:false}}/>
        <Stack.Screen name="(main)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
