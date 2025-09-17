// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";

import { useClubTheme } from "@/hooks/useClubTheme"; // ✅ single theme hook
import "react-native-reanimated";

export default function TabLayout() {
  // Club-aware theme (hook resolves club + light/dark automatically)
  const theme = useClubTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: Platform.select({
          ios: {
            // transparent to show blur background
            position: "absolute",
            backgroundColor: "transparent",
          },
          default: {
            backgroundColor: theme.background,
          },
        }),
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "פרופיל",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={25} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "בית",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="offers"
        options={{
          title: "הצעות",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={25} name="gift.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: "מידע",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={25} name="info.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
