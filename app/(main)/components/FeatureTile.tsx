import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View, type StyleProp, type ViewStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  title: string;
  cta: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  isLightBg: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  backgroundOverrides?: {
    light?: { background: string; border: string; icon: string };
    dark?: { background: string; border: string; icon: string };
  };
};

const FeatureTileComponent = ({ title, cta, icon, isLightBg, onPress, style, backgroundOverrides }: Props) => {
  const overrides = isLightBg ? backgroundOverrides?.light : backgroundOverrides?.dark;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        style,
        {
          backgroundColor: overrides?.background ?? (isLightBg ? "#F9FAFB" : "#2A2A2D"),
          borderColor: overrides?.border ?? (isLightBg ? "#E5E7EB" : "#3A3A3D"),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <MaterialIcons
        name={icon as any}
        size={110}
        color={overrides?.icon ?? (isLightBg ? "#C9CDD2" : "#3A3A3D")}
        style={styles.backgroundIcon}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: isLightBg ? "#111827" : "#F9FAFB" }]}>{title}</Text>
        <Text style={[styles.cta, { color: isLightBg ? "#374151" : "#D1D5DB" }]}>{cta}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    minHeight: 90,
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
  },
  backgroundIcon: { position: "absolute", right: -18, bottom: -14, opacity: 0.14 },
  content: { zIndex: 2 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4, textAlign: "left" },
  cta: { fontSize: 14, fontWeight: "500", textAlign: "left" },
});

export const FeatureTile = memo(FeatureTileComponent);
FeatureTile.displayName = "FeatureTile";
