// MainPage.tsx
import { OfferCard } from '@/components/Offers/OfferCard';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MainPage() {
  return (
 

    <ScrollView  style={styles.container}
    contentContainerStyle={{paddingBottom:100}}
  >
      {/* Header */}
      <LinearGradient colors={['#d50000', '#b71c1c']} style={styles.header}>
        <SafeAreaView style={styles.innerHeaderContainer}>
            <View>
              <Text style={styles.greeting}>שלום אנטון</Text>
              <Text style={styles.subtitle}>אוהד הפועל תל אביב</Text>
            </View>
            <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </SafeAreaView>
      </LinearGradient>

      {/* Points Card (floating) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⭐ נקודות דיגיטליות</Text>
        <Text style={styles.points}>5,778</Text>
        <Text style={styles.growth}>+250 השבוע</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '75%' }]} />
          </View>
          <Text style={styles.progressText}>עוד 1,250 נקודות לדרגת זהב</Text>
        </View>
      </View>
      <View style={styles.offers}>
        <Text style={styles.offersTitle}>הצעות מובחרות</Text>
        <View>
        <OfferCard
          title="חולצת בית רשמית 2024"
          description="החולצה החדשה של הפועל תל אביב לעונת 2024. איכות פרימיום עם רקמת הלוגו הרשמי."
          expiresAt="31/12"
          points={2500}
          onPress={() => null}
        />
        <OfferCard
          title="חולצת בית רשמית 2024"
          description="החולצה החדשה של הפועל תל אביב לעונת 2024. איכות פרימיום עם רקמת הלוגו הרשמי."
          expiresAt="31/12"
          points={2500}
          onPress={() => null}
        />
         <OfferCard
          title="חולצת בית רשמית 2024"
          description="החולצה החדשה של הפועל תל אביב לעונת 2024. איכות פרימיום עם רקמת הלוגו הרשמי."
          expiresAt="31/12"
          points={2500}
          onPress={() => null}
        />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  innerHeaderContainer : {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
  },
  header: {
    paddingBottom: 60, // extra space for card overlap
    paddingHorizontal: 16,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#fff',textAlign:'left'},
  subtitle: { fontSize: 14, color: '#fff', textAlign: 'left', marginTop: 4 },
  logo: {
    width: 82,
    height: 82,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginTop: -40, // 👈 lifts the card halfway into red background
  },
  cardTitle: { fontSize: 14, color: '#333' },
  points: { fontSize: 44, fontWeight: 'bold', color: '#d50000', marginVertical: 8 },
  growth: { fontSize: 14, color: '#4caf50' },
  offers: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  offersTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
    textAlign: 'left',
  },

  progressContainer: { width: '100%', marginTop: 12 },
  progressBar: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#d50000',
    borderRadius: 6,
  },
  progressText: { fontSize: 12, textAlign: 'center', color: '#666' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    justifyContent: 'space-between',
    marginTop: 20,
  },
  gridItem: {
    width: '48%',
    height: 90,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridText: { marginTop: 8, fontSize: 14, fontWeight: '500', textAlign: 'center' },
});
