// components/OfferCard.tsx
import { useClubTheme } from "@/hooks/useClubTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type Offer = {
  title: string;
  description: string;
  points: number;
  expiresAt: string;
  image: ImageSourcePropType; // ✅ works for require() or { uri }
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
    <Pressable
      onPress={() => onPress(offer)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.row}>
        {/* Thumbnail */}
        <View style={styles.thumb}>
          <Image source={image} style={styles.thumbImage} />
        </View>

        {/* Text content */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.desc}>{description}</Text>

          {/* Bottom row */}
          <View style={styles.bottomRow}>
            <View style={styles.expiryWrap}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.expiryText}>עד {expiresAt}</Text>
            </View>

            <View style={styles.pointsWrap}>
              <Text style={[styles.pointsText,{color:theme.primary}]}>
                {points.toLocaleString("he-IL")} נקודות
              </Text>
              <Ionicons name="star-outline" size={16} color={theme.primary} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    minHeight: 120,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: "hidden",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    flexGrow: 1,
    paddingLeft: 12,
  },
  title: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  desc: {
    textAlign: "left",
    fontSize: 14,
    lineHeight: 20,
    color: "#475569",
    marginBottom: 10,
    flexShrink: 1,
  },
  bottomRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expiryWrap: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  expiryText: {
    writingDirection: "rtl",
    fontSize: 13,
    color: "#6B7280",
  },
  pointsWrap: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  pointsText: {
    writingDirection: "rtl",
    fontSize: 14,
    fontWeight: "700",
    color: "#d50000",
  },
});
