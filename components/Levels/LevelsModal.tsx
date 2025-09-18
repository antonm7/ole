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
        <SafeAreaView style={{ flex: 1, paddingTop: 8 }}>
          {/* drag handle */}
          <View style={{ alignItems: "center", paddingTop: 10, paddingBottom: 6 }}>
            <View
              style={{
                width: 44,
                height: 5,
                borderRadius: 3,
                backgroundColor: "#E0E0E0",
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
          >
            <Header points={points} />
            <CurrentTierCard
              current={current}
              next={next}
              progress={progress}
              toNext={toNext}
            />

            <Text style={styles.sectionTitle}>מהן הדרגות?</Text>
            <View style={{ gap: 12 }}>
              {TIERS.map((t) => (
                <TierRow key={t.key} tier={t} highlight={t.key === current.key} />
              ))}
            </View>

            <View style={styles.ctaRow}>
              <Pressable style={[styles.btn, styles.btnSecondary]} onPress={onClose}>
                <Text style={[styles.btnText, styles.btnTextSecondary]}>סגור</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => {
                  onClose();
                  router.push("/info");
                }}
              >
                <Text style={[styles.btnText, styles.btnTextPrimary]}>
                  איך צוברים נקודות?
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        // Android bottom sheet style wrapper
        <SafeAreaView style={styles.sheetWrapper}>
          <View style={styles.sheet}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 28, paddingHorizontal: 20 }}
            >
              <Header points={points} />
              <CurrentTierCard
                current={current}
                next={next}
                progress={progress}
                toNext={toNext}
              />

              <Text style={styles.sectionTitle}>מהן הדרגות?</Text>
              <View style={{ gap: 12 }}>
                {TIERS.map((t) => (
                  <TierRow key={t.key} tier={t} highlight={t.key === current.key} />
                ))}
              </View>

              <View style={styles.ctaRow}>
                <Pressable style={[styles.btn, styles.btnSecondary]} onPress={onClose}>
                  <Text style={[styles.btnText, styles.btnTextSecondary]}>
                    סגור
                  </Text>
                </Pressable>
                <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onClose}>
                  <Text style={[styles.btnText, styles.btnTextPrimary]}>
                    איך צוברים נקודות?
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </Modal>
  );
}

function Header({ points }: { points: number }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.title}>דרגות נקודות דיגיטליות</Text>
      <Text style={styles.subtitle}>
        הנקודות נצברות בכל רכישה באשראי. ככל שתצבור יותר — תעלה בדרגות.
      </Text>
      <Text style={styles.pointsLine}>
        נקודות נוכחיות:{" "}
        <Text style={styles.pointsStrong}>{points.toLocaleString()}</Text>
      </Text>
    </View>
  );
}

function CurrentTierCard({
  current,
  next,
  progress,
  toNext,
}: {
  current: Tier;
  next: Tier | null;
  progress: number;
  toNext: number;
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
          <Text style={styles.currentTitle}>
            הדרגה הנוכחית שלך: {current.name}
          </Text>
          {next ? (
            <Text style={styles.currentSub}>
              עוד {toNext.toLocaleString()} נק׳ ל{next.name}
            </Text>
          ) : (
            <Text style={styles.currentSub}>הגעת לדרגת יהלום — כל הכבוד!</Text>
          )}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.round(progress * 100)}%` },
              ]}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

function TierRow({ tier, highlight }: { tier: Tier; highlight?: boolean }) {
  return (
    <View style={[styles.tierRow, highlight && styles.tierRowHighlight]}>
      <LinearGradient
        colors={[tier.colorFrom, tier.colorTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.tierIconWrap}
      >
        <MaterialIcons name={tier.icon as any} size={22} color="#212121" />
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <Text style={styles.tierTitle}>
          דרגת {tier.name} · החל מ־{tier.min.toLocaleString()} נק׳
        </Text>
        <Text style={styles.tierDescription}>{tier.description}</Text>
        {tier.perks.map((p, i) => (
          <View key={i} style={styles.perkRow}>
            <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
            <Text style={styles.perkText}>{p}</Text>
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
    backgroundColor: "#fff",
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
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "left",
    lineHeight: 20,
    marginBottom: 10,
  },
  pointsLine: { fontSize: 14, color: "#333", textAlign: "left" },
  pointsStrong: { fontWeight: "800", color: "#d50000" },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "left",
    marginTop: 14,
    marginBottom: 8,
    color: "#222",
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
    color: "#1A1A1A",
    textAlign: "left",
  },
  currentSub: {
    fontSize: 13,
    color: "#212121",
    textAlign: "left",
    marginTop: 2,
  },

  progressBar: {
    height: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: { height: "100%", backgroundColor: "#212121" },

  tierRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tierRowHighlight: {
    borderWidth: 1.5,
    borderColor: "#d50000",
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
    color: "#222",
    textAlign: "left",
    marginBottom: 6,
  },

  tierDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
    textAlign: "left",
  },
  perkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  perkText: { fontSize: 13, color: "#444", textAlign: "left" },

  ctaRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#d50000" },
  btnSecondary: { backgroundColor: "#f1f1f1" },
  btnText: { fontSize: 16, fontWeight: "700" },
  btnTextPrimary: { color: "#fff" },
  btnTextSecondary: { color: "#333" },

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
