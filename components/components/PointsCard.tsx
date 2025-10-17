import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View, type StyleProp, type ViewStyle } from "react-native";

import { type ClubTheme } from "@/constants/Colors";
import { type Tier } from "@/lib/tiers";

type Props = {
  isLightBg: boolean;
  onPress: () => void;
  points: number;
  growthLabel?: string;
  current: Tier;
  next: Tier | null;
  progress: number;
  toNext: number;
  theme: Pick<ClubTheme, "text" | "primary">;
  style?: StyleProp<ViewStyle>;
};

const PointsCardComponent = ({
  isLightBg,
  onPress,
  points,
  growthLabel = "+250 השבוע",
  current,
  next,
  progress,
  toNext,
  theme,
  style,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.card,
        style,
        {
          backgroundColor: isLightBg ? "#fff" : "#1d1f22",
          shadowOpacity: isLightBg ? 0.15 : 0.25,
        },
      ]}
      activeOpacity={0.9}
    >
      <Text style={[styles.cardTitle, { color: theme.text }]}>⭐ נקודות דיגיטליות</Text>
      <Text style={[styles.points, { color: theme.primary }]}>{points.toLocaleString()}</Text>
      <Text style={[styles.growth, { color: "#12B886" }]}>{growthLabel}</Text>

      <View style={styles.progressRow}>
        <LinearGradient colors={[current.colorFrom, current.colorTo]} style={styles.tierIconWrap}>
          <MaterialIcons name={current.icon as any} size={14} color="#212121" />
        </LinearGradient>

        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressBar, { backgroundColor: isLightBg ? "#eee" : "#2a2d31" }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: current.colorTo }]} />
          </View>
          {next ? (
            <Text style={[styles.progressText, { color: theme.text }]}>
              עוד {toNext.toLocaleString()} נקודות לדרגת {next.name}
            </Text>
          ) : (
            <Text style={[styles.progressText, { color: theme.text }]}>הגעת לדרגת {current.name} 🎉</Text>
          )}
        </View>

        {next && (
          <LinearGradient colors={[next.colorFrom, next.colorTo]} style={styles.tierIconWrap}>
            <MaterialIcons name={next.icon as any} size={14} color="#212121" />
          </LinearGradient>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginTop: -40,
  },
  cardTitle: { fontSize: 14, textAlign: "center", alignSelf: "stretch" },
  points: { fontSize: 44, fontWeight: "bold", marginVertical: 8, alignSelf: "stretch", textAlign: "center" },
  growth: { fontSize: 14, alignSelf: "stretch", textAlign: "center" },
  progressRow: { flexDirection: "row", alignItems: "center", marginTop: 12, alignSelf: "stretch" },
  progressBarWrapper: { flex: 1, marginHorizontal: 8, alignItems: "center" },
  progressBar: { height: 10, borderRadius: 6, overflow: "hidden", width: "100%", marginBottom: 4 },
  progressFill: { height: "100%", borderRadius: 6 },
  progressText: { fontSize: 12, opacity:0.6,textAlign: "center", alignSelf: "stretch" },
  tierIconWrap: { width: 24, height: 24, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});

export const PointsCard = memo(PointsCardComponent);
PointsCard.displayName = "PointsCard";
