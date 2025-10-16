import { useMemo, useRef, useState } from "react";
import { Alert, Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { LevelsModal } from "@/components/Levels/LevelsModal";
import { InfoModal } from "@/components/Offers/InfoModal";
import { type Offer } from "@/components/Offers/OfferCard";
import { type ClubKey } from "@/constants/Colors";
import { CLUB_LOGOS, OFFER_ASSETS } from "@/constants/OFFER_ASSETS";
import { useClub, useClubTheme } from "@/hooks/useClubTheme";
import { usePoints, useSetPoints } from "@/hooks/usePoints";
import { getProgress } from "@/lib/tiers";

import { FeatureTile } from "./components/FeatureTile";
import { FriendsModal, type FriendRow } from "./components/FriendsModal";
import { HomeHeader } from "./components/HomeHeader";
import { OffersCarouselSection } from "./components/OffersCarouselSection";
import { PointsCard } from "./components/PointsCard";
import { TicketsModal, type TicketItem } from "./components/TicketsModal";
import { VoteBanner } from "./components/VoteBanner";
import { VoteModal } from "./components/VoteModal";

const HEADER_HEIGHT = 200;
const { width } = Dimensions.get("window");
const VOTE_COST = 1250;
const SECTION_GAP = 20;
const CURRENT_USER_NAME = "עידו ניצני";

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
  const friends = useMemo<FriendRow[]>(() => {
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
    const withMe = [...base, { name: CURRENT_USER_NAME, points }];
    return withMe.sort((a, b) => b.points - a.points).map((f, i) => ({ ...f, rank: i + 1 }));
  }, [points]);

  // top-3 accent (thin side bar only, no fills)
  const rankAccent = (rank: number) => {
    if (rank === 1) return isLightBg ? "#F59E0B" : "#F59E0B";
    if (rank === 2) return isLightBg ? "#94A3B8" : "#94A3B8";
    if (rank === 3) return isLightBg ? "#EAB308" : "#EAB308";
    return isLightBg ? "#E5E7EB" : "#2F3136";
  };

  const tickets = useMemo<TicketItem[]>(() => {
    if (currentClub === "hapoel-tel-aviv") {
      return [
        {
          id: "match-1",
          title: "משחק בית נגד מכבי תל אביב",
          subtitle: "15.12 · 20:30 · אצטדיון בלומפילד",
          details: ["שער 5 · בלוק 133", "שורה 12 · מושב 7", "כניסה פתוחה משעה 19:30"],
          qrPayload: "OLLE|HAPOEL|HOME|MTA|001",
        },
        {
          id: "match-2",
          title: "משחק בית נגד בית\"ר ירושלים",
          subtitle: "03.01 · 21:00 · אצטדיון בלומפילד",
          details: ["שער 7 · בלוק 118", "שורה 9 · מושב 14", "כניסה פתוחה משעה 19:45"],
          qrPayload: "OLLE|HAPOEL|HOME|BEITAR|002",
        },
        {
          id: "match-3",
          title: "משחק גביע מול מכבי נתניה",
          subtitle: "18.01 · 19:45 · אצטדיון בלומפילד",
          details: ["שער 2 · בלוק 204", "שורה 4 · מושב 3", "כניסה פתוחה משעה 18:15"],
          qrPayload: "OLLE|HAPOEL|CUP|NETANYA|003",
        },
      ];
    }

    return [
      {
        id: "match-1",
        title: "משחק בית נגד הפועל תל אביב",
        subtitle: "15.12 · 20:30 · אצטדיון סמי עופר",
        details: ["שער 11 · בלוק 232", "שורה 16 · מושב 9", "כניסה פתוחה משעה 19:15"],
        qrPayload: "OLLE|MACCABI|HOME|HAPOEL|001",
      },
      {
        id: "match-2",
        title: "משחק בית נגד בני סכנין",
        subtitle: "03.01 · 21:00 · אצטדיון סמי עופר",
        details: ["שער 8 · בלוק 107", "שורה 6 · מושב 5", "כניסה פתוחה משעה 19:40"],
        qrPayload: "OLLE|MACCABI|HOME|SAKHNIN|002",
      },
      {
        id: "match-3",
        title: "משחק גביע מול הפועל באר שבע",
        subtitle: "18.01 · 19:45 · אצטדיון סמי עופר",
        details: ["שער 4 · בלוק 316", "שורה 10 · מושב 12", "כניסה פתוחה משעה 18:10"],
        qrPayload: "OLLE|MACCABI|CUP|BEERSHEVA|003",
      },
    ];
  }, [currentClub]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <HomeHeader
        theme={theme}
        currentClub={currentClub}
        translateY={headerTranslateY}
        opacity={headerOpacity}
        height={HEADER_HEIGHT}
        userName={CURRENT_USER_NAME}
      />
      <Animated.ScrollView
        style={styles.scroller}
        contentContainerStyle={{ paddingBottom: 140 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: true })}
      >
        <View style={styles.spacer} />

        <PointsCard
          isLightBg={isLightBg}
          onPress={() => setLevelsVisible(true)}
          points={points}
          current={current}
          next={next}
          progress={progress}
          toNext={toNext}
          theme={theme}
        />

        <VoteBanner isLightBg={isLightBg} cost={VOTE_COST} onPress={onTapVoteAd} />

        <OffersCarouselSection
          offers={offers}
          width={width}
          progressOffers={progressOffers}
          onPressOffer={openOffer}
          theme={theme}
        />

        <View style={styles.infoSection}>
          <Text style={[styles.sectionHeading, { color: theme.text, borderRightColor: theme.primary, marginBottom: 18 }]}>
            מידע נוסף
          </Text>
          <FeatureTile
            title="הכרטיסים שלי"
            cta='לצפייה >'
            icon="confirmation-number"
            isLightBg={isLightBg}
            onPress={() => setTicketsVisible(true)}
          />
        </View>

        <View style={[styles.featureRow]}>
          <FeatureTile
            title="טבלת חברים"
            cta='לכניסה >'
            icon="leaderboard"
            isLightBg={isLightBg}
            onPress={() => setFriendsVisible(true)}
          />
        </View>
      </Animated.ScrollView>

      {/* Modals */}
      <InfoModal modalVisible={modalVisible} closeModal={closeModal} onDismiss={closeModal} selected={selected!} />
      <LevelsModal visible={levelsModalVisibility} onClose={() => setLevelsVisible(false)} onDismiss={() => {}} />

      <VoteModal
        visible={voteVisible}
        isLightBg={isLightBg}
        selectedHomeVersion={selectedHomeVersion}
        onSelect={setSelectedHomeVersion}
        onSubmit={submitVote}
        onClose={() => {
          setVoteVisible(false);
          setSelectedHomeVersion(null);
        }}
        assets={{ shirt2: assets.shirt2, shirt3: assets.shirt3, shirt4: assets.shirt4 }}
        selectedBorder={selectedBorder}
        selectedBg={selectedBg}
        themePrimary={theme.primary}
      />

      <FriendsModal
        visible={friendsVisible}
        onClose={() => setFriendsVisible(false)}
        friends={friends}
        rankAccent={rankAccent}
        isLightBg={isLightBg}
        theme={theme}
        currentUserName={CURRENT_USER_NAME}
      />

      <TicketsModal
        visible={ticketsVisible}
        onClose={() => setTicketsVisible(false)}
        isLightBg={isLightBg}
        theme={theme}
        tickets={tickets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroller: { flex: 1, zIndex: 5 },
  featureRow: { paddingHorizontal: 16 },
  spacer: { height: HEADER_HEIGHT },
  infoSection: { paddingHorizontal: 16, paddingBottom: SECTION_GAP },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    borderRightWidth: 4,
    paddingHorizontal: 12,
  },
});
