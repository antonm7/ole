import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useClubTheme } from "@/hooks/useClubTheme";
import { usePoints } from "@/hooks/usePoints";

/* ---------- types ---------- */
type PointsEvent = {
  id: string;
  amount: number; // positive add, negative subtract
  date: string;   // ISO
  note?: string;
};

export default function ProfilePage() {
  const theme = useClubTheme();
  const points = usePoints();
  const isLightBg = theme.background === "#FFFFFF";

  // 🔹 dummy recent points history (newest first)
  const [history] = useState<PointsEvent[]>([
    { id: "1", amount: 250, date: "2025-10-01", note: "רכישה בסופר" },
    { id: "2", amount: 120, date: "2025-09-28", note: "מסעדה" },
    { id: "3", amount: 400, date: "2025-09-21", note: "דלק" },
    { id: "4", amount: 80,  date: "2025-09-15", note: "קפה ומאפה" },
  ]);

  /* ---------- list item renderer ---------- */
  const renderHistoryItem = ({ item }: { item: PointsEvent }) => {
    const positive = item.amount >= 0;

    // Hebrew order: amount on right, details on left
    return (
      <View
        style={[
          styles.historyItem,
          {
            backgroundColor: isLightBg ? "#FFFFFF" : "#1D1F22",
            borderColor: isLightBg ? "#ECEFF2" : "#2B2F34",
          },
        ]}
      >
        {/* Details (left) */}
        <View style={styles.historyLeft}>
          <View
            style={[
              styles.historyIconWrap,
              {
                backgroundColor: positive
                  ? "rgba(18,184,134,0.12)"
                  : "rgba(213,0,0,0.12)",
              },
            ]}
          >
            <MaterialIcons
              name={positive ? "trending-up" : "trending-down"}
              size={18}
              color={positive ? "#12B886" : "#d50000"}
            />
          </View>
          <View style={{ gap: 2 }}>
            <Text style={[styles.historyTitle, { color: theme.text }]}>
              {item.note || "צבירת נקודות"}
            </Text>
            <Text
              style={[
                styles.historySub,
                { color: isLightBg ? "#6B7280" : "#A4ACB8" },
              ]}
            >
              {formatDate(item.date)}
            </Text>
          </View>
        </View>

        {/* Amount pill (right) */}
        <View style={styles.amountWrap}>
          <Text
            style={[
              styles.historyAmount,
              { color: positive ? "#12B886" : "#d50000" },
            ]}
          >
            {positive ? "+" : "-"}
            {Math.abs(item.amount).toLocaleString()} נק׳
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          contentContainerStyle={{ paddingBottom: 120 }}
          ListHeaderComponent={
            <View style={styles.headerWrap}>
              {/* Page title */}
              <Text style={[styles.pageTitle, { color: theme.text }]}>פרופיל</Text>

              {/* Points summary card */}
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isLightBg ? "#FFFFFF" : "#1D1F22",
                    borderColor: isLightBg ? "#ECEFF2" : "#2B2F34",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardLabel,
                    { color: isLightBg ? "#6B7280" : "#A4ACB8" },
                  ]}
                >
                  נקודות נוכחיות
                </Text>
                <Text style={[styles.pointsText, { color: theme.primary }]}>
                  {points.toLocaleString()}
                </Text>
                <Text
                  style={[
                    styles.cardHint,
                    { color: isLightBg ? "#6B7280" : "#A4ACB8" },
                  ]}
                >
                  הנקודות מתעדכנות אוטומטית לאחר כל רכישה
                </Text>
              </View>

              {/* Recent points history */}
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                היסטוריית נקודות
              </Text>
            </View>
          }
          data={history}
          keyExtractor={(i) => i.id}
          renderItem={renderHistoryItem}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- helpers ---------- */

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return iso;
  }
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  // enforce RTL layout but keep text left-aligned
  headerWrap: { paddingBottom: 8, direction: "rtl", writingDirection: "rtl" },

  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "left",
    marginVertical: 20,
    marginLeft: 16,
    direction: "rtl",
    writingDirection: "rtl",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "left",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
    direction: "rtl",
    writingDirection: "rtl",
  },

  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    direction: "rtl",
    writingDirection: "rtl",
  },

  cardLabel: {
    fontSize: 13,
    textAlign: "left",
    marginBottom: 4,
    direction: "rtl",
    writingDirection: "rtl",
  },
  pointsText: {
    fontSize: 34,
    fontWeight: "800",
    textAlign: "left",
    direction: "rtl",
    writingDirection: "rtl",
  },
  cardHint: {
    fontSize: 12,
    textAlign: "left",
    marginTop: 6,
    direction: "rtl",
    writingDirection: "rtl",
  },

  // history item
  historyItem: {
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  amountWrap: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.04)",
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  historyAmount: {
    fontSize: 15,
    fontWeight: "800",
    textAlign: "left",
  },
  historyLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  historyIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "left",
    direction: "rtl",
    writingDirection: "rtl",
  },
  historySub: {
    fontSize: 12,
    textAlign: "left",
    direction: "rtl",
    writingDirection: "rtl",
  },
});
