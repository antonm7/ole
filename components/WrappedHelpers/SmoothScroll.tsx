import React, { memo, useRef } from "react";
import { Animated, Platform } from "react-native";

const TopSmoothScroll = memo(function TopSmoothScroll({
  children,
}: { children: React.ReactNode }) {
  const y = useRef(new Animated.Value(0)).current;

  return (
    <Animated.ScrollView
      // ↓ avoid reflow jitter at the very top
      contentInsetAdjustmentBehavior="never"
      automaticallyAdjustContentInsets={false}
      automaticallyAdjustsScrollIndicatorInsets={false}

      // ↓ tiny offset avoids iOS “snap” when hitting y=0
      contentOffset={{ x: 0, y: Platform.OS === "ios" ? 0.5 : 0 }}

      // ↓ keep events light & consistent
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y } } }],
        { useNativeDriver: true }
      )}

      // ↓ tune physics
      decelerationRate={Platform.OS === "ios" ? "normal" : 0.98}
      // if you dislike rubber-band at top, uncomment these:
      // bounces={false}
      // alwaysBounceVertical={false}

      // ↓ perf on long content
      removeClippedSubviews={true}
      overScrollMode="always" // "never" on Android if you don’t want glow
      showsVerticalScrollIndicator={false}
    >
      {children}
    </Animated.ScrollView>
  );
});

export default TopSmoothScroll;
