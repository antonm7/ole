import { usePoints, useSetPoints } from "@/hooks/usePoints"; // 👈 import hooks
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Offer } from "./OfferCard";

export function InfoModal({
  modalVisible,
  closeModal,
  onDismiss,
  selected,
}: {
  modalVisible: boolean;
  closeModal: () => void;
  onDismiss: () => void;
  selected: Offer;
}) {
  const points = usePoints();
  const setPoints = useSetPoints();

  const handleRedeem = () => {
    if (!selected) return;

    if (points < selected.points) {
      Alert.alert(
        "אין מספיק נקודות",
        `\n${"".padEnd(2)}אין לך מספיק נקודות למימוש ההטבה הזו.`,
        [{ text: "סגור", style: "cancel" }]
      );
      return;
    }

    Alert.alert(
      "אישור מימוש",
      `\n${"".padEnd(2)}אתה בטוח שברצונך לממש ${selected.points.toLocaleString()} נקודות על:\n${"".padEnd(2)}"${selected.title}"?`,
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "ממש",
          style: "destructive",
          onPress: () => {
            setPoints(points - selected.points);
            closeModal();
            Alert.alert("הצלחה", `\n${"".padEnd(2)}הנקודות מומשו בהצלחה!`);
          },
        },
      ]
    );
  };

  const Terms = () => (
    <View style={styles.termsWrapper}>
      <Text style={styles.termsTitle}>תנאים והגבלות</Text>
      <Text style={styles.termsText}>
        • השובר אישי ואינו ניתן להעברה.{"\n"}
        • מימוש ההטבה כפוף לזמינות המלאי.{"\n"}
        • ההטבה תקפה עד לתאריך המצוין במבצע.{"\n"}
        • החברה רשאית לשנות או להפסיק את המבצע בכל עת.{"\n"}
        • התמונה להמחשה בלבד.{"\n"}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={Platform.OS !== "ios"}
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "overFullScreen"}
      onRequestClose={closeModal}
      onDismiss={onDismiss}
    >
      {Platform.OS === "ios" ? (
        <SafeAreaView style={{ flex: 1 }}>
          {/* Handle for iOS */}
          <View style={styles.handleWrapper}>
            <View style={styles.handle} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Image header */}
            <View style={styles.imageWrapper}>
              <Image
                source={selected?.image}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </View>

            {/* Title + Meta */}
            <Text style={styles.sheetTitle}>{selected?.title}</Text>
            <Text style={styles.sheetMeta}>
              ניקוד נדרש:{" "}
              <Text style={styles.metaStrong}>
                {selected?.points?.toLocaleString?.() || selected?.points}
              </Text>{" "}
              · בתוקף עד: {selected?.expiresAt}
            </Text>

            {/* Description */}
            <Text style={styles.sheetDesc}>{selected?.description}</Text>

            {/* CTA */}
            <View style={styles.ctaRow}>
              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={handleRedeem}
              >
                <Text style={[styles.btnText, styles.btnTextPrimary]}>
                  ממש נקודות
                </Text>
              </Pressable>
            </View>

            {/* Terms & Conditions */}
            <Terms />
          </ScrollView>
        </SafeAreaView>
      ) : (
        // Android sheet
        <SafeAreaView style={styles.sheetWrapper}>
          <View style={styles.sheet}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={selected?.image}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.sheetTitle}>{selected?.title}</Text>
              <Text style={styles.sheetMeta}>
                ניקוד נדרש:{" "}
                <Text style={styles.metaStrong}>
                  {selected?.points?.toLocaleString?.() || selected?.points}
                </Text>{" "}
                · בתוקף עד: {selected?.expiresAt}
              </Text>

              <Text style={styles.sheetDesc}>{selected?.description}</Text>

              <View style={styles.ctaRow}>
                <Pressable
                  style={[styles.btn, styles.btnPrimary]}
                  onPress={handleRedeem}
                >
                  <Text style={[styles.btnText, styles.btnTextPrimary]}>
                    ממש נקודות
                  </Text>
                </Pressable>
              </View>

              {/* Terms & Conditions */}
              <Terms />
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  handleWrapper: { alignItems: "center", paddingTop: 10, paddingBottom: 6 },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E0E0E0",
  },

  scrollContainer: {
    paddingBottom: 32,
    paddingHorizontal: 20,
  },

  imageWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },

  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },

  sheetTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "left",
    marginBottom: 6,
  },
  sheetMeta: {
    fontSize: 14,
    color: "#666",
    textAlign: "left",
    marginBottom: 12,
  },
  metaStrong: { color: "#000", fontWeight: "700" },

  sheetDesc: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    textAlign: "left",
    marginBottom: 20,
  },

  ctaRow: {
    flexDirection: "row-reverse",
    gap: 12,
    marginTop: 16,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#d50000" },
  btnText: { fontSize: 16, fontWeight: "700" },
  btnTextPrimary: { color: "#fff" },

  sheetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },

  // Terms & Conditions
  termsWrapper: {
    marginTop: 28,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#eee",
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#222",
    textAlign: "left",
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#555",
    textAlign: "left",
  },
});
