// app/(auth)/signin.tsx
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';


import { CreditCardPreview } from '@/components/Special/CreditCardExample';

// ✅ single theme hook for everything (global / club)
import { useClubTheme, useSetClub } from '@/hooks/useClubTheme';

export default function SignInScreen() {
  // Neutral (non-club) palette
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
      console.log(creditCardNumber);
      if(creditCardNumber === '1111 1111 1111 1111') {
        setClub('maccabi-haifa');
      } else {
        setClub('hapoel-tel-aviv');
      };
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
          <Text style={[styles.loginText, { color: g.text }]}>
            התחבר
          </Text>
          <Text style={[styles.loginText, { color: g.icon,fontSize:16 }]}>
            הזן את פרטי האשראי שלך ואת מספר הטלפון
          </Text>
        </View>

        <CreditCardPreview number={creditCardNumber} />

        <View style={styles.form}>
          <TextInput
            value={creditCardNumber}
            onChangeText={(t) => setCreditCardNumber(formatCard(t))}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={g.icon}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric' }) as any}
            textContentType="creditCardNumber"
            maxLength={19}
            style={[
              styles.input,
              {
                borderColor: g.icon,
                color: g.text,
                backgroundColor: Platform.OS === 'ios' ? '#ffffff' : undefined,
              },
            ]}
          />

          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="מספר טלפון"
            placeholderTextColor={g.icon}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            style={[
              styles.input,
              {
                borderColor: g.icon,
                color: g.text,
                backgroundColor: Platform.OS === 'ios' ? '#ffffff' : undefined,
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
                opacity: isSubmitting ? 0.6 : pressed ? 0.85 : 1,
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
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 28 },
  header: { gap: 6 },
  form: { gap: 14 },
  loginText: { textAlign: 'left',fontSize:22 },
  input: {
    textAlign: 'right',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '600' },
});
