import { Asset } from 'expo-asset';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  I18nManager,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CreditCardPreview } from '@/components/Special/CreditCardExample';
import { useSetClub } from '@/hooks/useClubTheme';

const UI = {
  surface: '#F4F5F7',
  title: '#1E293B',
  subtitle: '#6B7280',
  inputBg: '#FFFFFF',
  inputBorder: '#E5E7EB',
  placeholder: '#9CA3AF',
  ctaFrom: '#C94C50',
  ctaTo:   '#B33B3F',
  ctaText: '#FFFFFF',
  tagline: '#FFE8B0',
};

const DURATION = 650;

export default function SignInScreen() {
  const setClub = useSetClub();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);

  // Screen metrics
  const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

  // Final hero height (header) responsive so the form is visible on small screens
  const FINAL_H = Math.max(220, Math.min(300, Math.round(SCREEN_H * 0.28)));

  // Main transition (welcome -> header)
  const progress = useSharedValue(0);

  // Intro choreography
  const logoAppear    = useSharedValue(0); // 0 hidden, 1 visible
  const taglineAppear = useSharedValue(0); // 0 hidden, 1 visible
  const logoIntroUp   = useSharedValue(0); // 0 center, 1 up into header

  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Preload images and run the sequence
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await Asset.loadAsync([
          require('../../assets/images/ole_bg.png'),
          require('../../assets/images/olle.png'),
        ]);
      } catch {}
      if (!mounted) return;
      setAssetsReady(true);

      // t0: logo appear
      logoAppear.value = withTiming(1, { duration: 400 });

      // t0 + 500ms: tagline appear
      timeouts.current.push(
        setTimeout(() => {
          taglineAppear.value = withTiming(1, { duration: 400 });
        }, 500)
      );

      // t0 + 1500ms: move logo+tagline up AND collapse hero to FINAL_H
      timeouts.current.push(
        setTimeout(() => {
          logoIntroUp.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
          progress.value    = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) });
        }, 2500)
      );
    })();

    return () => {
      mounted = false;
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  async function handleSubmit() {
    if (!phoneNumber || !creditCardNumber) {
      Alert.alert('חסר מידע', 'אנא הזן מספר כרטיס אשראי ומספר טלפון.');
      return;
    }
    try {
      setIsSubmitting(true);
      if (creditCardNumber === '1111 1111 1111 1111') setClub('maccabi-haifa');
      else setClub('hapoel-tel-aviv');
      router.replace('/(main)');
    } catch {
      Alert.alert('התחברות נכשלה', 'אנא נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatCard(value: string) {
    const digitsOnly = value.replace(/\D+/g, '').slice(0, 16);
    return digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }

  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  /* -------------------------- Animated styles --------------------------- */

  // Hero container: full-screen -> FINAL_H with rounded bottom
  const heroStyle = useAnimatedStyle(() => {
    const h = interpolate(progress.value, [0, 1], [SCREEN_H, FINAL_H], Extrapolate.CLAMP);
    const radius = interpolate(progress.value, [0, 1], [0, 28]);
    return { height: h, borderBottomLeftRadius: radius, borderBottomRightRadius: radius };
  });

  const initialAnchorY = SCREEN_H * 0.30;
  const finalAnchorY   = FINAL_H * 0.75;  // was 0.60 → lower final position
  const translateDelta = -(initialAnchorY - finalAnchorY);

  // Group (big logo + tagline) moves by that delta and settles slightly smaller
  const groupTranslateY = useAnimatedStyle(() => {
    const ty = interpolate(logoIntroUp.value, [0, 1], [0, translateDelta], Extrapolate.CLAMP);
    const settleScale = interpolate(
      progress.value,
      [0, 0.55, 1],
      [1, 1, 0.7],
      Extrapolate.CLAMP
    ); // hold size, then shrink in the second phase
    return { transform: [{ translateY: ty }, { scale: settleScale }] };
  });

  const logoStyle = useAnimatedStyle(() => ({
    opacity: interpolate(logoAppear.value, [0, 1], [0, 1]),
    transform: [{ translateY: interpolate(logoAppear.value, [0, 1], [10, 0]) }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(taglineAppear.value, [0, 1], [0, 1]),
    transform: [{ translateY: interpolate(taglineAppear.value, [0, 1], [10, 0]) }],
  }));

  // Content (form) reveals after hero collapses most of the way
  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.4, 1], [0, 1]),
    transform: [{ translateY: interpolate(progress.value, [0.4, 1], [20, 0], Extrapolate.CLAMP) }],
  }));

  if (!assetsReady) return <View style={{ flex: 1, backgroundColor: UI.surface }} />;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1, backgroundColor: UI.surface }}
    >
      <View style={[styles.root, { backgroundColor: UI.surface }]}>
        {/* ---------- HERO (full-screen -> header) ---------- */}
        <Animated.View style={[styles.heroWrap, heroStyle]}>
          <ImageBackground
            source={require('../../assets/images/ole_bg.png')}
            resizeMode="cover"
            style={styles.heroImage}
          >
            {/* blur + warm overlay */}
            <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={[
                'rgba(0,0,0,0.35)',
                'rgba(0,0,0,0.15)',
                'rgba(115,17,19,0.25)',
                'rgba(0,0,0,0.0)',
              ]}
              locations={[0, 0.35, 0.7, 1]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* GROUP: big logo + tagline (center -> up, then stays in header) */}
            <Animated.View style={[styles.groupWrap, groupTranslateY]}>
              <Animated.Image
                source={require('../../assets/images/olle.png')}
                style={[
                  {
                    width: SCREEN_W,
                    height: Math.min(SCREEN_H * 0.8, 300),
                  },
                  logoStyle,
                ]}
                resizeMode="contain"
              />
              <Animated.Text style={[styles.tagline, taglineStyle]}>
                The Game Beyond The Game
              </Animated.Text>
            </Animated.View>
          </ImageBackground>
        </Animated.View>

        {/* ---------- CONTENT (header stays above, form below) ---------- */}
        <Animated.View style={[styles.contentArea, contentStyle]}>
          <Text style={styles.headline}>התחבר</Text>
          <Text style={styles.subhead}>הזן מספר כרטיס אשראי שברשותך ומספר טלפון</Text>

          <CreditCardPreview number={creditCardNumber} />
          <View style={styles.form}>
            <TextInput
              value={creditCardNumber}
              onChangeText={(t) => setCreditCardNumber(formatCard(t))}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={UI.placeholder}
              keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric' }) as any}
              textContentType="creditCardNumber"
              maxLength={19}
              style={styles.input}
            />

            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="מספר טלפון"
              placeholderTextColor={UI.placeholder}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              style={styles.input}
            />

            <Pressable
              disabled={isSubmitting}
              onPress={async () => {
                await handleSubmit();
              }}
              style={({ pressed }) => [{ opacity: isSubmitting ? 0.65 : pressed ? 0.92 : 1 }]}
            >
              <LinearGradient
                colors={[UI.ctaFrom, UI.ctaTo]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? 'נכנס...' : 'התחבר'}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

/* --------------------------------- STYLES -------------------------------- */
const styles = StyleSheet.create({
  root: { flex: 1 },

  /* HERO */
  heroWrap: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: UI.surface,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'center',
  },
  groupWrap: {
    position: 'absolute',
    top: '26%', // was '7%' — move closer to vertical center
    alignSelf: 'center',
    alignItems: 'center',
    gap: 6,
  },
  tagline: {
    marginTop: -80,
    fontSize: 18,
    color: UI.tagline,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },

  /* CONTENT BELOW HEADER */
  contentArea: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 14,
    backgroundColor: UI.surface,
  },
  headline: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '800',
    color: UI.title,
    letterSpacing: -0.3,
  },
  subhead: {
    textAlign: 'center',
    fontSize: 14.5,
    color: UI.subtitle,
    marginTop: -2,
    marginBottom: 10,
  },

  form: {
    marginTop: 6,
    gap: 14,
  },
  input: {
    textAlign: 'right',
    backgroundColor: UI.inputBg,
    borderColor: UI.inputBorder,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 17,
    color: UI.title,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  button: {
    marginTop: 10,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
