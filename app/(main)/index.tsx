// MainPage.tsx
import { InfoModal } from "@/components/Offers/InfoModal";
import { OfferCard, type Offer } from "@/components/Offers/OfferCard";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LevelsModal } from "@/components/Levels/LevelsModal";
import { type ClubKey } from "@/constants/Colors";
import { useClub, useClubTheme } from "@/hooks/useClubTheme";

const HEADER_HEIGHT = 200;

/** ✅ Use static require maps (no template strings) */
const CLUB_LOGOS: Record<ClubKey, any> = {
  'hapoel-tel-aviv': require("../../assets/offers/hapoel-tel-aviv/logo.png"),
  'maccabi-haifa': require("../../assets/offers/maccabi-haifa/logo.png"),
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
  'hapoel-tel-aviv': {
    shirt: require("../../assets/offers/hapoel-tel-aviv/shirt.jpg"),
    scarf: require("../../assets/offers/hapoel-tel-aviv/scarf.jpg"),
    ticket: require("../../assets/offers/hapoel-tel-aviv/logo.png"),
    sponsor1: require("../../assets/offers/hapoel-tel-aviv/sponser1.jpg"),
    sponsor2: require("../../assets/offers/hapoel-tel-aviv/sponser2.webp"),
  },
  'maccabi-haifa': {
    shirt: require("../../assets/offers/maccabi-haifa/shirt.jpg"),
    scarf: require("../../assets/offers/maccabi-haifa/scarf.png"),
    ticket: require("../../assets/offers/maccabi-haifa/logo.png"),
    sponsor1: require("../../assets/offers/maccabi-haifa/sponser1.png"),
    sponsor2: require("../../assets/offers/maccabi-haifa/sponser2.png"),
  },
};

export default function MainPage() {
  // Theme for the active club (hook handles light/dark automatically)
  const theme = useClubTheme();
  // Current club from your hook (exported from useClubTheme module)
  const currentClub: ClubKey = useClub();

  const y = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Offer | null>(null);

  const [levelsModalVisibility, setLevelsVisible] = useState(false);

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
              {currentClub === "hapoel-tel-aviv" ? "אוהד הפועל תל אביב" : "אוהד מכבי חיפה"}
            </Text>
          </View>
          <Image source={CLUB_LOGOS[currentClub]} style={styles.logo} resizeMode="contain" />
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

        {/* Points card */}
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
          <Text style={[styles.cardTitle, { color: theme.text }]}>⭐ נקודות דיגיטליות</Text>
          <Text style={[styles.points, { color: theme.primary }]}>5,778</Text>
          <Text style={[styles.growth, { color: "#12B886" }]}>+250 השבוע</Text>

          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { backgroundColor: isLightBg ? "#eee" : "#2a2d31" },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  { width: "75%", backgroundColor: theme.primary },
                ]}
              />
            </View>
            <Text
              style={[
                styles.progressText,
                { color: isLightBg ? "#666" : "#B7BCC1" },
              ]}
            >
              עוד 1,250 נקודות לדרגת זהב
            </Text>
          </View>
        </TouchableOpacity>

        {/* Offers */}
        <View style={styles.offers}>
          <Text
            style={[
              styles.offersTitle,
              { color: theme.text, borderRightColor: theme.primary },
            ]}
          >
            הצעות מובחרות
          </Text>

          <OfferCard
            image={assets.shirt}
            title="חולצת בית רשמית 2024"
            description={
              currentClub === "hapoel-tel-aviv"
                ? "החולצה החדשה של הפועל תל אביב לעונת 2024. איכות פרימיום עם רקמת הלוגו הרשמי."
                : "החולצה החדשה של מכבי חיפה לעונת 2024. איכות פרימיום עם רקמת הלוגו הרשמי."
            }
            expiresAt="31/12"
            points={2500}
            onPress={openOffer}
          />
          <OfferCard
            image={assets.scarf}
            title="צעיף רשמי – חורף"
            description={
              currentClub === "hapoel-tel-aviv"
                ? "צעיף אדום-לבן איכותי, מחמם וסטייליסטי ליציע."
                : "צעיף ירוק-לבן איכותי, מחמם וסטייליסטי ליציע."
            }
            expiresAt="15/01"
            points={1200}
            onPress={openOffer}
          />
          <OfferCard
            image={assets.ticket}
            title="הנחה של 25% על כרטיס משחק"
            description={
              currentClub === "hapoel-tel-aviv"
                ? "קוד קופון למשחק בית הקרוב של הפועל."
                : "קוד קופון למשחק בית הקרוב של מכבי."
            }
            expiresAt="30/11"
            points={1000}
            onPress={openOffer}
          />
          <OfferCard
            image={assets.sponsor1}
            title="ייעוץ לפני קניית רכב"
            description={
              currentClub === "hapoel-tel-aviv"
                ? "זמן טוב לקנות רכב! קבל פגישת ייעוץ אצל שלמה סיקסט"
                : "הנחה של 10% בחנות של אדידס"
            }
            expiresAt="30/11"
            points={3750}
            onPress={openOffer}
          />
          <OfferCard
            image={assets.sponsor2}
            title="200 שקל להשקעה ב IBI"
            description={
              currentClub === "hapoel-tel-aviv"
                ? "200 שקל שתוכל להשקיע ולהפקיד בבית ההשקעות IBI."
                : "הנחה של 18% לסרט ביס פלאנט"
            }
            expiresAt="30/11"
            points={900}
            onPress={openOffer}
          />
        </View>
      </Animated.ScrollView>

      {/* Bottom Modal */}
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
        userPoints={5400}
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
    marginBottom: 12,
    textAlign: "left",
    borderRightWidth: 4,
    paddingHorizontal: 12,
  },

  progressContainer: { width: "100%", marginTop: 12 },
  progressBar: { height: 10, borderRadius: 6, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: "100%", borderRadius: 6 },
  progressText: { fontSize: 12, textAlign: "center" },
});
