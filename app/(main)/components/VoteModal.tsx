import { memo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ImageSourcePropType,
} from "react-native";

type KitKey = "A" | "B" | "C";

type Props = {
  visible: boolean;
  isLightBg: boolean;
  selectedHomeVersion: KitKey | null;
  onSelect: (key: KitKey) => void;
  onSubmit: () => void;
  onClose: () => void;
  assets: Record<"shirt2" | "shirt3" | "shirt4", ImageSourcePropType>;
  selectedBorder: string;
  selectedBg: string;
  themePrimary: string;
};

const kits: Array<{ key: KitKey; sourceKey: "shirt2" | "shirt3" | "shirt4"; label: string }> = [
  { key: "A", sourceKey: "shirt2", label: "אפשרות 1" },
  { key: "B", sourceKey: "shirt3", label: "אפשרות 2" },
  { key: "C", sourceKey: "shirt4", label: "אפשרות 3 " },
];

const VoteModalComponent = ({
  visible,
  isLightBg,
  selectedHomeVersion,
  onSelect,
  onSubmit,
  onClose,
  assets,
  selectedBorder,
  selectedBg,
  themePrimary,
}: Props) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, { backgroundColor: isLightBg ? "#fff" : "#1F2226" }]}>
        <Text style={[styles.header, { color: isLightBg ? "#111827" : "#E5E7EB" }]}>בחרו את מדי הבית</Text>

        <View style={styles.kitsRow}>
          {kits.map(({ key, sourceKey, label }) => {
            const selected = selectedHomeVersion === key;
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.kitCard,
                  {
                    borderColor: selected ? selectedBorder : isLightBg ? "#E5E7EB" : "#33363B",
                    backgroundColor: selected ? selectedBg : isLightBg ? "#F9FAFB" : "#24262A",
                  },
                ]}
                onPress={() => onSelect(key)}
                activeOpacity={0.9}
              >
                <Image source={assets[sourceKey]} style={styles.kitImage} resizeMode="cover" />
                <Text style={[styles.kitLabel, { color: isLightBg ? "#111827" : "#E5E7EB" }]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.ghostButton} onPress={onClose}>
            <Text style={[styles.ghostText, { color: themePrimary }]}>סגור</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.ctaButton, { backgroundColor: themePrimary }]} onPress={onSubmit}>
            <Text style={styles.ctaText}>שלח הצבעה</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    paddingHorizontal: 10,
  },
  container: { width: "92%", borderRadius: 18, padding: 16 },
  header: { fontSize: 18, fontWeight: "800", marginBottom: 12, textAlign: "left" },
  kitsRow: { flexDirection: "row", justifyContent: "space-between", columnGap: 10, marginBottom: 12 },
  kitCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 10, alignItems: "center" },
  kitImage: { width: "100%", height: 80, borderRadius: 10, marginBottom: 8 },
  kitLabel: { fontSize: 13, fontWeight: "700", textAlign: "left" },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: 10,
    paddingTop: 12,
  },
  ghostButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  ghostText: { fontWeight: "700", fontSize: 14, textAlign: "left" },
  ctaButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 14, textAlign: "left" },
});

export const VoteModal = memo(VoteModalComponent);
VoteModal.displayName = "VoteModal";
