import { useClubTheme } from "@/hooks/useClubTheme";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

  return (
    <TapGestureHandler onActivated={() => onPress(offer)}>
      <View style={styles.card}>
        {/* 🔥 Top row */}
        <View style={styles.row}>
          <View style={styles.thumb}>
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              style={styles.thumbImage}
            />
          </View>

          <View style={styles.content}>
            <Text
              style={styles.title}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.desc}
            >
              {description}
            </Text>
          </View>
        </View>

        {/* 🔥 Bottom row */}
        <View style={styles.bottomRow}>
          <View style={styles.expiryWrap}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.expiryText}>עד {expiresAt}</Text>
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
    backgroundColor: "#EEEDEDA8",
    borderRadius: 6,
    padding: 16,
    marginHorizontal: 6,
    marginVertical: 8,
    justifyContent: "space-between",
    overflow: "hidden",
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
    color: "#111827",
    marginBottom: 4,
    textAlign: "left",
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    color: "#4B5563",
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
    color: "#6B7280",
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
