import { InfoModal } from "@/components/Offers/InfoModal";
import { OfferCard, type Offer } from "@/components/Offers/OfferCard";
import { useClub, useClubTheme } from "@/hooks/useClubTheme";
import { useState } from "react";
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Offer | null>(null);

  const categories: OfferCategory[] = [
    {
      title: "חופשות",
      offers: [
        {
          image: { uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjbrQ-htP70WlDLQ5TewFYDVVvGPOOzbGoTQ&s" },
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
          image: { uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY0MHWYO1JLwEYQ_qfiWc7RK-6XBisrU4KpA&s" },
          title: "טלוויזיה 55״ LG",
          description: "מסך 4K חכם בהנחת מועדון.",
          expiresAt: "30/11/2025",
          points: 3500,
        },
        {
          image: { uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSXjzBVCKWErPg3xYZ-ZFM2LXLE9NRSypt4A&s" },
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
          image: { uri: "https://media.dolcemaster.co.il/products/oJASmBro8oEIzmluVsP7TRyGS3BiZd44oxc0aR2P.jpg" },
          title: "תו קנייה בשווי 200 ש׳׳ח",
          description: "תו קנייה בשווי 200 ש׳׳ח ברשת אוטו דיפוט",
          expiresAt: "10/01/2026",
          points: 1200,
        },
      ],
    },
  ];

  const openOffer = (offer: Offer) => {
    setSelected(offer);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        
        {/* Page Title */}
        <Text style={[styles.pageTitle, { color: theme.text }]}>
          🎁 הטבות ומבצעים
        </Text>

        {categories.map((cat, idx) => (
          <View key={idx} style={styles.categorySection}>
            
            {/* Section header */}
            <View style={styles.sectionHeader}>
              <View
                style={[
                  styles.sectionAccent,
                  { backgroundColor: theme.primary },
                ]}
              />
              <Text
                style={[styles.categoryTitle, { color: theme.text }]}
              >
                {cat.title}
              </Text>
            </View>

            {/* Offers carousel */}
            <FlatList
              data={cat.offers}
              horizontal
              keyExtractor={(_, i) => i.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              renderItem={({ item }) => (
                <View style={styles.cardWrapper}>
                  <OfferCard {...item} onPress={() => openOffer(item)} />
                </View>
              )}
              snapToInterval={width * 0.75 + 12}
              snapToAlignment="start"
              decelerationRate="fast"
            />
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      <InfoModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        onDismiss={() => setModalVisible(false)}
        selected={selected!}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "left", // 👈 force left
    marginVertical: 20,
    marginLeft: 16,
  },

  categorySection: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 16,
  },
  sectionAccent: {
    width: 6,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "left", // 👈 force left
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
