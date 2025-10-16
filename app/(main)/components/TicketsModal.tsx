import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { memo, useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

import { type ClubTheme } from "@/constants/Colors";

export type TicketItem = {
  id: string;
  title: string;
  subtitle: string;
  details: string[];
  qrPayload: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  isLightBg: boolean;
  theme: Pick<ClubTheme, "text" | "primary">;
  tickets: TicketItem[];
};

const TicketsModalComponent = ({ visible, onClose, isLightBg, theme, tickets }: Props) => {
  const surface = {
    backgroundColor: isLightBg ? "#ffffff" : "#1F2226",
    borderColor: isLightBg ? "#E5E7EB" : "#2A2D31",
  };

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!visible) setExpanded({});
  }, [visible]);

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const Content = ({ showHandle }: { showHandle: boolean }) => (
    <>
      {showHandle && (
        <View style={styles.handleWrapper}>
          <View style={styles.handle} />
        </View>
      )}

      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Text style={[styles.title, { color: isLightBg ? "#0F172A" : "#F8FAFC" }]}>הכרטיסים שלי</Text>
          <Text
            style={[
              styles.statusBadge,
              {
                backgroundColor: isLightBg ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.22)",
                color: isLightBg ? "#991B1B" : "#F9A8A8",
                borderColor: isLightBg ? "rgba(239,68,68,0.35)" : "rgba(248,113,113,0.4)",
              },
            ]}
          >
            לא מנוי
          </Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          style={[styles.closeBtn, { backgroundColor: isLightBg ? "#EEF2F6" : "#23262B" }]}
          activeOpacity={0.8}
        >
          <MaterialIcons name="close" size={18} color={isLightBg ? "#111827" : "#E5E7EB"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.ticketList}>
          {tickets.map((ticket) => {
            const isOpen = !!expanded[ticket.id];
            return (
              <View
                key={ticket.id}
                style={[
                  styles.ticketCard,
                  {
                    backgroundColor: isLightBg ? "#F8FAFC" : "#15181C",
                    borderColor: isLightBg ? "#E2E8F0" : "#2A2D31",
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.ticketToggle}
                  onPress={() => toggle(ticket.id)}
                  activeOpacity={0.85}
                >
                  <View>
                    <Text style={[styles.ticketTitle, { color: isLightBg ? "#0F172A" : "#E2E8F0" }]}>
                      {ticket.title}
                    </Text>
                    <Text style={[styles.ticketSubtitle, { color: isLightBg ? "#475569" : "#94A3B8" }]}>
                      {ticket.subtitle}
                    </Text>
                  </View>
                  <MaterialIcons
                    name={isOpen ? "expand-less" : "expand-more"}
                    size={26}
                    color={isLightBg ? "#1E293B" : "#CBD5F5"}
                  />
                </TouchableOpacity>

                {isOpen && (
                  <>
                    <View
                      style={[
                        styles.cardDivider,
                        { backgroundColor: isLightBg ? "#E2E8F0" : "#2A2D31" },
                      ]}
                    />
                    <View style={styles.ticketBody}>
                      <View style={styles.ticketDetailList}>
                        {ticket.details.map((detail) => (
                          <Text
                            key={detail}
                            style={[styles.ticketDetail, { color: isLightBg ? "#1F2937" : "#E2E8F0" }]}
                          >
                            {detail}
                          </Text>
                        ))}
                      </View>

                      <View style={styles.qrWrap}>
                        <View
                          style={[
                            styles.qrCard,
                            {
                              backgroundColor: isLightBg ? "#FFFFFF" : "#111418",
                              borderColor: isLightBg ? "#E2E8F0" : "#2A2D31",
                            },
                          ]}
                        >
                          <QRCode value={ticket.qrPayload} size={220} backgroundColor="transparent" />
                        </View>
                        <Text style={[styles.qrHint, { color: isLightBg ? "#64748B" : "#94A3B8" }]}>
                          הציגו את ה-QR בשער הכניסה
                        </Text>
                      </View>

                      <View style={styles.ticketSellRow}>
                        <TouchableOpacity
                          style={[styles.sellButton, { backgroundColor: theme.primary }]}
                          onPress={() => {}}
                        >
                          <Text style={styles.sellButtonText}>מכירה</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );

  if (Platform.OS === "ios") {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={[styles.sheetContainer, surface]}>
          <Content showHandle />
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.androidCard, surface]}>
          <Content showHandle={false} />
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
  sheetContainer: {
    flex: 1,
  },
  androidCard: {
    width: "92%",
    maxHeight: Dimensions.get("window").height * 0.9,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  handleWrapper: { alignItems: "center", paddingVertical: 8 },
  handle: { width: 44, height: 5, borderRadius: 3, backgroundColor: "#E0E0E0" },
  topRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  title: { fontSize: 18, fontWeight: "800", textAlign: "left", flex: 1 },
  titleGroup: { flex: 1, flexDirection: "row", alignItems: "center", columnGap: 10 },
  statusBadge: {
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: "700",
    borderWidth: StyleSheet.hairlineWidth,
    textAlign: "left",
  },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  scrollContent: { paddingBottom: 32, paddingHorizontal: 16 },
  ticketList: { rowGap: 16, paddingTop: 12 },
  ticketCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  ticketToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  ticketTitle: { fontSize: 16, fontWeight: "800", textAlign: "left" },
  ticketSubtitle: { fontSize: 13, fontWeight: "500", marginTop: 4, textAlign: "left" },
  cardDivider: { height: StyleSheet.hairlineWidth, width: "100%" },
  ticketBody: { paddingHorizontal: 16, paddingVertical: 16, rowGap: 18 },
  ticketDetailList: { rowGap: 6 },
  ticketDetail: { fontSize: 14, textAlign: "left" },
  qrWrap: { alignItems: "center", rowGap: 12 },
  qrCard: { padding: 18, borderRadius: 16, borderWidth: 1 },
  qrHint: { fontSize: 12, textAlign: "left" },
  ticketSellRow: { alignItems: "flex-end" },
  sellButton: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  sellButtonText: { color: "#fff", fontWeight: "700", fontSize: 14, textAlign: "left" },
});

export const TicketsModal = memo(TicketsModalComponent);
TicketsModal.displayName = "TicketsModal";
