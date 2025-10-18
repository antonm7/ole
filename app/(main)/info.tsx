// app/.../PointsInfoScreen.tsx
import { useClubTheme } from "@/hooks/useClubTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, Text, View } from "react-native";
import pointsSections from "../../assets/text/points";


export default function PointsInfoScreen() {
    const theme = useClubTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background  }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Header */}
        <LinearGradient
          colors={theme.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 56,
            paddingBottom: 32,
            paddingHorizontal: 20,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 8 },
            elevation: 4,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 104,
                height: 104,
                borderRadius: 52,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: "#ffffff55",
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Image
                style={{ width: 92, height: 92, borderRadius: 46 }}
                source={require("../../assets/images/olle.png")}
                resizeMode="cover"
              />
            </View>

            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "800",
                marginBottom: 2,
                textAlign: "center",
              }}
            >
              נקודות דיגיטליות – איך זה עובד?
            </Text>
            <Text
              style={{
                color: "#fff",
                opacity: 0.9,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              צוברים בקניות, מממשים בהטבות – פשוט ומהיר
            </Text>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={{ paddingHorizontal: 16, marginTop: 16, gap: 14 }}>
          {pointsSections.map((section, idx) => (
            <SectionCard key={idx} section={section} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function SectionCard({
  section,
}: {
  section: { title: string; body: string[]; icon?: string };
}) {
  const isRules = section.title.includes("כמות נקודות");
  const theme = useClubTheme();
  return (
    <View
      style={{
        backgroundColor: theme.secondary,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
    >
      {/* Header row */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        {section.icon ? (
          <View
            style={{
              backgroundColor: "#fff1f1",
              borderColor: theme.primary,
              borderWidth: 1,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 999,
              marginRight: 8,
            }}
          >
            <Text style={{ fontSize: 14 }}>{section.icon}</Text>
          </View>
        ) : null}

        <Text
          style={{
            fontSize: 17,
            fontWeight: "800",
            color: theme.primary,
            flexShrink: 1,
            textAlign: "left",
          }}
        >
          {section.title}
        </Text>
      </View>

      {/* Body lines */}
      <View style={{ gap: 6 }}>
        {section.body.map((line, j) => (
          <View key={j} style={{ flexDirection: "row", gap: 6, alignItems: "flex-start" }}>
            <Text style={{ color: theme.primary, marginTop: 3 }}>•</Text>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: "#2b2b2b",
                textAlign: "left",
                flex: 1,
              }}
            >
              {line}
            </Text>
          </View>
        ))}
      </View>

      {/* Soft divider accent */}
      <View
        style={{
          height: 3,
          backgroundColor: "#f4f4f6",
          marginTop: 14,
          borderRadius: 999,
        }}
      />
    </View>
  );
}