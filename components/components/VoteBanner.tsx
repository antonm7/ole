import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  isLightBg: boolean;
  cost: number;
  onPress: () => void;
};

const VoteBannerComponent = ({ isLightBg, cost, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper} activeOpacity={0.95}>
      <LinearGradient
        colors={isLightBg ? ["#1E2B49", "#1f2937"] : ["#fef9c3", "#fde68a"]}
        style={styles.banner}
      >
        <View style={styles.newTag}>
          <Text style={styles.newTagText}>חדש</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: isLightBg ? "#e2e8f0" : "#111827" }]}>הצביעו למדי הבית הבאים</Text>
          <Text style={[styles.subtitle, { color: isLightBg ? "#94a3b8" : "#1f2937" }]}>
            השתתפות בהצבעה ב-{cost.toLocaleString()} נקודות
          </Text>
          <View style={styles.ctaRow}>
            <Text style={[styles.cta, { color: isLightBg ? "#38bdf8" : "#b45309" }]}>הצבע עכשיו</Text>
            <MaterialIcons name="chevron-left" size={20} color={isLightBg ? "#38bdf8" : "#b45309"} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginTop: 20, opacity: 0.95 },
  banner: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.2,
    minHeight: 112,
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  newTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ef4444",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    zIndex: 2,
  },
  newTagText: { color: "#fff", fontWeight: "800", fontSize: 11, textAlign: "left" },
  content: { gap: 6 },
  title: { fontSize: 18, fontWeight: "800", textAlign: "left" },
  subtitle: { fontSize: 13, opacity: 0.9, textAlign: "left" },
  ctaRow: { flexDirection: "row", alignItems: "center", columnGap: 4, marginTop: 2 },
  cta: { fontSize: 14, fontWeight: "800", textAlign: "left" },
});

export const VoteBanner = memo(VoteBannerComponent);
VoteBanner.displayName = "VoteBanner";
