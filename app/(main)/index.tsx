import { InfoModal } from "@/components/Offers/InfoModal";
import { OfferCard, type Offer } from "@/components/Offers/OfferCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { LevelsModal } from "@/components/Levels/LevelsModal";
import { type ClubKey } from "@/constants/Colors";
import { useClub, useClubTheme } from "@/hooks/useClubTheme";

import { CLUB_LOGOS, OFFER_ASSETS } from "@/constants/OFFER_ASSETS";
import { usePoints, useSetPoints } from "@/hooks/usePoints";
import { getProgress } from "@/lib/tiers";

const HEADER_HEIGHT = 200;
const { width, height } = Dimensions.get("window");
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

  // friends modal state
  const [friendsVisible, setFriendsVisible] = useState(false);

  // NEW — tickets modal state
  const [ticketsVisible, setTicketsVisible] = useState(false);

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
      image: assets.stadium,
      title: "שינוי מושב למשחק הבית הקרוב",
      description:
        currentClub === "hapoel-tel-aviv"
          ? "החלפת מושב לאזור זהה/דומה בכפוף לזמינות. תקף עד 48 שעות לפני שריקת הפתיחה באצטדיון הבית של הפועל תל אביב."
          : "החלפת מושב לאזור זהה/דומה בכפוף לזמינות. תקף עד 48 שעות לפני שריקת הפתיחה בסמי עופר – משחקי הבית של מכבי חיפה.",
      expiresAt: "30/11",
      points: 600,
    },
    {
      image: assets.ticket,
      title: "הנחה של 25% על כרטיס משחק",
      description:
        currentClub === "hapoel-tel-aviv"
          ? "קוד קופון למשחק בית נבחר של הפועל תל אביב. ההנחה חלה על קטגוריות ישיבה מסומנות ובכפוף לזמינות."
          : "קוד קופון למשחק בית נבחר של מכבי חיפה. ההנחה חלה על קטגוריות ישיבה מסומנות ובכפוף לזמינות.",
      expiresAt: "30/11",
      points: 1000,
    },
    {
      image: CLUB_LOGOS[currentClub],
      title: "שובר 20% לחנות המועדון",
      description:
        currentClub === "hapoel-tel-aviv"
          ? "שובר חד-פעמי לחנות הרשמית של הפועל תל אביב (און-ליין/סניף), למוצרים שאינם במבצע. לא כולל הדפסות ושירותים."
          : "שובר חד-פעמי לחנות הרשמית של מכבי חיפה (און-ליין/סניף), למוצרים שאינם במבצע. לא כולל הדפסות ושירותים.",
      expiresAt: "31/12",
      points: 900,
    },
    {
      image: assets.stadium,
      title: "סיור אצטדיון ומפגש צילום",
      description:
        currentClub === "hapoel-tel-aviv"
          ? "סיור מודרך באצטדיון הבית של הפועל תל אביב, כולל צילום למזכרת באזור ה-VIP. בכפוף לזמינות תאריכים."
          : "סיור מודרך באצטדיון סמי עופר, כולל צילום למזכרת באזור ה-VIP. בכפוף לזמינות תאריכים.",
      expiresAt: "15/01",
      points: 3200,
    },
  ];

  const onTapVoteAd = () => {
    if (points < VOTE_COST) {
      Alert.alert("אין מספיק נקודות", `נדרשות ${VOTE_COST.toLocaleString()} נקודות כדי להשתתף בהצבעה.`);
      return;
    }
    Alert.alert("להשתתף בהצבעה?", `ההשתתפות עולה ${VOTE_COST.toLocaleString()} נקודות.`, [
      { text: "ביטול", style: "cancel" },
      {
        text: "המשך",
        style: "default",
        onPress: () => {
          setSelectedHomeVersion(null);
          setVoteVisible(true);
        },
      },
    ]);
  };

  const submitVote = () => {
    if (!selectedHomeVersion) {
      Alert.alert("בחר גרסה", "בחר אחת משלוש גרסאות מדי הבית כדי להצביע.");
      return;
    }
    redeem(points - VOTE_COST);
    setVoteVisible(false);
    setSelectedHomeVersion(null);
    Alert.alert("תודה!", "ההצבעה נרשמה בהצלחה. ⚽");
  };

  // selection visuals
  const selectedBorder = `${theme.primary}66`;
  const selectedBg = isLightBg ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)";

  // friends data (with current user from Zustand)
  const friends = useMemo(() => {
    const base = [
      { name: "איתי כהן", points: 7420 },
      { name: "טל פרידמן", points: 6890 },
      { name: "ליאור אזולאי", points: 6775 },
      { name: "מאיה לוי", points: 6580 },
      { name: "נעמה ברק", points: 6310 },
      { name: "אורי נבון", points: 6120 },
      { name: "שחר מזרחי", points: 5980 },
      { name: "דנה שדה", points: 5815 },
      { name: "עומר חיון", points: 5590 },
      { name: "יובל רם", points: 5405 },
    ];
    const withMe = [...base, { name: "עידו ניצני", points }];
    return withMe.sort((a, b) => b.points - a.points).map((f, i) => ({ ...f, rank: i + 1 }));
  }, [points]);

  // top-3 accent (thin side bar only, no fills)
  const rankAccent = (rank: number) => {
    if (rank === 1) return isLightBg ? "#F59E0B" : "#F59E0B";
    if (rank === 2) return isLightBg ? "#94A3B8" : "#94A3B8";
    if (rank === 3) return isLightBg ? "#EAB308" : "#EAB308";
    return isLightBg ? "#E5E7EB" : "#2F3136";
  };

  // QR payload (placeholder)
  const qrPayload = `OLLE|${currentClub}|HOME|Hapoel vs Maccabi TA|001`;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Animated.View
        pointerEvents="none"
        style={[styles.header, { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity }]}
      >
        <LinearGradient colors={theme.headerGradient} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.innerHeaderContainer}>
          <View>
            <Text style={[styles.greeting, { color: theme.onPrimary }]}>שלום עידו ניצני</Text>
            <Text style={[styles.subtitle, { color: theme.onPrimary }]}>
              {currentClub === "hapoel-tel-aviv" ? "אוהד הפועל תל אביב" : "אוהד מכבי חיפה"}
            </Text>
          </View>
          <Image source={CLUB_LOGOS[currentClub]} style={styles.logo} resizeMode="contain" />
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroller}
        contentContainerStyle={{ paddingBottom: 140 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: true })}
      >
        <View style={{ height: HEADER_HEIGHT }} />

        {/* Points card */}
        <TouchableOpacity
          onPress={() => setLevelsVisible(true)}
          style={[styles.card, { backgroundColor: isLightBg ? "#fff" : "#1d1f22", shadowOpacity: isLightBg ? 0.15 : 0.25 }]}
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

        {/* Vote banner (text-only) */}
        <TouchableOpacity onPress={onTapVoteAd} style={styles.voteSectionWrap} activeOpacity={0.95}>
          <LinearGradient colors={isLightBg ? ["#1E2B49", "#1f2937"] : ["#fef9c3", "#fde68a"]} style={styles.voteSection}>
            <View style={styles.newTag}>
              <Text style={styles.newTagText}>חדש</Text>
            </View>

            <View style={styles.voteTextOnly}>
              <Text style={[styles.voteTitle, { color: isLightBg ? "#e2e8f0" : "#111827" }]}>הצביעו למדי הבית הבאים</Text>
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
          <Text style={[styles.offersTitle, { color: theme.text, borderRightColor: theme.primary }]}>הצעות מובחרות</Text>

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

        {/* ===== NEW: Tickets button (same look as friends), placed ABOVE friends ===== */}
        <View style={[styles.featureRow]}>
        <Text style={[styles.offersTitle, { color: theme.text, borderRightColor: theme.primary,marginBottom:18 }]}>מידע נוסף</Text>

          <TouchableOpacity
            style={[
              styles.featureFull,
              { backgroundColor: isLightBg ? "#F9FAFB" : "#2A2A2D", borderColor: isLightBg ? "#E5E7EB" : "#3A3A3D" },
            ]}
            onPress={() => setTicketsVisible(true)}
            activeOpacity={0.9}
          >
            <MaterialIcons
              name="confirmation-number"
              size={110}
              color={isLightBg ? "#C9CDD2" : "#3A3A3D"}
              style={styles.backgroundIconCompact}
            />
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: isLightBg ? "#111827" : "#F9FAFB" }]}>הכרטיסים שלי</Text>
              <Text style={[styles.featureCTA, { color: isLightBg ? "#374151" : "#D1D5DB" }]}>לצפייה {">"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Friends feature tile (unchanged) */}
        <View style={[styles.featureRow, { marginTop: SECTION_GAP }]}>
          <TouchableOpacity
            style={[
              styles.featureFull,
              { backgroundColor: isLightBg ? "#F9FAFB" : "#2A2A2D", borderColor: isLightBg ? "#E5E7EB" : "#3A3A3D" },
            ]}
            onPress={() => setFriendsVisible(true)}
            activeOpacity={0.9}
          >
            <MaterialIcons name="leaderboard" size={110} color={isLightBg ? "#C9CDD2" : "#3A3A3D"} style={styles.backgroundIconCompact} />
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
                { key: "C" as const, img: assets.shirt4, label: "אפשרות 3 " },
              ].map((k) => {
                const selected = selectedHomeVersion === k.key;
                return (
                  <TouchableOpacity
                    key={k.key}
                    style={[
                      styles.kitCard,
                      {
                        borderColor: selected ? selectedBorder : isLightBg ? "#E5E7EB" : "#33363B",
                        backgroundColor: selected ? selectedBg : isLightBg ? "#F9FAFB" : "#24262A",
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

      {/* Friends Table Modal — compact rows, horizontal layout, top-3 accent, clear points */}
      <Modal
        visible={friendsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFriendsVisible(false)}
      >
        <View style={styles.popupOverlay}>
          <View
            style={[
              styles.friendsPopup,
              { backgroundColor: isLightBg ? "#ffffff" : "#1F2226", borderColor: isLightBg ? "#E5E7EB" : "#2A2D31" },
            ]}
          >
            {/* Top row */}
            <View style={styles.popupTopRow}>
              <Text style={[styles.popupTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>טבלת חברים</Text>
              <TouchableOpacity
                onPress={() => setFriendsVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: isLightBg ? "#EEF2F6" : "#23262B" }]}
                activeOpacity={0.8}
              >
                <MaterialIcons name="close" size={18} color={isLightBg ? "#111827" : "#E5E7EB"} />
              </TouchableOpacity>
            </View>

            {/* List */}
            <ScrollView
              style={styles.popupScroll}
              contentContainerStyle={styles.popupScrollContent}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {friends.map((f) => {
                const isMe = f.name === "עידו ניצני";
                const accent = rankAccent(f.rank);
                return (
                  <View
                    key={f.name}
                    style={[
                      styles.friendRow,
                      {
                        backgroundColor: isMe
                          ? (isLightBg ? "rgba(56,189,248,0.08)" : "rgba(56,189,248,0.12)")
                          : (isLightBg ? "#FFFFFF" : "#22262B"),
                        borderColor: isLightBg ? "#EDF2F7" : "#2E3237",
                      },
                    ]}
                  >
                    {/* thin accent bar for top-3 */}
                    <View style={[styles.rankAccentBar, { backgroundColor: accent }]} />

                    {/* rank */}
                    <Text style={[styles.rankText, { color: isLightBg ? "#6B7280" : "#9CA3AF" }]}>#{f.rank}</Text>

                    {/* avatar + name */}
                    <View style={styles.rowCenter}>
                      <Text
                        style={[styles.friendNameRow, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}
                        numberOfLines={1}
                      >
                        {f.name}
                      </Text>
                    </View>

                    {/* points (no circle, clear emphasis) */}
                    <Text style={[styles.pointsStrong, { color: isLightBg ? "#0C4A6E" : "#7DD3FC" }]}>
                      {f.points.toLocaleString()} נק׳
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            {/* Footer actions */}
            <View style={styles.sheetRow}>
              <TouchableOpacity style={styles.sheetBtnGhost} onPress={() => setFriendsVisible(false)}>
                <Text style={[styles.sheetBtnGhostText, { color: theme.primary }]}>סגור</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sheetBtn, { backgroundColor: theme.primary }]}>
                <Text style={styles.sheetBtnText}>הזמן חברים</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* NEW — Tickets Modal */}
      <Modal
        visible={ticketsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTicketsVisible(false)}
      >
        <View style={styles.popupOverlay}>
          <View
            style={[
              styles.ticketsPopup,
              { backgroundColor: isLightBg ? "#ffffff" : "#1F2226", borderColor: isLightBg ? "#E5E7EB" : "#2A2D31" },
            ]}
          >
            {/* Top row */}
            <View style={styles.popupTopRow}>
              <Text style={[styles.popupTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>הכרטיסים שלי</Text>
              <TouchableOpacity
                onPress={() => setTicketsVisible(false)}
                style={[styles.modalCloseBtn, { backgroundColor: isLightBg ? "#EEF2F6" : "#23262B" }]}
                activeOpacity={0.8}
              >
                <MaterialIcons name="close" size={18} color={isLightBg ? "#111827" : "#E5E7EB"} />
              </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.ticketHeader}>
              <Text style={[styles.ticketTitle, { color: theme.text }]}>משחק בית נגד מכבי תל אביב</Text>
            </View>

            {/* QR center */}
            <View style={styles.qrWrap}>
              <View style={[styles.qrCard, { backgroundColor: isLightBg ? "#F8FAFC" : "#15181C", borderColor: isLightBg ? "#E5E7EB" : "#2A2D31" }]}>
                <QRCode value={qrPayload} size={180} backgroundColor="transparent" />
              </View>
              <Text style={[styles.qrHint, { color: isLightBg ? "#64748B" : "#94A3B8" }]}>הציגו את ה-QR בשער הכניסה</Text>
            </View>

            {/* Footer actions */}
            <View style={styles.sheetRow}>
              <TouchableOpacity style={styles.sheetBtnGhost} onPress={() => setTicketsVisible(false)}>
                <Text style={[styles.sheetBtnGhostText, { color: theme.primary }]}>סגור</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sheetBtn, { backgroundColor: theme.primary }]} onPress={() => { /* no-op for now */ }}>
                <Text style={styles.sheetBtnText}>מכירה</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  innerHeaderContainer: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
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
  cardTitle: { fontSize: 14, textAlign: "left" },
  points: { fontSize: 44, fontWeight: "bold", marginVertical: 8, textAlign: "left" },
  growth: { fontSize: 14, textAlign: "left" },

  progressRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  progressBarWrapper: { flex: 1, marginHorizontal: 8, alignItems: "center" },
  progressBar: { height: 10, borderRadius: 6, overflow: "hidden", width: "100%", marginBottom: 4 },
  progressFill: { height: "100%", borderRadius: 6 },
  progressText: { fontSize: 12, textAlign: "left" },
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
  newTag: { position: "absolute", top: 10, right: 10, backgroundColor: "#ef4444", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, zIndex: 2 },
  newTagText: { color: "#fff", fontWeight: "800", fontSize: 11, textAlign: "left" },
  voteTextOnly: { gap: 6 },
  voteTitle: { fontSize: 18, fontWeight: "800", textAlign: "left" },
  voteSubtitle: { fontSize: 13, opacity: 0.9, textAlign: "left" },
  voteCtaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  voteCTA: { fontSize: 14, fontWeight: "800", textAlign: "left" },

  offers: { paddingHorizontal: 16, paddingVertical: SECTION_GAP },
  offersTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, textAlign: "left", borderRightWidth: 4, paddingHorizontal: 12 },

  // Friends feature tile + Tickets feature tile share these styles
  featureRow: { paddingHorizontal: 16 },
  featureFull: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 90,
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
  },
  backgroundIconCompact: { position: "absolute", right: -18, bottom: -14, opacity: 0.14 },
  featureContent: { zIndex: 2 },
  featureTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4, textAlign: "left" },
  featureCTA: { fontSize: 14, fontWeight: "500", textAlign: "left" },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    paddingHorizontal: 10,
  },

  // Vote modal
  voteModal: { width: width * 0.92, borderRadius: 18, padding: 16 },
  voteHeader: { fontSize: 18, fontWeight: "800", marginBottom: 12, textAlign: "left" },
  kitsRow: { flexDirection: "row", justifyContent: "space-between", gap: 10, marginBottom: 12 },
  kitCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 10, alignItems: "center" },
  kitImage: { width: "100%", height: 80, borderRadius: 10, marginBottom: 8 },
  kitLabel: { fontSize: 13, fontWeight: "700", textAlign: "left" },

  /* =========================
     Friends CENTERED POPUP
     ========================= */
  popupOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  friendsPopup: {
    width: width * 0.92,
    minHeight: Math.min(420, height * 0.6),
    maxHeight: Math.min(640, height * 0.85),
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  popupTopRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  popupTitle: { fontSize: 16, fontWeight: "800", textAlign: "left", flex: 1 },

  popupScroll: { width: "100%", maxHeight: Math.min(480, height * 0.6) },
  popupScrollContent: { paddingHorizontal: 8, paddingVertical: 8, gap: 6 },

  // NEW — compact horizontal friend row
  friendRow: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,           // compact height
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  rankAccentBar: {
    position: "absolute",
    left: 0,                       // will mirror in RTL automatically
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
  },
  rankText: { width: 36, fontSize: 12, fontWeight: "700", textAlign: "left", opacity: 0.9 },

  rowCenter: { flexDirection: "row", alignItems: "center", flex: 1, gap: 8 },
  avatarTiny: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 1,
    alignItems: "center", justifyContent: "center",
  },
  avatarTinyText: { fontSize: 10, fontWeight: "800", textAlign: "left" },
  friendNameRow: { fontSize: 14, fontWeight: "800", textAlign: "left", flexShrink: 1 },

  pointsStrong: { fontSize: 14, fontWeight: "900", textAlign: "left" },

  // Buttons row (shared)
  sheetRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  sheetBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  sheetBtnText: { color: "#fff", fontWeight: "700", fontSize: 14, textAlign: "left" },
  sheetBtnGhost: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, backgroundColor: "transparent" },
  sheetBtnGhostText: { fontWeight: "700", fontSize: 14, textAlign: "left" },

  // (legacy)
  modalCloseBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  /* =========================
     Bottom "הכרטיסים שלי"
     ========================= */
  bottomBoxWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    paddingHorizontal: 16,
  },
  bottomBoxCard: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  bottomGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.26, // tinted surface
  },
  bottomBoxContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bottomIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#0B1020",
    textAlign: "left",
  },

  /* =========================
     Tickets Modal
     ========================= */
  ticketsPopup: {
    width: width * 0.92,
    minHeight: Math.min(360, height * 0.55),
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  ticketHeader: { paddingHorizontal: 16, paddingTop: 12 },
  ticketTitle: { fontSize: 16, fontWeight: "800", textAlign: "left" },
  qrWrap: { alignItems: "center", paddingHorizontal: 16, paddingVertical: 18, gap: 10 },
  qrCard: {
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
  },
  qrHint: { fontSize: 12, textAlign: "left" },
});
