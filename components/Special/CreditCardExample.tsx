import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, I18nManager, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

function maskCard(num: string) {
  const base = (num || "").padEnd(19, "•");
  return base.slice(0, 19);
}

/** Brand-aligned palette (Olé) */
const PAL = {
  bg1: "#4C0F12",          // deep burgundy
  bg2: "#1D0708",          // darker burgundy
  textMain: "#F3F0E9",     // soft warm white
  textSub: "rgba(243,240,233,0.85)",
  digits: "#EFE9DC",       // warmer digits
  contact1: "rgba(255,195,106,0.80)", // gold strokes
  contact2: "rgba(255,195,106,0.55)",
  contact3: "rgba(255,195,106,0.30)",
  chipMain: "#E7C77B",     // warm gold chip
  chipStripe: "#C2A657",
};

export function CreditCardPreview({ number }: { number: string }) {
  const display = maskCard(number || "5000 1234 5678 9010");

  const { width } = Dimensions.get("window");
  const cardWidth = width * 0.6;    // ~70% width looks balanced when floating
  const cardHeight = cardWidth / 1.7;

  const RTL = true || I18nManager.isRTL;

  return (
    <View
      style={{
        width: cardWidth,
        height: cardHeight,
        borderRadius: 20,
        overflow: "hidden",
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
      }}
    >
      {/* Surface: subtle diagonal burgundy gradient */}
      <LinearGradient
        colors={[PAL.bg1, PAL.bg2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          padding: cardWidth * 0.05,
          justifyContent: "space-between",
        }}
      >
        {/* Top row */}
        <View
          style={{
            flexDirection: RTL ? "row-reverse" : "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ alignItems: RTL ? "flex-end" : "flex-start" }}>
            <View
              style={{
                flexDirection: RTL ? "row-reverse" : "row",
                alignItems: "baseline",
              }}
            >
              <Text
                style={{
                  color: PAL.textMain,
                  fontSize: cardWidth * 0.06,
                  fontWeight: "900",
                  textTransform: "lowercase",
                  textAlign: RTL ? "right" : "left",
                  writingDirection: RTL ? "rtl" : "ltr",
                }}
              >
                max
              </Text>
              <Text
                style={{
                  color: PAL.textSub,
                  fontSize: cardWidth * 0.058,
                  fontWeight: "400",
                  marginRight: RTL ? 6 : 0,
                  marginLeft: RTL ? 0 : 6,
                  textAlign: RTL ? "right" : "left",
                  writingDirection: RTL ? "rtl" : "ltr",
                }}
              >
                executive
              </Text>
            </View>
          </View>

          {/* Contactless (left in RTL) */}
          <Svg width={cardWidth * 0.07} height={cardWidth * 0.07} viewBox="0 0 26 26">
            <Path d="M8 6c3 3 3 11 0 14" stroke={PAL.contact1} strokeWidth={1.6} fill="none" />
            <Path d="M13 4c4 4 4 14 0 18" stroke={PAL.contact2} strokeWidth={1.6} fill="none" />
            <Path d="M18 2c5 5 5 18 0 23" stroke={PAL.contact3} strokeWidth={1.6} fill="none" />
          </Svg>
        </View>

        {/* Chip */}
        <View style={{ alignItems: 'flex-start', marginBottom: 12, marginTop: 6 }}>
          <Svg width={cardWidth * 0.16} height={cardHeight * 0.2} viewBox="0 0 56 40" style={{ opacity: 0.95 }}>
            <Rect x="0" y="0" width="56" height="40" rx="8" fill={PAL.chipMain} />
            <Rect x="8" y="9" width="40" height="4" rx="2" fill={PAL.chipStripe} />
            <Rect x="8" y="17" width="40" height="4" rx="2" fill={PAL.chipStripe} />
            <Rect x="8" y="25" width="40" height="4" rx="2" fill={PAL.chipStripe} />
          </Svg>
        </View>

        {/* Number */}
        <Text
          style={{
            color: PAL.digits,
            fontSize: cardWidth * 0.055,
            letterSpacing: 3,
            fontVariant: ["tabular-nums"],
            textAlign: RTL ? "right" : "left",
            writingDirection: RTL ? "rtl" : "ltr",
          }}
        >
          {display}
        </Text>

        {/* Bottom row */}
        <View
          style={{
            flexDirection: RTL ? "row-reverse" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 12,
          }}
        >
          <View
            style={{
              flexDirection: RTL ? "row-reverse" : "row",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                color: PAL.textMain,
                fontSize: cardWidth * 0.04,
                fontWeight: "700",
                textAlign: RTL ? "right" : "left",
                writingDirection: RTL ? "rtl" : "ltr",
              }}
            >
              12/24
            </Text>
          </View>

          {/* Mastercard (left in RTL) – keep original brand colors for recognizability */}
          <Svg style={{ marginLeft: -10 }} width={cardWidth * 0.2} height={cardHeight * 0.25} viewBox="0 0 54 36">
            <Circle cx="22" cy="18" r="12" fill="#EB001B" />
            <Circle cx="32" cy="18" r="12" fill="#F79E1B" />
          </Svg>
        </View>
      </LinearGradient>
    </View>
  );
}
