import { InfoModal } from "@/components/Offers/InfoModal";
import { OfferCard, type Offer } from "@/components/Offers/OfferCard";
import { useClub, useClubTheme } from "@/hooks/useClubTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type OfferCategory = {
  title: string;
  offers: Offer[];
};

export default function OffersPage() {
  const theme = useClubTheme();
  const currentClub = useClub();
  const clubName = currentClub === "hapoel-tel-aviv" ? "הפועל תל אביב" : "מכבי חיפה";

  const accentGradient: readonly [string, string] =
    currentClub === "hapoel-tel-aviv"
      ? ["#D52F26", "#B01C1F"]
      : ["#0B8A42", "#076233"];

  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Offer | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("הכל");

  const categories: OfferCategory[] = useMemo(() => (
    [
      {
        title: "חופשות",
        offers: [
          {
            image: {
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjbrQ-htP70WlDLQ5TewFYDVVvGPOOzbGoTQ&s",
            },
            title: "סופ״ש זוגי באילת",
            description: "2 לילות כולל ארוחת בוקר.",
            expiresAt: "01/12/2025",
            points: 2400,
          },
          {
            image: { uri: "https://m.issta.co.il/media/121963/025.jpg" },
            title: "מלון הרודס תל אביב",
            description: "לילה אחד באמצע שבוע.",
            expiresAt: "15/11/2025",
            points: 1800,
          },
        ],
      },
      {
        title: "חשמל וריהוט",
        offers: [
          {
            image: {
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY0MHWYO1JLwEYQ_qfiWc7RK-6XBisrU4KpA&s",
            },
            title: "טלוויזיה 55״ LG",
            description: "מסך 4K חכם בהנחת מועדון.",
            expiresAt: "30/11/2025",
            points: 3500,
          },
          {
            image: {
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSXjzBVCKWErPg3xYZ-ZFM2LXLE9NRSypt4A&s",
            },
            title: "מיקסר קיטשן-אייד",
            description: "כולל סט אביזרים מלא.",
            expiresAt: "15/12/2025",
            points: 2200,
          },
        ],
      },
      {
        title: "שופינג וצרכנות",
        offers: [
          {
            image: { uri: "https://media.htzone.co.il/111/426/399730.jpg" },
            title: "דרים קארד",
            description: "בשווי 250 שקל - דרים קארד",
            expiresAt: "05/12/2025",
            points: 950,
          },
          {
            image: {
              uri: "https://media.dolcemaster.co.il/products/oJASmBro8oEIzmluVsP7TRyGS3BiZd44oxc0aR2P.jpg",
            },
            title: "תו קנייה בשווי 200 ש׳׳ח",
            description: "תו קנייה בשווי 200 ש׳׳ח ברשת אוטו דיפוט",
            expiresAt: "10/01/2026",
            points: 1200,
          },
        ],
      },
    ]
  ), []);

  const filters = useMemo(() => [{ title: "הכל" }, ...categories], [categories]);

  const openOffer = (offer: Offer) => {
    setSelected(offer);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}> 
        <View style={styles.heroWrapper}>
          <LinearGradient colors={accentGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <Text style={styles.heroTitle}>{`מבצעים חמים לאוהדי ${clubName}`}</Text>
            <Text style={styles.heroSubtitle}>
              נצלו את הנקודות שצברתם כדי לקטוף חוויות ייחודיות, ציוד פרימיום ומתנות לבית.
            </Text>

            <View style={styles.heroHighlights}>
              <View style={styles.heroHighlight}>
                <MaterialIcons name="local-activity" size={18} color="#ffffff" />
                <Text style={styles.heroHighlightText}>הטבות למשחקים הקרובים</Text>
              </View>
              <View style={styles.heroHighlight}>
                <MaterialIcons name="card-giftcard" size={18} color="#ffffff" />
                <Text style={styles.heroHighlightText}>שוברי קנייה ומארזים מפנקים</Text>
              </View>
              <View style={styles.heroHighlight}>
                <MaterialIcons name="autorenew" size={18} color="#ffffff" />
                <Text style={styles.heroHighlightText}>הטבות מתעדכנות בכל שבוע</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <FlatList
          data={filters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedCategory(item.title)}
              style={[
                styles.categoryPill,
                {
                  backgroundColor:
                    selectedCategory === item.title ? theme.primary : theme.background,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Text
                style={{
                  color: selectedCategory === item.title ? "#fff" : theme.text,
                  fontWeight: "600",
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />

        {selectedCategory === "הכל"
          ? categories.map((cat, idx) => (
              <View key={idx} style={styles.categorySection}> 
                <Text style={[styles.categoryTitle, { color: theme.text }]}>
                  {cat.title}
                </Text>
                <FlatList
                  data={cat.offers}
                  horizontal
                  keyExtractor={(_, i) => i.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 12 }}
                  ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                  renderItem={({ item }) => (
                    <View
                      style={[
                        styles.cardWrapper,
                        {
                          backgroundColor: theme.background,
                          borderColor: theme.background,
                        },
                      ]}
                    >
                      <OfferCard {...item} onPress={() => openOffer(item)} />
                    </View>
                  )}
                  snapToInterval={width * 0.75 + 12}
                  snapToAlignment="start"
                  decelerationRate="fast"
                />
              </View>
            ))
          : (() => {
              const cat = categories.find((c) => c.title === selectedCategory);
              if (!cat) return null;
              return (
                <View style={styles.categorySection}> 
                  <Text style={[styles.categoryTitle, { color: theme.text }]}>
                    {cat.title}
                  </Text>
                  {cat.offers.map((item, i) => (
                    <View
                      key={i}
                      style={[
                        styles.cardWrapper,
                        {
                          marginHorizontal: 16,
                          marginBottom: 16,
                          backgroundColor: theme.background,
                          borderColor: theme.background,
                        },
                      ]}
                    > 
                      <OfferCard {...item} onPress={() => openOffer(item)} />
                    </View>
                  ))}
                </View>
              );
            })()}
      </ScrollView>

      {selected ? (
        <InfoModal
          modalVisible={modalVisible}
          closeModal={() => setModalVisible(false)}
          onDismiss={() => setModalVisible(false)}
          selected={selected}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroWrapper: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  heroCard: {
    borderRadius: 24,
    padding: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    gap: 16,
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "left",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "left",
  },
  heroHighlights: { gap: 8 },
  heroHighlight: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  heroHighlightText: { color: "#fff", fontSize: 13, fontWeight: "600", textAlign: "left" },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categorySection: {
    marginTop: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 16,
    marginBottom: 12,
    textAlign: "left",
  },
  cardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
});
