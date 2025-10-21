import { useClubTheme } from "@/hooks/useClubTheme";
import { Ionicons } from "@expo/vector-icons";
import { Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";

export type Offer = {
  title: string;
  description: string;
  points: number;
  expiresAt: string;
  image: ImageSourcePropType;
};

type OfferCardProps = Offer & {
  onPress: (offer: Offer) => void;
};

export function OfferCard({
  title,
  description,
  expiresAt,
  points,
  image,
  onPress,
}: OfferCardProps) {
  const offer: Offer = { title, description, expiresAt, points, image };
  const theme = useClubTheme();
  const isLightBg = theme.background === "#FFFFFF";
  const cardBackground = isLightBg ? "#EEEDEDA8" : "#1F2229";
  const cardBorder = isLightBg ? "rgba(148, 163, 184, 0.35)" : "rgba(148, 163, 184, 0.15)";
  const titleColor = isLightBg ? "#111827" : "#F8FAFC";
  const descriptionColor = isLightBg ? "#4B5563" : "#CBD5F5";
  const expiryColor = isLightBg ? "#6B7280" : "#9CA3AF";

  return (
    <TapGestureHandler onActivated={() => onPress(offer)}>
      <View style={[styles.card, { backgroundColor: cardBackground, borderColor: cardBorder }]}>
        {/* 🔥 Top row */}
        <View style={styles.row}>
          <View style={styles.thumb}>
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              style={styles.thumbImage}
            />
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: titleColor }]} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.desc, { color: descriptionColor }]}>
              {description}
            </Text>
          </View>
        </View>

        {/* 🔥 Bottom row */}
        <View style={styles.bottomRow}>
          <View style={styles.expiryWrap}>
            <Ionicons name="time-outline" size={16} color={expiryColor} />
            <Text style={[styles.expiryText, { color: expiryColor }]}>עד {expiresAt}</Text>
          </View>

          <View style={styles.pointsWrap}>
            <Text style={[styles.pointsText, { color: theme.primary }]}>
              {points.toLocaleString("he-IL")} נקודות
            </Text>
            <Ionicons name="star" size={16} color={theme.primary} />
          </View>
        </View>
      </View>
    </TapGestureHandler>
  );
}

const CARD_HEIGHT = 180;

const styles = StyleSheet.create({
  card: {
    flex: 1, // 👈 Expand to parent width (HomePage carousel = max width, OffersPage wrapper = fixed width)
    height: CARD_HEIGHT,
    borderRadius: 6,
    padding: 16,
    marginHorizontal: 6,
    marginVertical: 8,
    justifyContent: "space-between",
    overflow: "hidden",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 12,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "left",
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: "left",
  },
  bottomRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  expiryWrap: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  expiryText: {
    fontSize: 12,
  },
  pointsWrap: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
