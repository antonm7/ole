import { memo } from "react";
import { Animated, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { CLUB_LOGOS } from "@/constants/OFFER_ASSETS";
import { type ClubKey, type ClubTheme } from "@/constants/Colors";

type AnimatedValue = Animated.AnimatedInterpolation<string | number>;

type Props = {
  theme: Pick<ClubTheme, "onPrimary" | "headerGradient">;
  currentClub: ClubKey;
  translateY: AnimatedValue;
  opacity: AnimatedValue;
  height: number;
  userName: string;
};

const HomeHeaderComponent = ({ theme, currentClub, translateY, opacity, height, userName }: Props) => {
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { transform: [{ translateY }], opacity, height }]}
    >
      <LinearGradient colors={theme.headerGradient} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.inner}>
        <View>
          <Text style={[styles.greeting, { color: theme.onPrimary }]}>שלום {userName}</Text>
          <Text style={[styles.subtitle, { color: theme.onPrimary }]}>
            {currentClub === "hapoel-tel-aviv" ? "אוהד הפועל תל אביב" : "אוהד מכבי חיפה"}
          </Text>
        </View>
        <Image source={CLUB_LOGOS[currentClub]} style={styles.logo} resizeMode="contain" />
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 40,
    zIndex: 1,
    overflow: "hidden",
  },
  inner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: { fontSize: 20, fontWeight: "700", textAlign: "left" },
  subtitle: { fontSize: 14, textAlign: "left", marginTop: 4 },
  logo: { width: 82, height: 82, marginLeft: 8 },
});

export const HomeHeader = memo(HomeHeaderComponent);
HomeHeader.displayName = "HomeHeader";
