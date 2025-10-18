import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CLUB_LOGOS, OFFER_ASSETS } from "@/constants/OFFER_ASSETS";
import { useClub, useClubTheme } from "@/hooks/useClubTheme";

type TicketOffer = {
  id: string;
  opponent: string;
  opponentShort: string;
  bannerGradient: readonly [string, string];
  date: string;
  time: string;
  venue: string;
  competition: string;
  section: string;
  gate: string;
  price: number;
};

export default function Market() {
  const theme = useClubTheme();
  const club = useClub();
  const assets = OFFER_ASSETS[club];
  const isLight = theme.background === "#FFFFFF";

  const tickets = useMemo<TicketOffer[]>(() => {
    if (club === "hapoel-tel-aviv") {
      return [
        {
          id: "hta-mta",
          opponent: "מכבי תל אביב",
          opponentShort: "מכבי ת\"א",
          bannerGradient: ["#273B6A", "#E6B800"],
          date: "שבת · 28.12",
          time: "19:30",
          venue: "אצטדיון בלומפילד",
          competition: "ליגת העל - מחזור 14",
          section: "שער 5 · בלוק 132 · שורה 11 · מושב 6",
          gate: "שער 5",
          price: 150,
        },
        {
          id: "hta-ashdod",
          opponent: "מ.ס אשדוד",
          opponentShort: "אשדוד",
          bannerGradient: ["#F2B950", "#2D7CC5"],
          date: "רביעי · 08.01",
          time: "20:45",
          venue: "אצטדיון בלומפילד",
          competition: "גביע המדינה - שמינית",
          section: "שער 4 · בלוק 128 · שורה 9 · מושב 18",
          gate: "שער 4",
          price: 80,
        },
        {
          id: "hta-beitar",
          opponent: "בית\"ר ירושלים",
          opponentShort: "בית\"ר",
          bannerGradient: ["#E0C04C", "#2C2C2C"],
          date: "שני · 20.01",
          time: "21:00",
          venue: "אצטדיון בלומפילד",
          competition: "ליגת העל - מחזור 17",
          section: "שער 7 · בלוק 140 · שורה 6 · מושב 4",
          gate: "שער 6-7",
          price: 120,
        },
        {
          id: "hta-haifa-a",
          opponent: "מכבי חיפה",
          opponentShort: "מכבי חיפה",
          bannerGradient: ["#2E9B64", "#0C3F2B"],
          date: "שבת · 01.02",
          time: "20:30",
          venue: "אצטדיון בלומפילד",
          competition: "ליגת העל - מחזור 20",
          section: "שער 8 · בלוק 144 · שורה 10 · מושב 19",
          gate: "שער 12",
          price: 140,
        },
        {
          id: "hta-haifa-b",
          opponent: "מכבי חיפה",
          opponentShort: "מכבי חיפה",
          bannerGradient: ["#2E9B64", "#0A2E1F"],
          date: "שבת · 01.02",
          time: "20:30",
          venue: "אצטדיון בלומפילד",
          competition: "ליגת העל - מחזור 20",
          section: "שער 10 · בלוק 256 · שורה 6 · מושב 7",
          gate: "שער 13",
          price: 130,
        },
      ];
    }

    return [
      {
        id: "mh-haifa-netanya",
        opponent: "מכבי נתניה",
        opponentShort: "נתניה",
        bannerGradient: ["#F5C84C", "#1F2E44"],
        date: "ראשון · 29.12",
        time: "20:15",
        venue: "אצטדיון סמי עופר",
        competition: "ליגת העל - מחזור 14",
        section: "שער 11 · בלוק 207 · שורה 14 · מושב 10",
        gate: "צפוני",
        price: 80,
      },
      {
        id: "mh-haifa-ashdod",
        opponent: "מ.ס אשדוד",
        opponentShort: "אשדוד",
        bannerGradient: ["#F2B950", "#2D7CC5"],
        date: "חמישי · 09.01",
        time: "19:45",
        venue: "אצטדיון סמי עופר",
        competition: "גביע המדינה - שמינית",
        section: "שער 9 · בלוק 303 · שורה 8 · מושב 21",
        gate: "מזרחי",
        price: 80,
      },
      {
        id: "mh-haifa-beer-sheva",
        opponent: "הפועל באר שבע",
        opponentShort: "באר שבע",
        bannerGradient: ["#C94454", "#6A2230"],
        date: "שבת · 25.01",
        time: "19:00",
        venue: "אצטדיון סמי עופר",
        competition: "ליגת העל - מחזור 18",
        section: "שער 6 · בלוק 118 · שורה 5 · מושב 13",
        gate: "דרומי",
        price: 150,
      },
      {
        id: "mh-haifa-hapoel-a",
        opponent: "הפועל תל אביב",
        opponentShort: "הפועל ת\"א",
        bannerGradient: ["#D52F26", "#6D1313"],
        date: "שלישי · 04.02",
        time: "21:00",
        venue: "אצטדיון סמי עופר",
        competition: "ליגת העל - מחזור 20",
        section: "שער 4 · בלוק 109 · שורה 11 · מושב 20",
        gate: "משפחות",
        price: 140,
      },
      {
        id: "mh-haifa-hapoel-b",
        opponent: "הפועל תל אביב",
        opponentShort: "הפועל ת\"א",
        bannerGradient: ["#C41F1F", "#3A1010"],
        date: "שלישי · 04.02",
        time: "21:00",
        venue: "אצטדיון סמי עופר",
        competition: "ליגת העל - מחזור 20",
        section: "שער 6 · בלוק 204 · שורה 9 · מושב 5",
        gate: "צפוני",
        price: 120,
      },
    ];
  }, [club]);

  const [priceFilter, setPriceFilter] = useState<"all" | "under100" | "above100">("all");
  const [gateFilter, setGateFilter] = useState<"all" | string>("all");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const priceOptions: Array<{ value: "all" | "under100" | "above100"; label: string }> = [
    { value: "all", label: "כל המחירים" },
    { value: "under100", label: "עד ₪100" },
    { value: "above100", label: "₪100-₪160" },
  ];

  const gateOptions = useMemo(
    () =>
      club === "hapoel-tel-aviv"
        ? ["שער 5", "שער 4", "שער 6-7", "שער 12", "שער 13"]
        : ["צפוני", "מזרחי", "דרומי", "משפחות"],
    [club]
  );

  useEffect(() => {
    setGateFilter("all");
    setPriceFilter("all");
  }, [club]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const passesPrice =
        priceFilter === "all"
          ? true
          : priceFilter === "under100"
          ? ticket.price <= 100
          : ticket.price > 100;

      const passesGate = gateFilter === "all" ? true : ticket.gate === gateFilter;

      return passesPrice && passesGate;
    });
  }, [tickets, priceFilter, gateFilter]);

  const listHeader = (
    <>
      <View style={styles.heroWrapper}>
        <ImageBackground
          source={assets.stadium}
          style={styles.heroImage}
          resizeMode="cover"
          imageStyle={styles.heroImageInner}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.65)", "rgba(0,0,0,0.25)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <Image source={CLUB_LOGOS[club]} style={styles.heroLogo} resizeMode="contain" />
              <View style={styles.heroTextGroup}>
                <Text style={styles.heroTitle}>שוק הכרטיסים</Text>
                <Text style={styles.heroSubtitle}>בחרו את המשחק הקרוב ורכשו כרטיס תוך רגע</Text>
              </View>
            </View>
            <LinearGradient
              colors={theme.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCTA}
            >
              <MaterialIcons name="local-activity" size={22} color={theme.onPrimary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.heroCTATitle, { color: theme.onPrimary }]}>
                  כרטיס דיגיטלי כולל QR מיידי
                </Text>
                <Text style={[styles.heroCTAText, { color: theme.onPrimary }]}>
                  הכניסה ליציע בלחיצת כפתור אחת
                </Text>
              </View>
            </LinearGradient>
          </View>
        </ImageBackground>
      </View>

      <View
        style={[
          styles.infoBanner,
          {
            backgroundColor: isLight ? "#F1F5F9" : "rgba(148, 163, 184, 0.12)",
            borderColor: isLight ? "#E2E8F0" : "rgba(148,163,184,0.25)",
          },
        ]}
      >
        <MaterialIcons
          name="info"
          size={20}
          color={isLight ? theme.primary : theme.tint}
          style={{ marginLeft: 8 }}
        />
        <Text
          style={[
            styles.infoBannerText,
            { color: isLight ? "#1E293B" : "#E2E8F0" },
          ]}
        >
          {`זהו ריסייל – אתם רוכשים כרטיסים מאוהדים אחרים, והכרטיס מגיע אליכם דיגיטלית מיד לאחר הרכישה.`}
        </Text>
      </View>

      <View
        style={[
          styles.filtersContainer,
          {
            backgroundColor: isLight ? "#FFFFFF" : "rgba(148,163,184,0.08)",
            borderColor: isLight ? "#E5E7EB" : "rgba(148,163,184,0.2)",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.filterHeader}
          activeOpacity={0.85}
          onPress={() => setFiltersOpen((prev) => !prev)}
        >
          <View style={styles.filterHeaderLeft}>
            <MaterialIcons name="tune" size={18} color={isLight ? theme.primary : theme.tint} />
            <Text style={[styles.filterHeaderText, { color: isLight ? "#0F172A" : "#E2E8F0" }]}>
              סינון מתקדם
            </Text>
          </View>
          <MaterialIcons
            name={filtersOpen ? "expand-less" : "expand-more"}
            size={22}
            color={isLight ? "#475569" : "#CBD5F5"}
          />
        </TouchableOpacity>

        {filtersOpen ? (
          <View style={styles.filterBody}>
            <View style={styles.filterGroup}>
              <Text style={[styles.filterLabel, { color: isLight ? "#0F172A" : "#E2E8F0" }]}>מחיר</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsRow}
              >
                {priceOptions.map((option, index) => {
                  const active = priceFilter === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.filterChip,
                        {
                          marginLeft: index === 0 ? 0 : 10,
                          backgroundColor: active
                            ? isLight
                              ? `${theme.primary}12`
                              : `${theme.primary}33`
                            : isLight
                            ? "#F8FAFC"
                            : "rgba(148,163,184,0.12)",
                          borderColor: active ? theme.primary : "transparent",
                        },
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setPriceFilter(option.value)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          { color: active ? theme.primary : isLight ? "#1F2937" : "#CBD5F5" },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={[styles.filterGroup, { marginTop: 16 }]}>
              <Text style={[styles.filterLabel, { color: isLight ? "#0F172A" : "#E2E8F0" }]}>שער</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterChipsRow}
              >
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    {
                      marginLeft: 0,
                      backgroundColor:
                        gateFilter === "all"
                          ? isLight
                            ? `${theme.primary}12`
                            : `${theme.primary}33`
                          : isLight
                          ? "#F8FAFC"
                          : "rgba(148,163,184,0.12)",
                      borderColor: gateFilter === "all" ? theme.primary : "transparent",
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setGateFilter("all")}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: gateFilter === "all" ? theme.primary : isLight ? "#1F2937" : "#CBD5F5" },
                    ]}
                  >
                    כל השערים
                  </Text>
                </TouchableOpacity>

                {gateOptions.map((gate) => {
                  const active = gateFilter === gate;
                  return (
                    <TouchableOpacity
                      key={gate}
                      style={[
                        styles.filterChip,
                        {
                          marginLeft: 10,
                          backgroundColor: active
                            ? isLight
                              ? `${theme.primary}12`
                              : `${theme.primary}33`
                            : isLight
                            ? "#F8FAFC"
                            : "rgba(148,163,184,0.12)",
                          borderColor: active ? theme.primary : "transparent",
                        },
                      ]}
                      activeOpacity={0.85}
                      onPress={() => setGateFilter(gate)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          { color: active ? theme.primary : isLight ? "#1F2937" : "#CBD5F5" },
                        ]}
                      >
                        {gate}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>כרטיסים זמינים לרכישה</Text>
      </View>
    </>
  );

  const renderTicket = ({ item }: { item: TicketOffer }) => (
    <View
      style={[
        styles.ticketWrapper,
        {
          shadowOpacity: isLight ? 0.12 : 0.32,
          elevation: isLight ? 2 : 6,
        },
      ]}
    >
      <View
        style={[
          styles.ticketCard,
          {
            backgroundColor: isLight ? "#FFFFFF" : "rgba(16,18,22,0.9)",
            borderColor: isLight ? "#E5E7EB" : "rgba(148,163,184,0.45)",
          },
        ]}
      >
        <LinearGradient
          colors={item.bannerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ticketBanner}
        >
          <View style={styles.bannerRow}>
            <Text style={styles.bannerCompetition}>{item.competition}</Text>
            <Text style={styles.bannerVs}>VS {item.opponentShort}</Text>
          </View>
        </LinearGradient>

        <View style={styles.ticketContent}>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="event"
              size={18}
              color={isLight ? "#1F2937" : "#F8FAFC"}
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: theme.text }]}>
              {item.date} · {item.time}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons
              name="place"
              size={18}
              color={isLight ? "#1F2937" : "#F8FAFC"}
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: theme.text }]}>{item.venue}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons
              name="confirmation-number"
              size={18}
              color={isLight ? "#1F2937" : "#F8FAFC"}
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: theme.text }]}>{item.section}</Text>
          </View>

          <View style={styles.ticketFooter}>
            <View>
              <Text style={[styles.priceLabel, { color: isLight ? "#64748B" : "#CBD5F5" }]}>
                מחיר כרטיס
              </Text>
              <Text style={[styles.priceValue, { color: theme.primary }]}>
                ₪{item.price.toLocaleString("he-IL")}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.buyButton, { backgroundColor: theme.primary }]}
              activeOpacity={0.9}
            >
              <MaterialIcons name="shopping-cart" size={18} color={theme.onPrimary} />
              <Text style={[styles.buyText, { color: theme.onPrimary }]}>רכישת כרטיס</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={filteredTickets}
      keyExtractor={(item) => item.id}
      renderItem={renderTicket}
      ListHeaderComponent={listHeader}
      ListFooterComponent={<View style={{ height: 40 }} />}
      contentContainerStyle={{ paddingBottom: 32 }}
      style={{ flex: 1, backgroundColor: isLight ? theme.background : "#0f1114" }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  heroWrapper: { marginBottom: 24 },
  heroImage: { height: 240, justifyContent: "flex-end" },
  heroImageInner: { borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroContent: { paddingHorizontal: 20, paddingBottom: 26, rowGap: 18 },
  heroHeader: { flexDirection: "row", alignItems: "center", columnGap: 16 },
  heroLogo: { width: 68, height: 68 },
  heroTextGroup: { flex: 1, flexShrink: 1 },
  heroTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "800", textAlign: "left" },
  heroSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
    lineHeight: 18,
  },
  heroCTA: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  heroCTATitle: { fontSize: 16, fontWeight: "700", textAlign: "left" },
  heroCTAText: { fontSize: 13, opacity: 0.85, marginTop: 2, textAlign: "left" },
  infoBanner: {
    marginHorizontal: 20,
    marginBottom: 18,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    columnGap: 10,
  },
  infoBannerText: { fontSize: 13, flex: 1, textAlign: "left", lineHeight: 18, fontWeight: "600" },
  filtersContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterHeaderLeft: { flexDirection: "row", alignItems: "center", columnGap: 8 },
  filterHeaderText: { fontSize: 14, fontWeight: "800" },
  filterBody: { marginTop: 16 },
  filterGroup: {},
  filterLabel: { fontSize: 13, fontWeight: "700", marginBottom: 10, textAlign: "left" },
  filterChipsRow: { flexDirection: "row", alignItems: "center", columnGap: 10, paddingRight: 8 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterChipText: { fontSize: 13, fontWeight: "700" },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "800", textAlign: "left" },
  sectionSubtitle: { fontSize: 14, textAlign: "left" },
  ticketWrapper: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
  },
  ticketCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    overflow: "hidden",
  },
  ticketBanner: { paddingHorizontal: 18, paddingVertical: 12 },
  bannerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bannerCompetition: { color: "#FFFFFF", fontWeight: "700", fontSize: 12, letterSpacing: 0.5 },
  bannerVs: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  ticketContent: { paddingHorizontal: 20, paddingVertical: 18, rowGap: 12 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoIcon: { marginRight: 12 },
  infoText: { fontSize: 14, fontWeight: "600", textAlign: "left", flex: 1 },
  ticketFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  priceLabel: { fontSize: 12, fontWeight: "600", textAlign: "left" },
  priceValue: { fontSize: 24, fontWeight: "800", marginTop: 2, textAlign: "left" },
  buyButton: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buyText: { fontSize: 14, fontWeight: "700", textAlign: "left" },
});
