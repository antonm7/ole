import { InfoModal } from "@/components/Offers/InfoModal";
import { OfferCard, type Offer } from "@/components/Offers/OfferCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedReanimated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { LevelsModal } from "@/components/Levels/LevelsModal";
import { type ClubKey } from "@/constants/Colors";
import { useClub, useClubTheme } from "@/hooks/useClubTheme";
import { getProgress } from "@/lib/tiers"; // 👈 shared logic

const HEADER_HEIGHT = 200;
const { width } = Dimensions.get("window");

/** ✅ Static require maps */
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
  const [points, setPoints] = useState(3500);
  const [levelsModalVisibility, setLevelsVisible] = useState(false);
  const progressOffers = useSharedValue(0);

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

  // 🔥 Offers array for carousel
  const offers = [
    {
      image: 'https://static.vecteezy.com/system/resources/thumbnails/038/516/357/small_2x/ai-generated-eagle-logo-design-in-black-style-on-transparant-background-png.png',
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
    {
      image: assets.sponsor1,
      title: "ייעוץ לפני קניית רכב",
      description:
        currentClub === "hapoel-tel-aviv"
          ? "זמן טוב לקנות רכב! קבל פגישת ייעוץ אצל שלמה סיקסט"
          : "הנחה של 10% בחנות של אדידס",
      expiresAt: "30/11",
      points: 3750,
    },
    {
      image: assets.sponsor2,
      title: "200 שקל להשקעה ב IBI",
      description:
        currentClub === "hapoel-tel-aviv"
          ? "200 שקל שתוכל להשקיע ולהפקיד בבית ההשקעות IBI."
          : "הנחה של 18% לסרט ביס פלאנט",
      expiresAt: "30/11",
      points: 900,
    },
    {
      image: "data:image/jpeg;base64,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",
      title: "מלון פרימה מיוזיק אילת – 2 לילות בסופ״ש",
      description: "דיל מיוחד דרך אתר ההטבות של MAX. לינה זוגית בסופ״ש בלייקהאוס כנרת.",
      expiresAt: "22/11/2025",
      points: 2400,
    },
    {
      image: "data:image/jpeg;base64,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",  
      title: "מלון גרנד ביץ' תל-אביב – 2 לילות בסופ״ש",
      description: "מבצע לינה בסופ״ש במרכז ת״א, דרך אתר ההטבות של MAX.",
      expiresAt: "29/11/2025",
      points: 2200,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Hideable header */}
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
        contentContainerStyle={{ paddingBottom: 100 }}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        contentOffset={{ x: 0, y: Platform.OS === "ios" ? 0.5 : 0 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
          useNativeDriver: true,
        })}
        decelerationRate={Platform.OS === "ios" ? "normal" : 0.98}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="always"
      >
        <View style={{ height: HEADER_HEIGHT }} />

        {/* ✅ Points card */}
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

          <View style={styles.progressRow}>
            <LinearGradient
              colors={[current.colorFrom, current.colorTo]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tierIconWrap}
            >
              <MaterialIcons name={current.icon as any} size={14} color="#212121" />
            </LinearGradient>

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
                    {
                      width: `${Math.round(progress * 100)}%`,
                      backgroundColor: current.colorTo,
                    },
                  ]}
                />
              </View>
              {next ? (
                <Text
                  style={[
                    styles.progressText,
                    { color: isLightBg ? "#666" : "#B7BCC1" },
                  ]}
                >
                  עוד {toNext.toLocaleString()} נקודות לדרגת {next.name}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.progressText,
                    { color: isLightBg ? "#666" : "#B7BCC1" },
                  ]}
                >
                  הגעת לדרגת {current.name} 🎉
                </Text>
              )}
            </View>

            {next && (
              <LinearGradient
                colors={[next.colorFrom, next.colorTo]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tierIconWrap}
              >
                <MaterialIcons
                  name={next.icon as any}
                  size={14}
                  color="#212121"
                />
              </LinearGradient>
            )}
          </View>
        </TouchableOpacity>

        {/* ✅ Offers carousel */}
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
            height={205}
            style={{ alignSelf: "center" }}
            data={offers}
            scrollAnimationDuration={800}
            onProgressChange={(_, absoluteProgress) => {
              progressOffers.value = absoluteProgress;
            }}
            renderItem={({ item }) => (
              <View
                style={{
                  width: width * 0.95,     
                  height: "100%",
                  alignItems: "center",    
                  justifyContent: "center" 
                }}
              >
                <View style={{ width: width * 0.9,height:'100%' }}> 
                  <OfferCard {...item} onPress={() => openOffer(item)} />
                </View>
              </View>
            )}
          />
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {offers.map((_, index) => {
              const animatedDotStyle = useAnimatedStyle(() => {
                const activeIndex = Math.round(progressOffers.value);
                return {
                  opacity: activeIndex === index ? 1 : 0.3,
                  transform: [{ scale: activeIndex === index ? 1.2 : 1 }],
                };
              });

              return (
                <AnimatedReanimated.View
                  key={index}
                  style={[
                    {
                      width: 6,
                      height: 6,
                      borderRadius: 4,
                      marginHorizontal: 4,
                      backgroundColor: "gray",
                    },
                    animatedDotStyle,
                  ]}
                />
              );
            })}
          </View>
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
        userPoints={points}
        onIncrement={() => setPoints((p) => p + 500)}
        onDecrement={() => setPoints((p) => p - 500)}
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
    paddingTop: 0,
  },
  greeting: { fontSize: 20, fontWeight: "700", textAlign: "left" },
  subtitle: { fontSize: 14, textAlign: "left", marginTop: 4 },
  logo: { width: 82, height: 82, marginLeft: 8 },
  card: {
    zIndex: 10,
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

  offers: { paddingHorizontal: 16, paddingVertical: 20 },
  offersTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "left",
    borderRightWidth: 4,
    paddingHorizontal: 12,
  },

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
});
