import { memo } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import QRCode from "react-native-qrcode-svg";

import { type ClubTheme } from "@/constants/Colors";

type Props = {
  visible: boolean;
  onClose: () => void;
  isLightBg: boolean;
  theme: Pick<ClubTheme, "text" | "primary">;
  qrPayload: string;
};

const TicketsModalComponent = ({ visible, onClose, isLightBg, theme, qrPayload }: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: isLightBg ? "#ffffff" : "#1F2226",
              borderColor: isLightBg ? "#E5E7EB" : "#2A2D31",
            },
          ]}
        >
          <View style={styles.topRow}>
            <Text style={[styles.title, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>הכרטיסים שלי</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: isLightBg ? "#EEF2F6" : "#23262B" }]}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={18} color={isLightBg ? "#111827" : "#E5E7EB"} />
            </TouchableOpacity>
          </View>

          <View style={styles.ticketHeader}>
            <Text style={[styles.ticketTitle, { color: theme.text }]}>משחק בית נגד מכבי תל אביב</Text>
          </View>

          <View style={styles.qrSection}>
            <View
              style={[
                styles.qrCard,
                {
                  backgroundColor: isLightBg ? "#F8FAFC" : "#15181C",
                  borderColor: isLightBg ? "#E5E7EB" : "#2A2D31",
                },
              ]}
            >
              <QRCode value={qrPayload} size={180} backgroundColor="transparent" />
            </View>
            <Text style={[styles.qrHint, { color: isLightBg ? "#64748B" : "#94A3B8" }]}>
              הציגו את ה-QR בשער הכניסה
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.ghostButton} onPress={onClose}>
              <Text style={[styles.ghostText, { color: theme.primary }]}>סגור</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctaButton, { backgroundColor: theme.primary }]} onPress={() => {}}>
              <Text style={styles.ctaText}>מכירה</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  container: {
    width: "92%",
    minHeight: 320,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  topRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 16, fontWeight: "800", textAlign: "left", flex: 1 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  ticketHeader: { paddingHorizontal: 16, paddingTop: 12 },
  ticketTitle: { fontSize: 16, fontWeight: "800", textAlign: "left" },
  qrSection: { alignItems: "center", paddingHorizontal: 16, paddingVertical: 18, rowGap: 10 },
  qrCard: { padding: 18, borderRadius: 16, borderWidth: 1 },
  qrHint: { fontSize: 12, textAlign: "left" },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    columnGap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  ghostButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  ghostText: { fontWeight: "700", fontSize: 14, textAlign: "left" },
  ctaButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  ctaText: { color: "#fff", fontWeight: "700", fontSize: 14, textAlign: "left" },
});

export const TicketsModal = memo(TicketsModalComponent);
TicketsModal.displayName = "TicketsModal";
