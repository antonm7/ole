import { type ClubTheme } from "@/constants/Colors";
import { useClubTheme } from "@/hooks/useClubTheme";
import { usePoints, useSetPoints } from "@/hooks/usePoints"; // 👈 import Zustand store
import { getProgress, TIERS, type Tier } from "@/lib/tiers";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export function LevelsModal({
  visible,
  onClose,
  onDismiss,
}: {
  visible: boolean;
  onClose: () => void;
  onDismiss?: () => void;
}) {
  const points = usePoints();
  const setPoints = useSetPoints();
  const theme = useClubTheme();
  const isLight = theme.background === "#FFFFFF";

  const sheetBackground = theme.background;
  const surfaceCard = isLight ? "#FFFFFF" : "#1C1F24";
  const secondarySurface = isLight ? "#F8FAFC" : "#232832";
  const dividerColor = isLight ? "rgba(15, 23, 42, 0.1)" : "rgba(148, 163, 184, 0.12)";
  const handleColor = isLight ? "#E0E0E0" : "#2D3036";

  // ✅ single source of truth for tier logic
  const { current, next, progress, toNext } = getProgress(points);

  const increment = () => setPoints(points + 500);
  const decrement = () => setPoints(points - 500);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={Platform.OS !== "ios"} // iOS pageSheet must be non-transparent
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "overFullScreen"}
      onRequestClose={onClose}
      onDismiss={onDismiss}
    >
      {Platform.OS === "ios" ? (
        <SafeAreaView style={{ flex: 1, paddingTop: 8, backgroundColor: sheetBackground }}>
          {/* drag handle */}
          <View style={{ alignItems: "center", paddingTop: 10, paddingBottom: 6 }}>
            <View
              style={{
                width: 44,
                height: 5,
                borderRadius: 3,
                backgroundColor: handleColor,
              }}
            />
          </View>

          {/* invisible dev buttons */}
          <Pressable
            style={styles.devBtnRight}
            onPress={increment}
          />
          <Pressable
            style={styles.devBtnLeft}
            onPress={decrement}
          />

          <ScrollView
            contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: sheetBackground }}
          >
            <Header points={points} isLight={isLight} theme={theme} />
            <CurrentTierCard
              current={current}
              next={next}
              progress={progress}
              toNext={toNext}
              isLight={isLight}
            />

            <Text style={[styles.sectionTitle, { color: isLight ? "#1E293B" : "#E2E8F0" }]}>
              מהן הדרגות?
            </Text>
            <View style={{ gap: 12 }}>
              {TIERS.map((t) => (
                <TierRow
                  key={t.key}
                  tier={t}
                  highlight={t.key === current.key}
                  isLight={isLight}
                  surfaceCard={surfaceCard}
                  dividerColor={dividerColor}
                  theme={theme}
                />
              ))}
            </View>

            <View style={styles.ctaRow}>
              <Pressable
                style={[
                  styles.btn,
                  { backgroundColor: secondarySurface, borderWidth: 1, borderColor: dividerColor },
                ]}
                onPress={onClose}
              >
                <Text style={[styles.btnText, { color: isLight ? "#1F2937" : "#E2E8F0" }]}>סגור</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, { backgroundColor: theme.primary }]}
                onPress={() => {
                  onClose();
                  router.push("/info");
                }}
              >
                <Text style={[styles.btnText, { color: theme.onPrimary }]}>איך צוברים נקודות?</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        // Android bottom sheet style wrapper
        <SafeAreaView style={styles.sheetWrapper}>
          <View style={[styles.sheet, { backgroundColor: sheetBackground }]}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 20 }}
              style={{ backgroundColor: sheetBackground }}
            >
              <Header points={points} isLight={isLight} theme={theme} />
              <CurrentTierCard
                current={current}
                next={next}
                progress={progress}
                toNext={toNext}
                isLight={isLight}
              />

              <Text style={[styles.sectionTitle, { color: isLight ? "#1E293B" : "#E2E8F0" }]}>
                מהן הדרגות?
              </Text>
              <View style={{ gap: 12 }}>
                {TIERS.map((t) => (
                  <TierRow
                    key={t.key}
                    tier={t}
                    highlight={t.key === current.key}
                    isLight={isLight}
                    surfaceCard={surfaceCard}
                    dividerColor={dividerColor}
                    theme={theme}
                  />
                ))}
              </View>

              <View style={styles.ctaRow}>
                <Pressable
                  style={[
                    styles.btn,
                    { backgroundColor: secondarySurface, borderWidth: 1, borderColor: dividerColor },
                  ]}
                  onPress={onClose}
                >
                  <Text style={[styles.btnText, { color: isLight ? "#1F2937" : "#E2E8F0" }]}>
                    סגור
                  </Text>
                </Pressable>
                <Pressable style={[styles.btn, { backgroundColor: theme.primary }]} onPress={onClose}>
                  <Text style={[styles.btnText, { color: theme.onPrimary }]}>איך צוברים נקודות?</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </Modal>
  );
}

function Header({ points, isLight, theme }: { points: number; isLight: boolean; theme: ClubTheme }) {
  const titleColor = isLight ? "#1E293B" : "#E2E8F0";
  const subtitleColor = isLight ? "#4B5563" : "#94A3B8";
  const pointsColor = isLight ? "#1F2937" : "#CBD5F5";
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={[styles.title, { color: titleColor }]}>דרגות נקודות דיגיטליות</Text>
      <Text style={[styles.subtitle, { color: subtitleColor }]}>
        הנקודות נצברות בכל רכישה באשראי. ככל שתצבור יותר — תעלה בדרגות.
      </Text>
      <Text style={[styles.pointsLine, { color: pointsColor }]}>
        נקודות נוכחיות:{" "}
        <Text style={[styles.pointsStrong, { color: theme.primary }]}>
          {points.toLocaleString()}
        </Text>
      </Text>
    </View>
  );
}

function CurrentTierCard({
  current,
  next,
  progress,
  toNext,
  isLight,
}: {
  current: Tier;
  next: Tier | null;
  progress: number;
  toNext: number;
  isLight: boolean;
}) {
  return (
    <View style={styles.currentCard}>
      <LinearGradient
        colors={[current.colorFrom, current.colorTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.currentGradient}
      >
        <View style={styles.badge}>
          <MaterialIcons name={current.icon as any} size={28} color="#212121" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.currentTitle, { color: "#0F172A" }]}>
            הדרגה הנוכחית שלך: {current.name}
          </Text>
          {next ? (
            <Text style={[styles.currentSub, { color: "#111827" }]}>
              עוד {toNext.toLocaleString()} נק׳ ל{next.name}
            </Text>
          ) : (
            <Text style={[styles.currentSub, { color: "#111827" }]}>הגעת לדרגת יהלום — כל הכבוד!</Text>
          )}
          <View
            style={[
              styles.progressBar,
              { backgroundColor: isLight ? "rgba(255,255,255,0.5)" : "rgba(15, 23, 42, 0.25)" },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: isLight ? "rgba(33,33,33,0.9)" : "rgba(15, 23, 42, 0.85)",
                },
              ]}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function TierRow({
  tier,
  highlight,
  isLight,
  surfaceCard,
  dividerColor,
  theme,
}: {
  tier: Tier;
  highlight?: boolean;
  isLight: boolean;
  surfaceCard: string;
  dividerColor: string;
  theme: ClubTheme;
}) {
  return (
    <View
      style={[
        styles.tierRow,
        {
          backgroundColor: surfaceCard,
          borderWidth: 1,
          borderColor: highlight ? theme.primary : dividerColor,
        },
        highlight && styles.tierRowHighlight,
      ]}
    >
      <LinearGradient
        colors={[tier.colorFrom, tier.colorTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tierIconWrap}
      >
        <MaterialIcons name={tier.icon as any} size={22} color="#212121" />
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={[styles.tierTitle, { color: isLight ? "#1E293B" : "#E2E8F0" }]}>
          דרגת {tier.name} · החל מ־{tier.min.toLocaleString()} נק׳
        </Text>
        <Text style={[styles.tierDescription, { color: isLight ? "#475569" : "#94A3B8" }]}>
          {tier.description}
        </Text>
        {tier.perks.map((p, i) => (
          <View key={i} style={styles.perkRow}>
            <MaterialIcons name="check-circle" size={16} color={isLight ? "#22C55E" : "#4ADE80"} />
            <Text style={[styles.perkText, { color: isLight ? "#334155" : "#CBD5F5" }]}>{p}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Android wrapper
  sheetWrapper: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "left",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "left",
    lineHeight: 20,
    marginBottom: 10,
  },
  pointsLine: { fontSize: 14, textAlign: "left" },
  pointsStrong: { fontWeight: "800" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    marginTop: 14,
    marginBottom: 8,
  },

  currentCard: { borderRadius: 16, overflow: "hidden", marginBottom: 12 },
  currentGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
  },
  currentTitle: {
    fontSize: 16,
    fontWeight: "800",
    textAlign: "left",
  },
  currentSub: {
    fontSize: 13,
    textAlign: "left",
    marginTop: 2,
  },

  progressBar: {
    height: 8,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: { height: "100%" },

  tierRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tierRowHighlight: {
    borderWidth: 1.5,
  },
  tierIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tierTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "left",
    marginBottom: 6,
  },

  tierDescription: {
    fontSize: 13,
    marginBottom: 6,
    textAlign: "left",
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  perkText: { fontSize: 13, textAlign: "left" },

  ctaRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { fontSize: 16, fontWeight: "700" },

  // dev invisible buttons for increment/decrement
  devBtnRight: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 60,
    height: 60,
    zIndex: 999,
    backgroundColor: "transparent",
  },
  devBtnLeft: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 60,
    height: 60,
    zIndex: 999,
    backgroundColor: "transparent",
  },
});
