import { memo } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { type ClubTheme } from "@/constants/Colors";

export type FriendRow = {
  name: string;
  points: number;
  rank: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  friends: FriendRow[];
  rankAccent: (rank: number) => string;
  isLightBg: boolean;
  theme: Pick<ClubTheme, "primary">;
  currentUserName: string;
};

const FriendsModalComponent = ({
  visible,
  onClose,
  friends,
  rankAccent,
  isLightBg,
  theme,
  currentUserName,
}: Props) => {
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
            <Text style={[styles.title, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>טבלת חברים</Text>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: isLightBg ? "#EEF2F6" : "#23262B" }]}
              activeOpacity={0.8}
            >
              <MaterialIcons name="close" size={18} color={isLightBg ? "#111827" : "#E5E7EB"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {friends.map((friend) => {
              const isMe = friend.name === currentUserName;
              const accent = rankAccent(friend.rank);

              return (
                <View
                  key={friend.name}
                  style={[
                    styles.friendRow,
                    {
                      backgroundColor: isMe
                        ? isLightBg
                          ? "rgba(56,189,248,0.08)"
                          : "rgba(56,189,248,0.12)"
                        : isLightBg
                        ? "#FFFFFF"
                        : "#22262B",
                      borderColor: isLightBg ? "#EDF2F7" : "#2E3237",
                    },
                  ]}
                >
                  <View style={[styles.rankAccentBar, { backgroundColor: accent }]} />
                  <Text style={[styles.rankText, { color: isLightBg ? "#6B7280" : "#9CA3AF" }]}>#{friend.rank}</Text>
                  <View style={styles.rowCenter}>
                    <Text
                      style={[styles.friendName, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}
                      numberOfLines={1}
                    >
                      {friend.name}
                    </Text>
                  </View>
                  <Text style={[styles.pointsStrong, { color: isLightBg ? "#0C4A6E" : "#7DD3FC" }]}>
                    {friend.points.toLocaleString()} נק׳
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.ghostButton} onPress={onClose}>
              <Text style={[styles.ghostText, { color: theme.primary }]}>סגור</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctaButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.ctaText}>הזמן חברים</Text>
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
    minHeight: 420,
    maxHeight: 640,
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
  scroll: { width: "100%", maxHeight: 480 },
  scrollContent: { paddingHorizontal: 8, paddingVertical: 8, rowGap: 6 },
  friendRow: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  rankAccentBar: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    borderRadius: 2,
  },
  rankText: { width: 36, fontSize: 12, fontWeight: "700", textAlign: "left", opacity: 0.9 },
  rowCenter: { flexDirection: "row", alignItems: "center", flex: 1, columnGap: 8 },
  friendName: { fontSize: 14, fontWeight: "800", textAlign: "left", flexShrink: 1 },
  pointsStrong: { fontSize: 14, fontWeight: "900", textAlign: "left" },
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

export const FriendsModal = memo(FriendsModalComponent);
FriendsModal.displayName = "FriendsModal";
