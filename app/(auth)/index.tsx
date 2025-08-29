// app/(auth)/signin.tsx
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View, Alert, I18nManager } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CreditCardPreview } from '@/components/Special/CreditCardExample';

export default function SignInScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const globalButton = useThemeColor({}, 'globalButton');
  const text = useThemeColor({}, 'text');
  const icon = useThemeColor({}, 'icon');

  async function handleSubmit() {
    if (!phoneNumber || !creditCardNumber) {
      Alert.alert('Missing info', 'Please enter your phone number and credit card number.');
      return;
    }
    try {
      setIsSubmitting(true);

      // TODO: call your backend, verify, then persist a token (SecureStore)
      // await SecureStore.setItemAsync('token', jwt)

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
  },[])

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.header} >
          <ThemedText type="title" style={styles.loginText}>התחבר</ThemedText>
          <ThemedText style={styles.loginText}>הזן את פרטי האשראי שלך ואת מספר הטלפון</ThemedText>
        </View>
        <CreditCardPreview number={creditCardNumber} />
        <View style={styles.form}>
          <TextInput
            value={creditCardNumber}
            onChangeText={(t) => setCreditCardNumber(formatCard(t))}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={icon}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={Platform.select({ ios: 'number-pad', android: 'numeric' }) as any}
            textContentType="creditCardNumber"
            maxLength={19}
            style={[styles.input, { borderColor: icon, color: text }]}
          />
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="מספר טלפון"
            placeholderTextColor={icon}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            style={[styles.input, { borderColor: icon, color: text }]}
          />

          <Pressable
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: globalButton, opacity: isSubmitting ? 0.6 : pressed ? 0.85 : 1 },
            ]}
          >
            <ThemedText style={styles.buttonText}>{isSubmitting ? 'נכנס...' : 'התחבר'}</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 28 },
  header: { gap: 6},
  form: { gap: 14 },
  loginText: {
    textAlign:'left'
  },
  input: {
    textAlign:'right',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: { borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
