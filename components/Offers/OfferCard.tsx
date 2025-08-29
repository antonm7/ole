// components/OfferCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    Image,
    View
} from 'react-native';

type OfferCardProps = {
  title: string;
  description: string;
  expiresAt: string;
  points: number;
  image:string;
  onPress?: () => void;
};

export function OfferCard({
  title,
  description,
  expiresAt,
  points,
  image,
  onPress,
}: OfferCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.9 },
      ]}
    >
      <View style={styles.row}>
        {/* Red image placeholder */}
        <View style={styles.thumb}>
          <Image src={image} style={{height:'100%',width:'100%'}}/>
        </View>

        {/* Text content */}
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>

          {/* 👇 Description auto-wraps and grows */}
          <Text style={styles.desc}>{description}</Text>

          {/* Bottom row */}
          <View style={styles.bottomRow}>
            <View style={styles.expiryWrap}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.expiryText}>עד {expiresAt}</Text>
            </View>

            <View style={styles.pointsWrap}>
              <Text style={styles.pointsText}>
                {points.toLocaleString('he-IL')} נקודות
              </Text>
              <Ionicons name="star-outline" size={16} color="#d50000" />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    minHeight: 120, // 👈 ensures a base size, grows if needed
  },
  row: {
    flexDirection: 'row' ,
    alignItems: 'flex-start', // allow content to expand
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  content: {
    flex: 1,
    flexGrow: 1,
    paddingLeft:12
  },
  title: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  desc: {
    textAlign: 'left',
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
    marginBottom: 10,
    flexShrink: 1,
  },
  bottomRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryWrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  expiryText: {
    writingDirection: 'rtl',
    fontSize: 13,
    color: '#6B7280',
  },
  pointsWrap: {
    flexDirection: 'row-reverse' ,
    alignItems: 'center',
    gap: 6,
  },
  pointsText: {
    writingDirection: 'rtl',
    fontSize: 14,
    fontWeight: '700',
    color: '#d50000',
  },
});
