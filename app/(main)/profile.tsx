import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import {
  ColorValue,
  FlatList,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
function addDays(baseISO: string, delta: number) {
  const d = new Date(baseISO);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

/* Fake data generator by page: each page = 12 items, descending by date.
   Positives ONLY from: מסעדה, קניות אונליין, אופנה, רכישה בסופר
   Negatives ONLY from: מימוש נקודות
   Additionally: the LATEST 5 (page 0) are 4 positives + 1 negative (the 3rd item). */
function generateHistoryPage(startISO: string, page: number): PointsEvent[] {
  const startOffset = page * 12;

  const POSITIVE_NOTES = ["מסעדה", "קניות אונליין", "אופנה", "רכישה בסופר"] as const;
  const NEGATIVE_NOTE = "מימוש נקודות";

  const out: PointsEvent[] = [];

  for (let i = 0; i < 12; i++) {
    const idx = startOffset + i;
    const dateISO = addDays(startISO, -idx);

    let isPositive: boolean;

    if (page === 0 && i < 5) {
      // Force latest 5 to be exactly 4 positive + 1 negative.
      // Make the 3rd row (i === 2) negative, others positive.
      isPositive = i !== 2;
    } else {
      // Otherwise: mostly positives; occasional negative
      isPositive = Math.random() < 0.95;
    }

    const amount = isPositive
      ? Math.floor(60 + Math.random() * 520)         // earn
      : -Math.floor(100 + Math.random() * 900);      // redeem

    out.push({
      id: `${page}-${i}-${dateISO}`,
      amount,
      date: dateISO,
      note: isPositive
        ? POSITIVE_NOTES[(idx + i) % POSITIVE_NOTES.length]
        : NEGATIVE_NOTE,
    });
  }

  return out;
}

/* ---------- screen ---------- */
export default function ProfilePage() {
  const theme = useClubTheme();
  const points = usePoints();
  const isLightBg = theme.background === "#FFFFFF";

  /* iOS number pad accessory ID */
  const inputAccessoryViewID = "numPadDone";

  /* Greeting header gradient (typed as tuple) */
  const greetingColors: readonly [ColorValue, ColorValue] = isLightBg
    ? ["#e0f2fe", "#f0f9ff"]
    : ["#0B1220", "#111827"];

  /* ---------- history (preview only here) ---------- */
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [seedHistory] = useState<PointsEvent[]>(() => generateHistoryPage(todayISO, 0));
  const preview = seedHistory.slice(0, 5);

  /* ---------- “see all” modal with finite pagination ---------- */
  const MAX_PAGES = 6; // your current limit
  const [showAll, setShowAll] = useState(false);
  const [allPage, setAllPage] = useState(0);
  const [allHistory, setAllHistory] = useState<PointsEvent[]>(() => generateHistoryPage(todayISO, 0));
  const [loadingMore, setLoadingMore] = useState(false);

  const openAll = () => setShowAll(true);

  const loadMoreAll = () => {
    if (loadingMore) return;
    if (allPage >= MAX_PAGES - 1) return; // stop loading after MAX_PAGES
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = allPage + 1;
      const more = generateHistoryPage(todayISO, nextPage);
      setAllHistory((prev) => [...prev, ...more]);
      setAllPage(nextPage);
      setLoadingMore(false);
    }, 250);
  };

  /* ---------- change card flow ---------- */
  const [changeOpen, setChangeOpen] = useState(false);
  const [step, setStep] = useState<"reason" | "verify" | "form" | "done">("reason");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // card form (updated)
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState(""); // 4 digits
  const [cvv, setCvv] = useState("");
  const [idFull, setIdFull] = useState(""); // full ID number
  const [formError, setFormError] = useState<string | null>(null);

  const maskedCurrentCard = "•••• 1234"; // no expiry shown

  const resetFlow = () => {
    setStep("reason");
    setSelectedReason(null);
    setPhone("");
    setPhoneError(null);
    setCardNumber("");
    setExpiryMonth("");
    setExpiryYear("");
    setCvv("");
    setIdFull("");
    setFormError(null);
  };

  const validatePhone = () => {
    const clean = phone.replace(/\D/g, "");
    if (!/^05\d{8}$/.test(clean)) {
      setPhoneError("מספר טלפון לא תקין. הזינו בפורמט 05XXXXXXXX");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const goNextFromReason = () => {
    if (!selectedReason) return;
    setStep("verify");
  };
  const goNextFromVerify = () => {
    if (!validatePhone()) return;
    setStep("form");
  };

  const submitNewCard = () => {
    const num = cardNumber.replace(/\s+/g, "");
    const mm = expiryMonth.trim();
    const yyyy = expiryYear.trim();
    const c = cvv.trim();
    const id = idFull.trim();

    if (!/^\d{16}$/.test(num)) {
      setFormError("מספר כרטיס חייב להכיל 16 ספרות.");
      return;
    }
    if (!/^\d{2}$/.test(mm) || Number(mm) < 1 || Number(mm) > 12) {
      setFormError("חודש תוקף (MM) לא תקין.");
      return;
    }
    if (!/^\d{4}$/.test(yyyy)) {
      setFormError("שנת תוקף (YYYY) לא תקינה.");
      return;
    }
    if (!/^\d{3}$/.test(c)) {
      setFormError("CVV חייב להכיל 3 ספרות.");
      return;
    }
    if (!/^\d{9}$/.test(id)) {
      setFormError("מספר תעודת זהות מלא חייב להכיל 9 ספרות.");
      return;
    }

    setFormError(null);
    setStep("done");
  };

  /* ---------- renderers ---------- */
  const renderHistoryItem = ({ item }: { item: PointsEvent }) => {
    const positive = item.amount >= 0;
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
        {/* Left: details */}
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
            <Text style={[styles.historyTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>
              {item.note || "צבירת נקודות"}
            </Text>
            <Text style={[styles.historySub, { color: isLightBg ? "#6B7280" : "#A4ACB8" }]}>
              {formatDate(item.date)}
            </Text>
          </View>
        </View>

        {/* Right: amount */}
        <View style={styles.amountWrap}>
          <Text style={[styles.historyAmount, { color: positive ? "#12B886" : "#d50000" }]}>
            {positive ? "+" : "-"}
            {Math.abs(item.amount).toLocaleString()} נק׳
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        {/* Tap anywhere outside inputs to dismiss keyboard */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView contentContainerStyle={{ paddingBottom: 160 }} keyboardShouldPersistTaps="handled">
            {/* ===== Smaller Greeting (no avatar, no points) ===== */}
            <View style={styles.headerWrap}>
              <LinearGradient colors={greetingColors} style={styles.greetCard}>
                <View style={styles.greetLeft}>
                  <Text style={[styles.hello, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>שלום</Text>
                  <Text style={[styles.fullName, { color: theme.primary }]}>עידו ניצני</Text>
                  <Text style={[styles.metaSmall, { color: isLightBg ? "#475569" : "#94A3B8" }]}>
                    חבר מועדון
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {/* ===== History preview (latest 5) ===== */}
            <View style={styles.sectionRow}>
              <Text style={[styles.sectionTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>
                היסטוריית נקודות
              </Text>
              <TouchableOpacity onPress={openAll} activeOpacity={0.8} style={styles.linkBtn}>
                <Text style={[styles.linkText, { color: theme.primary }]}>הצג הכול</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 12 }}>
              {preview.map((item) => (
                <View key={item.id}>{renderHistoryItem({ item })}</View>
              ))}
            </View>

            {/* Small spacer before card management (reduced) */}
            <View style={{ height: 10 }} />

            {/* ===== BOTTOM: Active card + Change flow ===== */}
            <View
              style={[
                styles.cardManageWrap,
                {
                  backgroundColor: isLightBg ? "#FFFFFF" : "#111317",
                  borderTopWidth: 0, // no separation line
                  marginTop: 12,     // closer to history
                },
              ]}
            >
              <View style={styles.activeCardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.activeLabel, { color: isLightBg ? "#6B7280" : "#A4ACB8" }]}>כרטיס פעיל</Text>
                  <Text style={[styles.activeValue, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>{maskedCurrentCard}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    resetFlow();
                    setChangeOpen(true);
                  }}
                  activeOpacity={0.9}
                  style={[styles.changeBtn, { backgroundColor: theme.primary }]}
                >
                  <MaterialIcons name="swap-horiz" size={18} color="#fff" />
                  <Text style={styles.changeBtnText}>החלף כרטיס</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Change Card Modal */}
      <Modal visible={changeOpen} transparent animationType="fade" onRequestClose={() => setChangeOpen(false)}>
        {/* Press outside card: dismiss keyboard (and keep modal open) */}
        <Pressable style={styles.modalOverlay} onPress={Keyboard.dismiss}>
          {/* Stop propagation so inside taps don’t dismiss keyboard automatically */}
          <Pressable
            style={[
              styles.modalCard,
              { backgroundColor: isLightBg ? "#FFFFFF" : "#1F2226", borderColor: isLightBg ? "#E5E7EB" : "#2A2D31" },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>החלפת כרטיס אשראי</Text>
              <TouchableOpacity
                onPress={() => setChangeOpen(false)}
                style={[styles.closeX, { backgroundColor: isLightBg ? "#EEF2F6" : "#23262B" }]}
              >
                <MaterialIcons name="close" size={18} color={isLightBg ? "#111827" : "#E5E7EB"} />
              </TouchableOpacity>
            </View>

            {/* Steps */}
            {step === "reason" && (
              <View style={{ gap: 14 }}>
                <Text style={[styles.stepTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>למה תרצה/י להחליף כרטיס?</Text>

                {["איבדתי את הכרטיס", "שודרגתי לכרטיס חדש", "כרטיס פג תוקף בקרוב", "אחר"].map((r) => {
                  const selected = selectedReason === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      onPress={() => setSelectedReason(r)}
                      style={[
                        styles.reasonRow,
                        {
                          borderColor: selected ? theme.primary : isLightBg ? "#E5E7EB" : "#2B2F34",
                          backgroundColor: selected
                            ? isLightBg
                              ? "rgba(14,165,233,0.08)"
                              : "rgba(56,189,248,0.12)"
                            : isLightBg
                            ? "#FFFFFF"
                            : "#1D1F22",
                        },
                      ]}
                      activeOpacity={0.85}
                    >
                      <MaterialIcons
                        name={selected ? "radio-button-checked" : "radio-button-unchecked"}
                        size={18}
                        color={selected ? theme.primary : isLightBg ? "#94A3B8" : "#6B7280"}
                      />
                      <Text style={[styles.reasonText, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>{r}</Text>
                    </TouchableOpacity>
                  );
                })}

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.ghostBtn} onPress={() => setChangeOpen(false)}>
                    <Text style={[styles.ghostBtnText, { color: theme.primary }]}>ביטול</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.primaryBtn,
                      { backgroundColor: selectedReason ? theme.primary : isLightBg ? "#94A3B8" : "#3F3F46" },
                    ]}
                    disabled={!selectedReason}
                    onPress={goNextFromReason}
                  >
                    <Text style={styles.primaryBtnText}>המשך</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === "verify" && (
              <View style={{ gap: 14 }}>
                <Text style={[styles.stepTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>אימות מהיר – מספר טלפון</Text>
                <Text style={[styles.stepHint, { color: isLightBg ? "#6B7280" : "#A4ACB8" }]}>הזינו מספר נייד לקבלת קוד אימות (דמו).</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryViewID : undefined}
                  placeholder="05XXXXXXXX"
                  placeholderTextColor={isLightBg ? "#94A3B8" : "#6B7280"}
                  style={[
                    styles.input,
                    {
                      color: isLightBg ? "#0F172A" : "#E5E7EB",
                      backgroundColor: isLightBg ? "#F8FAFC" : "#17191D",
                      borderColor: phoneError ? "#EF4444" : isLightBg ? "#E5E7EB" : "#2B2F34",
                      textAlign: "left",
                    },
                  ]}
                />
                {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.ghostBtn} onPress={() => setStep("reason")}>
                    <Text style={[styles.ghostBtnText, { color: theme.primary }]}>חזרה</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.primary }]} onPress={goNextFromVerify}>
                    <Text style={styles.primaryBtnText}>אמת והמשך</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === "form" && (
              <View style={{ gap: 14 }}>
                <Text style={[styles.stepTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>פרטי כרטיס חדש</Text>

                <TextInput
                  value={cardNumber}
                  onChangeText={(t) => setCardNumber(t.replace(/[^\d]/g, "").slice(0, 16))}
                  keyboardType="numeric"
                  inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryViewID : undefined}
                  placeholder="מספר כרטיס (16 ספרות)"
                  placeholderTextColor={isLightBg ? "#94A3B8" : "#6B7280"}
                  style={[
                    styles.input,
                    {
                      color: isLightBg ? "#0F172A" : "#E5E7EB",
                      backgroundColor: isLightBg ? "#F8FAFC" : "#17191D",
                      borderColor: isLightBg ? "#E5E7EB" : "#2B2F34",
                      textAlign: "right",
                    },
                  ]}
                />

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TextInput
                    value={expiryMonth}
                    onChangeText={(t) => setExpiryMonth(t.replace(/[^\d]/g, "").slice(0, 2))}
                    keyboardType="numeric"
                    inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryViewID : undefined}
                    placeholder="(MM)"
                    placeholderTextColor={isLightBg ? "#94A3B8" : "#6B7280"}
                    style={[
                      styles.input,
                      styles.inputThird,
                      {
                        color: isLightBg ? "#0F172A" : "#E5E7EB",
                        backgroundColor: isLightBg ? "#F8FAFC" : "#17191D",
                        borderColor: isLightBg ? "#E5E7EB" : "#2B2F34",
                        textAlign: "right",
                      },
                    ]}
                  />
                  <TextInput
                    value={expiryYear}
                    onChangeText={(t) => setExpiryYear(t.replace(/[^\d]/g, "").slice(0, 4))}
                    keyboardType="numeric"
                    inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryViewID : undefined}
                    placeholder="(YYYY)"
                    placeholderTextColor={isLightBg ? "#94A3B8" : "#6B7280"}
                    style={[
                      styles.input,
                      styles.inputThird,
                      {
                        color: isLightBg ? "#0F172A" : "#E5E7EB",
                        backgroundColor: isLightBg ? "#F8FAFC" : "#17191D",
                        borderColor: isLightBg ? "#E5E7EB" : "#2B2F34",
                        textAlign: "right",
                      },
                    ]}
                  />
                  <TextInput
                    value={cvv}
                    onChangeText={(t) => setCvv(t.replace(/[^\d]/g, "").slice(0, 3))}
                    keyboardType="numeric"
                    inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryViewID : undefined}
                    placeholder="CVV (3)"
                    placeholderTextColor={isLightBg ? "#94A3B8" : "#6B7280"}
                    secureTextEntry
                    style={[
                      styles.input,
                      styles.inputThird,
                      {
                        color: isLightBg ? "#0F172A" : "#E5E7EB",
                        backgroundColor: isLightBg ? "#F8FAFC" : "#17191D",
                        borderColor: isLightBg ? "#E5E7EB" : "#2B2F34",
                        textAlign: "right",
                      },
                    ]}
                  />
                </View>

                <TextInput
                  value={idFull}
                  onChangeText={(t) => setIdFull(t.replace(/[^\d]/g, "").slice(0, 9))}
                  keyboardType="numeric"
                  inputAccessoryViewID={Platform.OS === "ios" ? inputAccessoryViewID : undefined}
                  placeholder="מספר תעודת זהות מלא (9 ספרות)"
                  placeholderTextColor={isLightBg ? "#94A3B8" : "#6B7280"}
                  style={[
                    styles.input,
                    {
                      color: isLightBg ? "#0F172A" : "#E5E7EB",
                      backgroundColor: isLightBg ? "#F8FAFC" : "#17191D",
                      borderColor: isLightBg ? "#E5E7EB" : "#2B2F34",
                      textAlign: "right",
                    },
                  ]}
                />

                {formError && <Text style={styles.errorText}>{formError}</Text>}

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.ghostBtn} onPress={() => setStep("verify")}>
                    <Text style={[styles.ghostBtnText, { color: theme.primary }]}>חזרה</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.primary }]} onPress={submitNewCard}>
                    <Text style={styles.primaryBtnText}>שמור והחלף</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === "done" && (
              <View style={{ alignItems: "center", gap: 10, paddingVertical: 12 }}>
                <MaterialIcons name="check-circle" size={46} color="#22C55E" />
                <Text style={[styles.stepTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB", textAlign: "center" }]}>
                  הכרטיס עודכן בהצלחה
                </Text>
                <Text style={[styles.stepHint, { color: isLightBg ? "#6B7280" : "#A4ACB8", textAlign: "center" }]}>
                  העסקאות הבאות ייצברו לנקודות בכרטיס החדש.
                </Text>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.primary }]} onPress={() => setChangeOpen(false)}>
                    <Text style={styles.primaryBtnText}>סגור</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* SEE ALL — full screen modal with finite list */}
      <Modal visible={showAll} animationType="slide" onRequestClose={() => setShowAll(false)}>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
          <View style={[styles.allHeader, { borderBottomColor: isLightBg ? "#E5E7EB" : "#2A2D31" }]}>
            <TouchableOpacity onPress={() => setShowAll(false)} style={styles.allCloseBtn}>
              <MaterialIcons name="arrow-back" size={22} color={isLightBg ? "#0F172A" : "#E5E7EB"} />
            </TouchableOpacity>
            <Text style={[styles.allTitle, { color: isLightBg ? "#0F172A" : "#E5E7EB" }]}>כל היסטוריית הנקודות</Text>
            <View style={{ width: 40 }} />
          </View>

          <FlatList
            data={allHistory}
            keyExtractor={(i) => i.id}
            renderItem={renderHistoryItem}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            contentContainerStyle={{ paddingVertical: 14, paddingBottom: 30 }}
            onEndReachedThreshold={0.2}
            onEndReached={loadMoreAll}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={
              <View style={styles.footerMore}>
                <MaterialIcons
                  name={allPage >= MAX_PAGES - 1 ? "check-circle" : "more-horiz"}
                  size={22}
                  color={isLightBg ? "#9CA3AF" : "#6B7280"}
                />
                <Text style={[styles.footerMoreText, { color: isLightBg ? "#6B7280" : "#A4ACB8" }]}>
                  {allPage >= MAX_PAGES - 1 ? "הצגת כל הפעולות" : "טען עוד פעולות לפי תאריך"}
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      </Modal>

      {/* iOS number pad “Done” bar */}
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              alignItems: "flex-end",
              backgroundColor: isLightBg ? "#F1F5F9" : "#0F172A",
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: isLightBg ? "#E2E8F0" : "#1F2937",
            }}
          >
            <TouchableOpacity onPress={Keyboard.dismiss} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
              <Text style={{ fontWeight: "800", color: isLightBg ? "#0EA5E9" : "#7DD3FC", textAlign: "left" }}>
                סיום
              </Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </SafeAreaView>
  );
}

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Smaller greeting
  headerWrap: { paddingTop: 10, paddingBottom: 10, direction: "rtl", writingDirection: "rtl" },
  greetCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,                // smaller padding
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.25)",
  },
  greetLeft: { gap: 4, direction: "rtl", writingDirection: "rtl" },
  hello: { fontSize: 13, fontWeight: "700", textAlign: "left" }, // a bit smaller
  fullName: { fontSize: 22, fontWeight: "900", textAlign: "left" }, // smaller
  metaSmall: { fontSize: 12, textAlign: "left" },

  // section row (history preview)
  sectionRow: {
    marginTop: 20,
    marginBottom: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    direction: "rtl",
    writingDirection: "rtl",
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", textAlign: "left" },
  linkBtn: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  linkText: { fontSize: 13, fontWeight: "800", textAlign: "left" },

  // history row
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.04)",
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  historyAmount: { fontSize: 15, fontWeight: "800", textAlign: "left" },
  historyLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 12 },
  historyIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  historyTitle: { fontSize: 15, fontWeight: "700", textAlign: "left", direction: "rtl", writingDirection: "rtl" },
  historySub: { fontSize: 12, textAlign: "left", direction: "rtl", writingDirection: "rtl" },

  // list footer
  footerMore: { flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center", marginTop: 16 },
  footerMoreText: { fontSize: 12, textAlign: "left" },

  // bottom manage active card — last section, no top border, tighter spacing
  cardManageWrap: {
    borderTopWidth: 0,           // removed the separation line
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 12,               // ↓ reduced so it's closer to history
  },
  activeCardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  activeLabel: { fontSize: 12, textAlign: "left" },
  activeValue: { fontSize: 16, fontWeight: "800", textAlign: "left" },
  changeBtn: { flexDirection: "row", gap: 6, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12 },
  changeBtnText: { color: "#fff", fontWeight: "800", textAlign: "left" },

  // modal
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: { width: "92%", borderRadius: 18, borderWidth: 1, padding: 18, gap: 14 },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  modalTitle: { fontSize: 16, fontWeight: "900", textAlign: "left", flex: 1 },
  closeX: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  stepTitle: { fontSize: 15, fontWeight: "800", textAlign: "left" },
  stepHint: { fontSize: 12, textAlign: "left" },

  reasonRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  reasonText: { fontSize: 14, fontWeight: "700", textAlign: "left" },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    fontSize: 14,
    textAlign: "left", // ensure placeholders align left in RTL
  },
  inputHalf: { flex: 1 },
  inputThird: { flex: 1 },

  errorText: { color: "#EF4444", fontSize: 12, textAlign: "left" },

  modalActions: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 10, marginTop: 8 },
  ghostBtn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  ghostBtnText: { fontSize: 14, fontWeight: "800", textAlign: "left" },
  primaryBtn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  primaryBtnText: { color: "#fff", fontWeight: "900", fontSize: 14, textAlign: "left" },

  // “See All” header
  allHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  allCloseBtn: { width: 40, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  allTitle: { fontSize: 18, fontWeight: "900", textAlign: "left", flex: 1 },
});
