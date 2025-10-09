import { InfoModal } from "@/components/Offers/InfoModal";
import { OfferCard, type Offer } from "@/components/Offers/OfferCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
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
import { usePoints } from "@/hooks/usePoints"; // 👈 Zustand hook
import { getProgress } from "@/lib/tiers";

const HEADER_HEIGHT = 200;
const { width } = Dimensions.get("window");

const CLUB_LOGOS: Record<ClubKey, any> = {
  "hapoel-tel-aviv": require("../../assets/offers/hapoel-tel-aviv/logo.png"),
  "maccabi-haifa": require("../../assets/offers/maccabi-haifa/logo.png"),
};

const OFFER_ASSETS: Record<
  ClubKey,
  {
    shirt: any;
    scarf: any;
    ticket: any;
    sponsor1: any;
    sponsor2: any;
  }
> = {
  "hapoel-tel-aviv": {
    shirt: require("../../assets/offers/hapoel-tel-aviv/shirt.jpg"),
    scarf: require("../../assets/offers/hapoel-tel-aviv/scarf.jpg"),
    ticket: require("../../assets/offers/hapoel-tel-aviv/logo.png"),
    sponsor1: require("../../assets/offers/hapoel-tel-aviv/sponser1.jpg"),
    sponsor2: require("../../assets/offers/hapoel-tel-aviv/sponser2.webp"),
  },
  "maccabi-haifa": {
    shirt: require("../../assets/offers/maccabi-haifa/shirt.jpg"),
    scarf: require("../../assets/offers/maccabi-haifa/scarf.png"),
    ticket: require("../../assets/offers/maccabi-haifa/logo.png"),
    sponsor1: require("../../assets/offers/maccabi-haifa/sponser1.png"),
    sponsor2: require("../../assets/offers/maccabi-haifa/sponser2.png"),
  },
};

export default function HomePage() {
  const theme = useClubTheme();
  const currentClub: ClubKey = useClub();

  const y = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Offer | null>(null);
  const [levelsModalVisibility, setLevelsVisible] = useState(false);
  const progressOffers = useSharedValue(0);
  const [penaltyVisible, setPenaltyVisible] = useState(false); // 👈 new state

  // ✅ use global points from Zustand
  const points = usePoints();

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
              {currentClub === "hapoel-tel-aviv"
                ? "אוהד הפועל תל אביב"
                : "אוהד מכבי חיפה"}
            </Text>
          </View>
          <Image
            source={CLUB_LOGOS[currentClub]}
            style={styles.logo}
            resizeMode="contain"
          />
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

        {/* ✅ Points card with progress */}
        <TouchableOpacity
          onPress={() => setLevelsVisible(true)}
          style={[
            styles.card,
            {
              backgroundColor: isLightBg ? "#fff" : "#1d1f22",
              shadowOpacity: isLightBg ? 0.15 : 0.25,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            ⭐ נקודות דיגיטליות
          </Text>

          <Text style={[styles.points, { color: theme.primary }]}>
            {points.toLocaleString()}
          </Text>

          <Text style={[styles.growth, { color: "#12B886" }]}>+250 השבוע</Text>

          {/* Progress Row */}
          <View style={styles.progressRow}>
            {/* Current tier icon */}
            <LinearGradient
              colors={[current.colorFrom, current.colorTo]}
              style={styles.tierIconWrap}
            >
              <MaterialIcons name={current.icon as any} size={14} color="#212121" />
            </LinearGradient>

            {/* Progress bar */}
            <View style={styles.progressBarWrapper}>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: isLightBg ? "#eee" : "#2a2d31" },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress * 100}%`, backgroundColor: current.colorTo },
                  ]}
                />
              </View>
              {next ? (
                <Text style={[styles.progressText, { color: theme.text }]}>
                  עוד {toNext.toLocaleString()} נקודות לדרגת {next.name}
                </Text>
              ) : (
                <Text style={[styles.progressText, { color: theme.text }]}>
                  הגעת לדרגת {current.name} 🎉
                </Text>
              )}
            </View>

            {/* Next tier icon */}
            {next && (
              <LinearGradient
                colors={[next.colorFrom, next.colorTo]}
                style={styles.tierIconWrap}
              >
                <MaterialIcons name={next.icon as any} size={14} color="#212121" />
              </LinearGradient>
            )}
          </View>
        </TouchableOpacity>

        {/* Offers carousel */}
        <View style={styles.offers}>
          <Text
            style={[
              styles.offersTitle,
              { color: theme.text, borderRightColor: theme.primary },
            ]}
          >
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
            onProgressChange={(_, absoluteProgress) => {
              progressOffers.value = absoluteProgress;
            }}
            renderItem={({ item }) => (
              <View style={{ width: width * 0.95, height: "100%" }}>
                <OfferCard {...item} onPress={() => openOffer(item)} />
              </View>
            )}
          />
        </View>

        {/* ✅ Bottom feature boxes */}
        <View style={styles.featureRow}>
          {/* Leaderboard */}
          <TouchableOpacity
            style={[
              styles.featureBox,
              {
                backgroundColor: isLightBg ? "#F9FAFB" : "#2A2A2D",
                borderColor: isLightBg ? "#E5E7EB" : "#3A3A3D",
              },
            ]}
            onPress={() => null}
            activeOpacity={0.9}
          >
            <MaterialIcons
              name="leaderboard"
              size={140}
              color={isLightBg ? "#C9CDD2" : "#3A3A3D"}
              style={styles.backgroundIcon}
            />
            <View style={styles.featureContent}>
              <Text
                style={[
                  styles.featureTitle,
                  { color: isLightBg ? "#111827" : "#F9FAFB" },
                ]}
              >
                טבלת חברים
              </Text>
              <Text
                style={[
                  styles.featureCTA,
                  { color: isLightBg ? "#374151" : "#D1D5DB" },
                ]}
              >
                לכניסה {">"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Penalties */}
          <TouchableOpacity
            style={[
              styles.featureBox,
              {
                backgroundColor: isLightBg ? "#F9FAFB" : "#2A2A2D",
                borderColor: isLightBg ? "#E5E7EB" : "#3A3A3D",
              },
            ]}
            onPress={() => setPenaltyVisible(true)} 
            activeOpacity={0.9}
          >
            <MaterialIcons
              name="sports-soccer"
              size={140}
              color={isLightBg ? "#C9CDD2" : "#3A3A3D"}
              style={styles.backgroundIcon}
            />
            <View style={styles.featureContent}>
              <Text
                style={[
                  styles.featureTitle,
                  { color: isLightBg ? "#111827" : "#F9FAFB" },
                ]}
              >
                פנדלים
              </Text>
              <Text
                style={[
                  styles.featureCTA,
                  { color: isLightBg ? "#374151" : "#D1D5DB" },
                ]}
              >
                שחק {">"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Modals */}
      <InfoModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        onDismiss={closeModal}
        selected={selected!}
      />
      <LevelsModal
        visible={levelsModalVisibility}
        onClose={() => setLevelsVisible(false)}
        onDismiss={() => {}}
      />
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

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  progressBarWrapper: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
  },
  progressBar: {
    height: 10,
    borderRadius: 6,
    overflow: "hidden",
    width: "100%",
    marginBottom: 4,
  },
  progressFill: { height: "100%", borderRadius: 6 },
  progressText: { fontSize: 12, textAlign: "center" },

  tierIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  offers: { paddingHorizontal: 16, paddingVertical: 20 },
  offersTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "left",
    borderRightWidth: 4,
    paddingHorizontal: 12,
  },

  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 6,
    gap: 12,
  },
  featureBox: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    minHeight: 120,
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
  },
  backgroundIcon: {
    position: "absolute",
    right: -20,
    bottom: -10,
    opacity: 0.15,
  },
  featureContent: {
    zIndex: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "left",
  },
  featureCTA: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
  },
  closeBtn: {
    backgroundColor: "#d50000",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },
  closeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
