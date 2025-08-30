// MainPage.tsx
import { InfoModal } from '@/components/Offers/InfoModal';
import { type Offer, OfferCard } from '@/components/Offers/OfferCard';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated, Image,
  Platform,
  SafeAreaView,
  StyleSheet, Text, View
} from 'react-native';

const HEADER_HEIGHT = 200;

export default function MainPage() {
  const y = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Offer | null>(null);

  // header hides fully as you scroll
  const headerTranslateY = y.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = y.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.8],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const openOffer = (offer: Offer) => {
    setSelected(offer);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      {/* Hideable header */}
      <Animated.View
        pointerEvents="none"
        style={[styles.header, { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity }]}
      >
        <LinearGradient colors={['#d50000', '#b71c1c']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.innerHeaderContainer}>
          <View>
            <Text style={styles.greeting}>שלום אנטון</Text>
            <Text style={styles.subtitle}>אוהד הפועל תל אביב</Text>
          </View>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scroller}
        contentContainerStyle={{ paddingBottom: 100 }}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustsScrollIndicatorInsets={false}
        contentOffset={{ x: 0, y: Platform.OS === 'ios' ? 0.5 : 0 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], { useNativeDriver: true })}
        decelerationRate={Platform.OS === 'ios' ? 'normal' : 0.98}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="always"
      >
        <View style={{ height: HEADER_HEIGHT }} />

        {/* Points card */}
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

        {/* Offers */}
        <View style={styles.offers}>
          <Text style={styles.offersTitle}>הצעות מובחרות</Text>
          <OfferCard
            image='https://shop.htafc.co.il/wp-content/uploads/2025/07/hphwl-thl-byb-mwsry-300x300.jpg'
            title="חולצת בית רשמית 2024"
            description="החולצה החדשה של הפועל תל אביב לעונת 2024. איכות פרימיום עם רקמת הלוגו הרשמי."
            expiresAt="31/12"
            points={2500}
            onPress={openOffer}
          />
          <OfferCard
            image='https://www.maxsport.co.il/images/itempics/21055_17092023104752_large.jpg'
            title="צעיף רשמי – חורף"
            description="צעיף אדום-לבן איכותי, מחמם וסטייליסטי ליציע."
            expiresAt="15/01"
            points={1200}
            onPress={openOffer}
          />
          <OfferCard
            image='https://www.htafc.co.il/wp-content/uploads/2024/07/team-logo-hapoel-01.png'
            title="הנחה של 25% על כרטיס משחק"
            description="קוד קופון למשחק בית הקרוב של הפועל."
            expiresAt="30/11"
            points={1000}
            onPress={openOffer}
          />
           <OfferCard
            image='https://ctraining.co.il/wp-content/uploads/2022/07/Layer-7.jpg'
            title="ייעוץ לפני קניית רכב"
            description="זמן טוב לקנות רכב! קבל פגישת ייעוץ אצל שלמה סיקסט "
            expiresAt="30/11"
            points={3750}
            onPress={openOffer}
          />
           <OfferCard
            image='https://www.bwise.co.il/storage/uploads/vendors/63888f676fdc0-1669893991.webp'
            title="200 שקל להשקעה ב IBI"
            description="200 שקל שתוכל להשקיע ולהפקיד בבית ההשקעות IBI."
            expiresAt="30/11"
            points={900}
            onPress={openOffer}
          />
        </View>
      </Animated.ScrollView>

      {/* Bottom Modal */}
      <InfoModal 
        modalVisible={modalVisible} 
        closeModal={closeModal } 
        onDismiss={closeModal}
        selected={selected!}        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },

  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 40,
    zIndex: 1,
    overflow: 'hidden',
  },
  scroller: { flex: 1, zIndex: 5 },

  innerHeaderContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 0,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'left' },
  subtitle: { fontSize: 14, color: '#fff', textAlign: 'left', marginTop: 4 },
  logo: { width: 82, height: 82, marginLeft: 8 },
  card: {
    zIndex: 10,
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
    marginTop: -40,
  },

  cardTitle: { fontSize: 14, color: '#333' },
  points: { fontSize: 44, fontWeight: 'bold', color: '#d50000', marginVertical: 8 },
  growth: { fontSize: 14, color: '#4caf50' },

  offers: { paddingHorizontal: 16, paddingVertical: 20 },
  offersTitle: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 12, textAlign: 'left' },

  progressContainer: { width: '100%', marginTop: 12 },
  progressBar: { height: 10, borderRadius: 6, backgroundColor: '#eee', overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#d50000', borderRadius: 6 },
  progressText: { fontSize: 12, textAlign: 'center', color: '#666' },
    });
