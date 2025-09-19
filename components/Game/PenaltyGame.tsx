import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");

// Layout constants
const FIELD_SIDE_PADDING = 16;
const GOAL_WIDTH = Math.min(width * 0.82, 360);
const GOAL_HEIGHT = 140;
const GOAL_TOP = 90;
const GOAL_LEFT = (width - GOAL_WIDTH) / 2;
const GOAL_RIGHT = GOAL_LEFT + GOAL_WIDTH;

const BALL_SIZE = 46;
const BALL_START_Y = Math.min(height * 0.78, GOAL_TOP + 320);
const BALL_START_X = width / 2 - BALL_SIZE / 2;

const GLOVES_WIDTH = 140;  // width across both gloves
const GLOVES_HEIGHT = 70;
const GLOVES_TOP = GOAL_TOP + 10;
const GLOVE_BLOCK_PADDING = 10; // how “thick” the save box feels

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function PenaltyModal({ visible, onClose }: Props) {
  // Message + score
  const [message, setMessage] = useState("החלק את הכדור כלפי מעלה כדי לבעוט");
  const [score, setScore] = useState({ goals: 0, saves: 0, missed: 0 });

  // Ball animated values
  const ballX = useRef(new Animated.Value(BALL_START_X)).current;
  const ballY = useRef(new Animated.Value(BALL_START_Y)).current;
  const ballRotate = useRef(new Animated.Value(0)).current;
  const ballScale = useRef(new Animated.Value(1)).current;

  // Snapshots (JS side) for collision & math
  const ballXVal = useRef(BALL_START_X);
  const ballYVal = useRef(BALL_START_Y);
  useEffect(() => {
    const s1 = ballX.addListener(({ value }) => (ballXVal.current = value));
    const s2 = ballY.addListener(({ value }) => (ballYVal.current = value));
    return () => {
      ballX.removeListener(s1);
      ballY.removeListener(s2);
    };
  }, [ballX, ballY]);

  // Keeper animation (smooth ping-pong, no jump)
  const keeperX = useRef(new Animated.Value(GOAL_LEFT + (GOAL_WIDTH - GLOVES_WIDTH) / 2)).current;
  const keeperXVal = useRef(GOAL_LEFT + (GOAL_WIDTH - GLOVES_WIDTH) / 2);
  useEffect(() => {
    const sub = keeperX.addListener(({ value }) => (keeperXVal.current = value));
    return () => keeperX.removeListener(sub);
  }, [keeperX]);

  useEffect(() => {
    const leftBound = GOAL_LEFT + 4;
    const rightBound = GOAL_RIGHT - GLOVES_WIDTH - 4;
    keeperX.setValue(leftBound); // start at the left-most edge

    Animated.loop(
      Animated.sequence([
        Animated.timing(keeperX, {
          toValue: rightBound,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(keeperX, {
          toValue: leftBound,
          duration: 1400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // Reset ball to start
  const resetBall = () => {
    ballX.setValue(BALL_START_X);
    ballY.setValue(BALL_START_Y);
    ballRotate.setValue(0);
    ballScale.setValue(1);
    setMessage("החלק את הכדור כלפי מעלה כדי לבעוט");
  };

  // Simple goal area check (inside posts & under crossbar)
  const isInsideGoalMouth = (xCenter: number, y: number) => {
    const insideX = xCenter >= GOAL_LEFT + 8 && xCenter <= GOAL_RIGHT - 8;
    const insideY = y <= GOAL_TOP + GOAL_HEIGHT - 8; // should pass into goal space
    return insideX && insideY;
  };

  // Collision with gloves: if ball center overlaps keeper gloves box at goal line
  const isSavedByKeeper = (xCenterAtGoal: number) => {
    const kLeft = keeperXVal.current - GLOVE_BLOCK_PADDING;
    const kRight = keeperXVal.current + GLOVES_WIDTH + GLOVE_BLOCK_PADDING;
    return xCenterAtGoal >= kLeft && xCenterAtGoal <= kRight;
  };

  // Animate the ball on swipe release
  const shoot = (dx: number, dy: number) => {
    // Require upward swipe
    if (dy > -12) {
      setMessage("בעיטה חלשה מדי — גרור למעלה חזק יותר");
      return;
    }

    // Power from swipe length (only y matters for power). Clamp duration.
    const power = Math.min(1, Math.max(0.3, Math.abs(dy) / 280));
    const duration = 900 - power * 350; // faster shot for stronger swipe
    const arcHeight = 48 + power * 24;  // vertical arc “dip”

    // Target position: clamp X inside posts, Y into the goal area
    const targetX = clamp(
      BALL_START_X + dx * 1.1, // X moves with finger (no inversion)
      GOAL_LEFT + 10,
      GOAL_RIGHT - BALL_SIZE - 10
    );
    const targetY = GOAL_TOP + 28; // penetrate the goal mouth a bit

    // Animate X/Y
    Animated.parallel([
      // X follows an ease-in-out curve
      Animated.timing(ballX, {
        toValue: targetX,
        duration,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }),
      // Y travels upward with gentle ease, then we add a tiny arc “dip” using scale
      Animated.timing(ballY, {
        toValue: targetY,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      // Subtle spin
      Animated.timing(ballRotate, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      // Slight size change mid-flight to fake depth
      Animated.sequence([
        Animated.timing(ballScale, {
          toValue: 0.92,
          duration: duration * 0.5,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(ballScale, {
          toValue: 1.0,
          duration: duration * 0.5,
          easing: Easing.in(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => {
      // Ball reached the goal line → decide result
      const xCenter = ballXVal.current + BALL_SIZE / 2;
      const yNow = ballYVal.current;

      if (!isInsideGoalMouth(xCenter, yNow)) {
        setMessage("מחוץ למסגרת!");
        setScore((s) => ({ ...s, missed: s.missed + 1 }));
      } else if (isSavedByKeeper(xCenter)) {
        setMessage("הצלה! 🧤");
        setScore((s) => ({ ...s, saves: s.saves + 1 }));
      } else {
        setMessage("גול! ⚽️");
        setScore((s) => ({ ...s, goals: s.goals + 1 }));
      }

      setTimeout(resetBall, 900);
    });

    // Tiny “arc” jiggle on Y using keyframe kick (visual polish)
    Animated.sequence([
      Animated.timing(ballY, {
        toValue: targetY + arcHeight,
        duration: duration * 0.4,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
      Animated.timing(ballY, {
        toValue: targetY,
        duration: duration * 0.6,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  };

  // PanResponder: only track a swipe from the ball start area (loosely)
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, g) => {
        // only if touch starts near the ball
        return (
          g.y0 > BALL_START_Y - 60 &&
          g.y0 < BALL_START_Y + 80 &&
          g.x0 > BALL_START_X - 80 &&
          g.x0 < BALL_START_X + 120
        );
      },
      onPanResponderRelease: (_, g) => {
        shoot(g.dx, g.dy);
      },
    })
  ).current;

  // Ball rotate interpolation
  const rotate = ballRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "540deg"],
  });

  // Close handler (Android has no swipe-to-dismiss)
  const handleClose = () => {
    resetBall();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={Platform.OS !== "ios"}
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "overFullScreen"}
      onRequestClose={handleClose}
    >
      {Platform.OS === "ios" ? (
        <SafeAreaView style={styles.modalRoot}>
          {/* Handle */}
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          {/* Scoreboard */}
          <View style={styles.scoreRow}>
            <Stat label="גולים" value={score.goals} />
            <Stat label="הצלות" value={score.saves} />
            <Stat label="מחוץ" value={score.missed} />
          </View>

          {/* Field */}
          <View style={styles.field}>

            {/* Penalty spot + box lines */}
            <View style={styles.boxTopLine} />
            <View style={styles.penaltySpot} />

            {/* Goal frame */}
            <View style={styles.goalFrame}>
              {/* Crossbar + posts already from border; add net grid */}
              <GoalNet />
            </View>

            {/* Keeper gloves */}
            <Animated.View
              style={[
                styles.keeper,
                { left: keeperX, top: GLOVES_TOP, width: GLOVES_WIDTH, height: GLOVES_HEIGHT },
              ]}
            >
              <Text style={styles.gloveEmoji}>🧤</Text>
              <Text style={[styles.gloveEmoji, { transform: [{ scaleX: -1 }] }]}>🧤</Text>
            </Animated.View>

            {/* Ball */}
            <Animated.View
              {...pan.panHandlers}
              style={[
                styles.ball,
                {
                  left: ballX,
                  top: ballY,
                  transform: [{ rotate }, { scale: ballScale }],
                },
              ]}
            >
              <Text style={styles.ballEmoji}>⚽️</Text>
            </Animated.View>
          </View>

          {/* Message */}
          <Text style={styles.banner}>{message}</Text>

          {/* Close on iOS (still can swipe sheet down, but keep a fallback) */}
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeText}>סגור</Text>
          </Pressable>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.androidSheet}>
          <View style={styles.sheetBody}>
            {/* Scoreboard */}
            <View style={styles.scoreRow}>
              <Stat label="גולים" value={score.goals} />
              <Stat label="הצלות" value={score.saves} />
              <Stat label="מחוץ" value={score.missed} />
            </View>

            {/* Field (same as iOS) */}
            <View style={styles.field}>
              <View style={styles.boxTopLine} />
              <View style={styles.penaltySpot} />

              <View style={styles.goalFrame}>
                <GoalNet />
              </View>

              <Animated.View
                style={[
                  styles.keeper,
                  { left: keeperX, top: GLOVES_TOP, width: GLOVES_WIDTH, height: GLOVES_HEIGHT },
                ]}
              >
                <Text style={styles.gloveEmoji}>🧤</Text>
                <Text style={[styles.gloveEmoji, { transform: [{ scaleX: -1 }] }]}>🧤</Text>
              </Animated.View>

              <Animated.View
                {...pan.panHandlers}
                style={[
                  styles.ball,
                  {
                    left: ballX,
                    top: ballY,
                    transform: [{ rotate }, { scale: ballScale }],
                  },
                ]}
              >
                <Text style={styles.ballEmoji}>⚽️</Text>
              </Animated.View>
            </View>

            <Text style={styles.banner}>{message}</Text>

            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeText}>סגור</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      )}
    </Modal>
  );
}

/** Small stat pill */
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** Goal net drawn as a grid (no external images) */
function GoalNet() {
  const cols = 12;
  const rows = 8;

  const vLines = useMemo(
    () =>
      Array.from({ length: cols + 1 }).map((_, i) => (
        <View
          key={`v${i}`}
          style={[
            StyleSheet.absoluteFill,
            {
              left: (GOAL_WIDTH / cols) * i,
              width: 1,
              backgroundColor: "rgba(255,255,255,0.5)",
            },
          ]}
        />
      )),
    []
  );

  const hLines = useMemo(
    () =>
      Array.from({ length: rows + 1 }).map((_, i) => (
        <View
          key={`h${i}`}
          style={[
            StyleSheet.absoluteFill,
            {
              top: (GOAL_HEIGHT / rows) * i,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.5)",
            },
          ]}
        />
      )),
    []
  );

  return (
    <View style={styles.net}>
      {vLines}
      {hLines}
    </View>
  );
}

// Helpers
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, backgroundColor: "#0E1013" },
  handleWrap: { alignItems: "center", paddingTop: 10, paddingBottom: 6 },
  handle: {
    width: 46,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#2A2E33",
  },

  androidSheet: { flex: 1, justifyContent: "flex-end", backgroundColor: "#0E1013" },
  sheetBody: {
    backgroundColor: "#0E1013",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },

  scoreRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-evenly",
    paddingHorizontal: 16,
    marginTop: 4,
  },
  stat: {
    backgroundColor: "#15181D",
    borderColor: "#252A31",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 82,
  },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "800" },
  statLabel: { color: "#9FA7B2", fontSize: 12, marginTop: 2 },

  field: {
    marginTop: 8,
    marginHorizontal: FIELD_SIDE_PADDING,
    height: Math.max(420, height * 0.58),
    borderRadius: 18,
    backgroundColor: "#0F7A2A",
    overflow: "hidden",
    justifyContent: "flex-start",
  },

  // penalty box top line
  boxTopLine: {
    position: "absolute",
    top: GOAL_TOP + GOAL_HEIGHT + 8,
    left: GOAL_LEFT,
    width: GOAL_WIDTH,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },

  penaltySpot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white",
    top: BALL_START_Y - 12,
    left: width / 2 - 4,
  },

  goalFrame: {
    position: "absolute",
    top: GOAL_TOP,
    left: GOAL_LEFT,
    width: GOAL_WIDTH,
    height: GOAL_HEIGHT,
    borderWidth: 5,
    borderColor: "#F8F8F8",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  net: {
    ...StyleSheet.absoluteFillObject,
  },

  keeper: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  gloveEmoji: {
    fontSize: 50,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  ball: {
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ballEmoji: {
    fontSize: BALL_SIZE - 2,
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },

  banner: {
    textAlign: "center",
    color: "#F5F7FA",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },

  closeBtn: {
    alignSelf: "center",
    marginTop: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#1B1F25",
    borderColor: "#2A313B",
    borderWidth: 1,
    borderRadius: 12,
  },
  closeText: { color: "#E6E9EE", fontWeight: "700" },
});
