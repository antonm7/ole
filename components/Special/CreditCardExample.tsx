import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, I18nManager, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

function maskCard(num: string) {
  const base = (num || "").padEnd(19, "•");
  return base.slice(0, 19);
}

export function CreditCardPreview({ number }: { number: string }) {
  const display = maskCard(number || "5000 1234 5678 9010");

  // screen width
  const { width } = Dimensions.get("window");
  // card width = ~90% of screen
  const cardWidth = width * 0.8;
  // standard credit card ratio ~1.586:1 (width:height)
  const cardHeight = cardWidth / 1.7;

  // App is Hebrew-only (fixed RTL)
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
      {/* Card surface */}
      <LinearGradient
        colors={["#0D0E10", "#1A1C1E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          padding: cardWidth * 0.05,
          justifyContent: "space-between",
        }}
      >
        {/* Top row (brand on the right, contactless on the left) */}
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
                  color: "#EDEEF0",
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
                  color: "#EDEEF0",
                  fontSize: cardWidth * 0.06,
                  fontWeight: "400",
                  // swap margins for RTL
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

          {/* Contactless (left side in RTL) */}
          <Svg width={cardWidth * 0.07} height={cardWidth * 0.07} viewBox="0 0 26 26">
            <Path d="M8 6c3 3 3 11 0 14" stroke="rgba(255,255,255,0.75)" strokeWidth={1.6} fill="none" />
            <Path d="M13 4c4 4 4 14 0 18" stroke="rgba(255,255,255,0.5)" strokeWidth={1.6} fill="none" />
            <Path d="M18 2c5 5 5 18 0 23" stroke="rgba(255,255,255,0.25)" strokeWidth={1.6} fill="none" />
          </Svg>
        </View>

        {/* Chip */}
        <View
          style={{
            alignItems: 'flex-start',
            marginBottom:12,
            marginTop:6
          }}
        >
          <Svg width={cardWidth * 0.16} height={cardHeight * 0.2} viewBox="0 0 56 40" style={{ opacity: 0.9 }}>
            <Rect x="0" y="0" width="56" height="40" rx="8" fill="#D9C173" />
            <Rect x="8" y="9" width="40" height="4" rx="2" fill="#B39B52" />
            <Rect x="8" y="17" width="40" height="4" rx="2" fill="#B39B52" />
            <Rect x="8" y="25" width="40" height="4" rx="2" fill="#B39B52" />
          </Svg>
        </View>

        {/* Card Number */}
        <Text
          style={{
            color: "#C7C9CC",
            fontSize: cardWidth * 0.055,
            letterSpacing: 3,
            fontVariant: ["tabular-nums"],
            textAlign: RTL ? "right" : "left",
            writingDirection: RTL ? "rtl" : "ltr",
          }}
        >
          {display}
        </Text>

        {/* Bottom row (expiry on the right, Mastercard on the left) */}
        <View
          style={{
            flexDirection: RTL ? "row-reverse" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop:12,
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
                color: "#EDEEF0",
                fontSize: cardWidth * 0.04,
                fontWeight: "700",
                textAlign: RTL ? "right" : "left",
                writingDirection: RTL ? "rtl" : "ltr",
              }}
            >
              12/24
            </Text>
          </View>

          {/* Mastercard (left side in RTL) */}
          <Svg style={{marginLeft:-10}} width={cardWidth * 0.2} height={cardHeight * 0.25} viewBox="0 0 54 36">
            <Circle cx="22" cy="18" r="12" fill="#EB001B" />
            <Circle cx="32" cy="18" r="12" fill="#F79E1B" />
          </Svg>
        </View>
      </LinearGradient>
    </View>
  );
}
