import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { type SharedValue } from "react-native-reanimated";

import { OfferCard, type Offer } from "@/components/Offers/OfferCard";
import { type ClubTheme } from "@/constants/Colors";

type Props = {
  offers: Offer[];
  width: number;
  progressOffers: SharedValue<number>;
  onPressOffer: (offer: Offer) => void;
  theme: Pick<ClubTheme, "text" | "primary">;
};

const OffersCarouselSectionComponent = ({ offers, width, progressOffers, onPressOffer, theme }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text, borderRightColor: theme.primary }]}>הצעות מובחרות</Text>

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
            <OfferCard {...item} onPress={() => onPressOffer(item)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 20 },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "left",
    borderRightWidth: 4,
    paddingHorizontal: 12,
  },
});

export const OffersCarouselSection = memo(OffersCarouselSectionComponent);
OffersCarouselSection.displayName = "OffersCarouselSection";
