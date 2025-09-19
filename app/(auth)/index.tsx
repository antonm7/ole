// app/(auth)/signin.tsx
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CreditCardPreview } from '@/components/Special/CreditCardExample';
import { useClubTheme, useSetClub } from '@/hooks/useClubTheme';

export default function SignInScreen() {
  const g = useClubTheme({ scope: 'global' });
  const setClub = useSetClub();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!phoneNumber || !creditCardNumber) {
      Alert.alert('Missing info', 'Please enter your phone number and credit card number.');
      return;
    }
    try {
      setIsSubmitting(true);
      if (creditCardNumber === '1111 1111 1111 1111') {
        setClub('maccabi-haifa');
      } else {
        setClub('hapoel-tel-aviv');
      }
      router.replace('/(main)');
    } catch {
      Alert.alert('Sign-in failed', 'Please try again.');
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1, backgroundColor: g.background }}
    >
      <View style={[styles.container, { backgroundColor: g.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: g.text }]}>התחבר</Text>
          <Text style={[styles.subtitle, { color: g.icon }]}>
            הזן את פרטי האשראי שלך ואת מספר הטלפון
          </Text>
        </View>

        <View style={styles.cardWrapper}>
          <CreditCardPreview number={creditCardNumber} />
        </View>

        <View style={styles.form}>
          <TextInput
            value={creditCardNumber}
            onChangeText={(t) => setCreditCardNumber(formatCard(t))}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={g.icon}
            keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric' }) as any}
            textContentType="creditCardNumber"
            maxLength={19}
            style={[
              styles.input,
              {
                borderColor: g.globalButton ?? g.icon,
                color: g.text,
              },
            ]}
          />

          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="מספר טלפון"
            placeholderTextColor={g.icon}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            style={[
              styles.input,
              {
                borderColor: g.globalButton ?? g.icon,
                color: g.text,
              },
            ]}
          />

          <Pressable
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: g.globalButton ?? g.primary,
                opacity: isSubmitting ? 0.6 : pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: g.onPrimary }]}>
              {isSubmitting ? 'נכנס...' : 'התחבר'}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 40,
    justifyContent: 'center',
    gap: 32,
  },
  header: {
    gap: 8,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  cardWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  form: {
    gap: 18,
  },
  input: {
    textAlign: 'right',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 17,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  button: {
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
