import { InfoModal } from "@/components/Offers/InfoModal";
import { OfferCard, type Offer } from "@/components/Offers/OfferCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { LevelsModal } from "@/components/Levels/LevelsModal";
import { type ClubKey } from "@/constants/Colors";
import { useClub, useClubTheme } from "@/hooks/useClubTheme";

import { CLUB_LOGOS, OFFER_ASSETS } from "@/constants/OFFER_ASSETS";
import { usePoints, useSetPoints } from "@/hooks/usePoints";
import { getProgress } from "@/lib/tiers";

const HEADER_HEIGHT = 200;
const { width } = Dimensions.get("window");
const VOTE_COST = 1250;
const SECTION_GAP = 20; // consistent vertical spacing

export default function HomePage() {
  const theme = useClubTheme();
  const currentClub: ClubKey = useClub();

  const y = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Offer | null>(null);
  const [levelsModalVisibility, setLevelsVisible] = useState(false);
  const progressOffers = useSharedValue(0);

  // Zustand – selectors
  const points = usePoints();
  const redeem = useSetPoints();

  // vote state
  const [voteVisible, setVoteVisible] = useState(false);
  const [selectedHomeVersion, setSelectedHomeVersion] = useState<"A" | "B" | "C" | null>(null);

  const { current, next, progress, toNext } = getProgress(points);

  const headerTranslateY = y.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });
  const headerOpacity = y.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.8],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const openOffer = (offer: Offer) => {
    setSelected(offer);
    setModalVisible(true);
  };
  const closeModal = () => setModalVisible(false);

  const isLightBg = theme.background === "#FFFFFF";
  const assets = OFFER_ASSETS[currentClub];

  const offers: Offer[] = [
    {
      image: assets.shirt,
      title: "חולצת בית רשמית 2024",
      description:
        currentClub === "hapoel-tel-aviv"
          ? "החולצה החדשה של הפועל תל אביב לעונת 2024. איכות פרימיום עם רקמת הלוגו הרשמי."
          : "החולצה החדשה של מכבי חיפה לעונת 2024. איכות פרימיום עם רקמת הלוגו הרשמי.",
      expiresAt: "31/12",
      points: 2500,
    },
    {
      image: assets.scarf,
      title: "צעיף רשמי – חורף",
      description:
        currentClub === "hapoel-tel-aviv"
          ? "צעיף אדום-לבן איכותי, מחמם וסטייליסטי ליציע."
          : "צעיף ירוק-לבן איכותי, מחמם וסטייליסטי ליציע.",
      expiresAt: "15/01",
      points: 1200,
    },
    {
      image: assets.ticket,
      title: "הנחה של 25% על כרטיס משחק",
      description:
        currentClub === "hapoel-tel-aviv"
          ? "קוד קופון למשחק בית הקרוב של הפועל."
          : "קוד קופון למשחק בית הקרוב של מכבי.",
      expiresAt: "30/11",
      points: 1000,
    },
  ];

  const onTapVoteAd = () => {
    if (points < VOTE_COST) {
      Alert.alert("אין מספיק נקודות", `נדרשות ${VOTE_COST.toLocaleString()} נקודות כדי להשתתף בהצבעה.`);
      return;
    }
    Alert.alert(
      "להשתתף בהצבעה?",
      `ההשתתפות עולה ${VOTE_COST.toLocaleString()} נקודות.`,
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "המשך",
          style: "default",
          onPress: () => {
            setSelectedHomeVersion(null);
            setVoteVisible(true);
          },
        },
      ]
    );
  };

  const submitVote = () => {
    if (!selectedHomeVersion) {
      Alert.alert("בחר גרסה", "בחר אחת משלוש גרסאות מדי הבית כדי להצביע.");
      return;
    }
    // NOTE: if useSetPoints is "set absolute", this subtracts explicitly:
    redeem(points - VOTE_COST);
    setVoteVisible(false);
    setSelectedHomeVersion(null);
    Alert.alert("תודה!", "ההצבעה נרשמה בהצלחה. ⚽");
  };

  // Softer selection visuals
  const selectedBorder = `${theme.primary}66`; // 40% opacity
  const selectedBg = isLightBg ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity },
        ]}
      >
        <LinearGradient colors={theme.headerGradient} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.innerHeaderContainer}>
          <View>
            <Text style={[styles.greeting, { color: theme.onPrimary }]}>שלום אנטון</Text>
            <Text style={[styles.subtitle, { color: theme.onPrimary }]}>
              {currentClub === "hapoel-tel-aviv" ? "אוהד הפועל תל אביב" : "אוהד מכבי חיפה"}
            </Text>
          </View>
          <Image source={CLUB_LOGOS[currentClub]} style={styles.logo} resizeMode="contain" />
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroller}
        contentContainerStyle={{ paddingBottom: 120 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
          useNativeDriver: true,
        })}
      >
        <View style={{ height: HEADER_HEIGHT }} />

        {/* Points card */}
        <TouchableOpacity
          onPress={() => setLevelsVisible(true)}
          style={[
            styles.card,
            { backgroundColor: isLightBg ? "#fff" : "#1d1f22", shadowOpacity: isLightBg ? 0.15 : 0.25 },
          ]}
          activeOpacity={0.9}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>⭐ נקודות דיגיטליות</Text>
          <Text style={[styles.points, { color: theme.primary }]}>{points.toLocaleString()}</Text>
          <Text style={[styles.growth, { color: "#12B886" }]}>+250 השבוע</Text>

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

        {/* Vote banner (text-only + "חדש" tag) */}
        <TouchableOpacity onPress={onTapVoteAd} style={styles.voteSectionWrap} activeOpacity={0.95}>
          <LinearGradient
            colors={isLightBg ? ["#1E2B49", "#1f2937"] : ["#fef9c3", "#fde68a"]}
            style={styles.voteSection}
          >
            <View style={styles.newTag}>
              <Text style={styles.newTagText}>חדש</Text>
            </View>

            <View style={styles.voteTextOnly}>
              <Text style={[styles.voteTitle, { color: isLightBg ? "#e2e8f0" : "#111827" }]}>
                הצביעו למדי הבית הבאים
              </Text>
              <Text style={[styles.voteSubtitle, { color: isLightBg ? "#94a3b8" : "#1f2937" }]}>
                השתתפות בהצבעה ב-{VOTE_COST.toLocaleString()} נקודות
              </Text>
              <View style={styles.voteCtaRow}>
                <Text style={[styles.voteCTA, { color: isLightBg ? "#38bdf8" : "#b45309" }]}>הצבע עכשיו</Text>
                <MaterialIcons name="chevron-left" size={20} color={isLightBg ? "#38bdf8" : "#b45309"} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Offers */}
        <View style={styles.offers}>
          <Text style={[styles.offersTitle, { color: theme.text, borderRightColor: theme.primary }]}>
            הצעות מובחרות
          </Text>

          <Carousel
            loop
            autoPlay
            autoPlayInterval={3000}
            width={width * 0.95}
            height={180}
            style={{ alignSelf: "center" }}
            data={offers}
            scrollAnimationDuration={800}
            onProgressChange={(_, absoluteProgress) => (progressOffers.value = absoluteProgress)}
            renderItem={({ item }) => (
              <View style={{ width: width * 0.95, height: "100%" }}>
                <OfferCard {...item} onPress={() => openOffer(item)} />
              </View>
            )}
          />
        </View>

        {/* Friends table – full width, shorter height */}
        <View style={styles.featureRow}>
          <TouchableOpacity
            style={[
              styles.featureFull,
              { backgroundColor: isLightBg ? "#F9FAFB" : "#2A2A2D", borderColor: isLightBg ? "#E5E7EB" : "#3A3A3D" },
            ]}
            onPress={() => null}
            activeOpacity={0.9}
          >
            <MaterialIcons
              name="leaderboard"
              size={110}
              color={isLightBg ? "#C9CDD2" : "#3A3A3D"}
              style={styles.backgroundIconCompact}
            />
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: isLightBg ? "#111827" : "#F9FAFB" }]}>טבלת חברים</Text>
              <Text style={[styles.featureCTA, { color: isLightBg ? "#374151" : "#D1D5DB" }]}>לכניסה {">"}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Modals */}
      <InfoModal modalVisible={modalVisible} closeModal={closeModal} onDismiss={closeModal} selected={selected!} />
      <LevelsModal visible={levelsModalVisibility} onClose={() => setLevelsVisible(false)} onDismiss={() => {}} />

      {/* Vote modal – Home kit only (A/B/C) */}
      {voteVisible && (
        <View style={styles.overlay}>
          <View style={[styles.voteModal, { backgroundColor: isLightBg ? "#fff" : "#1F2226" }]}>
            <Text style={[styles.voteHeader, { color: isLightBg ? "#111827" : "#E5E7EB" }]}>בחרו את מדי הבית</Text>

            <View style={styles.kitsRow}>
              {[
                { key: "A" as const, img: assets.shirt2, label: "אפשרות 1" },
                { key: "B" as const, img: assets.shirt3, label: "אפשרות 2" },
                { key: "C" as const, img: assets.shirt4, label: "אפשרות 3 "},
              ].map((k) => {
                const selected = selectedHomeVersion === k.key;
                return (
                  <TouchableOpacity
                    key={k.key}
                    style={[
                      styles.kitCard,
                      {
                        borderColor: selected ? selectedBorder : (isLightBg ? "#E5E7EB" : "#33363B"),
                        backgroundColor: selected ? selectedBg : (isLightBg ? "#F9FAFB" : "#24262A"),
                      },
                    ]}
                    onPress={() => setSelectedHomeVersion(k.key)}
                    activeOpacity={0.9}
                  >
                    <Image source={k.img} style={styles.kitImage} resizeMode="cover" />
                    <Text style={[styles.kitLabel, { color: isLightBg ? "#111827" : "#E5E7EB" }]}>{k.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sheetRow}>
              <TouchableOpacity style={styles.sheetBtnGhost} onPress={() => { setVoteVisible(false); setSelectedHomeVersion(null); }}>
                <Text style={[styles.sheetBtnGhostText, { color: theme.primary }]}>סגור</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sheetBtn, { backgroundColor: theme.primary }]} onPress={submitVote}>
                <Text style={styles.sheetBtnText}>שלח הצבעה</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 40,
    zIndex: 1,
    overflow: "hidden",
  },
  scroller: { flex: 1, zIndex: 5 },
  innerHeaderContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greeting: { fontSize: 20, fontWeight: "700", textAlign: "left" },
  subtitle: { fontSize: 14, textAlign: "left", marginTop: 4 },
  logo: { width: 82, height: 82, marginLeft: 8 },

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
  cardTitle: { fontSize: 14 },
  points: { fontSize: 44, fontWeight: "bold", marginVertical: 8 },
  growth: { fontSize: 14 },

  progressRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  progressBarWrapper: { flex: 1, marginHorizontal: 8, alignItems: "center" },
  progressBar: { height: 10, borderRadius: 6, overflow: "hidden", width: "100%", marginBottom: 4 },
  progressFill: { height: "100%", borderRadius: 6 },
  progressText: { fontSize: 12, textAlign: "center" },
  tierIconWrap: { width: 24, height: 24, borderRadius: 14, alignItems: "center", justifyContent: "center" },

  // Vote banner
  voteSectionWrap: { marginHorizontal: 16, marginTop: SECTION_GAP, opacity: 0.95 },
  voteSection: {
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
  newTagText: { color: "#fff", fontWeight: "800", fontSize: 11 },
  voteTextOnly: {
    gap: 6,
  },
  voteTitle: { fontSize: 18, fontWeight: "800", textAlign: "left" },
  voteSubtitle: { fontSize: 13, opacity: 0.9, textAlign: "left" },
  voteCtaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  voteCTA: { fontSize: 14, fontWeight: "800" },

  offers: { paddingHorizontal: 16, paddingVertical: SECTION_GAP },
  offersTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, textAlign: "left", borderRightWidth: 4, paddingHorizontal: 12 },

  // Friends table row (single full-width card)
  featureRow: { paddingHorizontal: 16 },
  featureFull: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 90,              // ↓ shorter height
    justifyContent: "center",
    padding: 16,                // slightly smaller padding
    borderWidth: 1,
  },
  backgroundIconCompact: {
    position: "absolute",
    right: -18,
    bottom: -14,
    opacity: 0.14,
  },
  featureContent: { zIndex: 2 },
  featureTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4, textAlign: "left" },
  featureCTA: { fontSize: 14, fontWeight: "500", textAlign: "left" },

  // Modals (overlay + vote)
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center", zIndex: 50 },
  voteModal: { width: width * 0.92, borderRadius: 18, padding: 16 },
  voteHeader: { fontSize: 18, fontWeight: "800", marginBottom: 12, textAlign: "left" },
  kitsRow: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 12 },
  kitCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 10, alignItems: "center" },
  kitImage: { width: "100%", height: 80, borderRadius: 10, marginBottom: 8 },
  kitLabel: { fontSize: 13, fontWeight: "700" },

  // Buttons row
  sheetRow: { flexDirection: "row", gap: 10, justifyContent: "flex-end", marginTop: 6 },
  sheetBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  sheetBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  sheetBtnGhost: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: "transparent" },
  sheetBtnGhostText: { fontWeight: "700", fontSize: 14 },

  // (legacy)
  closeBtn: { backgroundColor: "#d50000", padding: 14, borderRadius: 10, alignItems: "center", margin: 20 },
  closeText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
