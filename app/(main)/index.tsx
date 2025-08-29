// MainPage.tsx
import React, { useRef, memo, useState } from 'react';
import {
  Animated, Image, Platform, SafeAreaView, StyleSheet, Text, View,
  Modal, Pressable, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { OfferCard } from '@/components/Offers/OfferCard';

const HEADER_HEIGHT = 200;

type Offer = {
  title: string;
  description: string;
  points: number;
  expiresAt: string;
  image:string;
};

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

          <MemoOffer
            image='https://shop.htafc.co.il/wp-content/uploads/2025/07/hphwl-thl-byb-mwsry-300x300.jpg'
            title="חולצת בית רשמית 2024"
            description="החולצה החדשה של הפועל תל אביב לעונת 2024. איכות פרימיום עם רקמת הלוגו הרשמי."
            expiresAt="31/12"
            points={2500}
            onPress={openOffer}
          />
          <MemoOffer
            image='https://www.maxsport.co.il/images/itempics/21055_17092023104752_large.jpg'
            title="צעיף רשמי – חורף"
            description="צעיף אדום-לבן איכותי, מחמם וסטייליסטי ליציע."
            expiresAt="15/01"
            points={1200}
            onPress={openOffer}
          />
          <MemoOffer
            image='https://www.htafc.co.il/wp-content/uploads/2024/07/team-logo-hapoel-01.png'
            title="הנחה של 25% על כרטיס משחק"
            description="קוד קופון למשחק בית הקרוב של הפועל."
            expiresAt="30/11"
            points={1000}
            onPress={openOffer}
          />
           <MemoOffer
            image='https://ctraining.co.il/wp-content/uploads/2022/07/Layer-7.jpg'
            title="ייעוץ לפני קניית רכב"
            description="זמן טוב לקנות רכב! קבל פגישת ייעוץ אצל שלמה סיקסט "
            expiresAt="30/11"
            points={3750}
            onPress={openOffer}
          />
           <MemoOffer
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
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={Platform.OS !== 'ios'}         // ❗ iOS must be non-transparent
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
        onRequestClose={closeModal}
        onDismiss={() => setSelected(null)}          // optional cleanup
      >
      {Platform.OS === 'ios' ? (
        // iOS pageSheet: no need to push from bottom; system handles the sheet
        <SafeAreaView style={{ flex: 1, paddingTop: 8 }}>
          {/* tiny visual handle (optional) */}
          <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 6 }}>
            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: '#E0E0E0' }} />
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 24,paddingHorizontal:40 }} showsVerticalScrollIndicator={false}>
            <Text style={styles.sheetTitle}>{selected?.title}</Text>
            <Text style={styles.sheetMeta}>
              ניקוד נדרש: <Text style={styles.metaStrong}>{selected?.points?.toLocaleString?.() || selected?.points}</Text> ·{' '}
              בתוקף עד: {selected?.expiresAt}
            </Text>
            <View style={{alignItems:'center',height:300,marginTop:24}}>
              <Image src={selected?.image} style={styles.modalImage} resizeMode="contain" />
            </View>
            <Text style={styles.sheetDesc}>{selected?.description}</Text>
            <View style={styles.ctaRow}>
              <Pressable style={[styles.btn, styles.btnSecondary]} onPress={closeModal}>
                <Text style={[styles.btnText, styles.btnTextSecondary]}>סגור</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => { /* redeem flow */ }}>
                <Text style={[styles.btnText, styles.btnTextPrimary]}>ממש נקודות</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
          // Android (no native swipe-down on RN Modal): keep your bottom alignment
          <SafeAreaView style={styles.sheetWrapper}>
            <View style={styles.sheet}>
              <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.sheetTitle}>{selected?.title}</Text>
                <Text style={styles.sheetMeta}>
                  ניקוד נדרש: <Text style={styles.metaStrong}>{selected?.points?.toLocaleString?.() || selected?.points}</Text> ·{' '}
                  בתוקף עד: {selected?.expiresAt}
                </Text>
                <Text style={styles.sheetDesc}>{selected?.description}</Text>

                <View style={styles.ctaRow}>
                  <Pressable style={[styles.btn, styles.btnSecondary]} onPress={closeModal}>
                    <Text style={[styles.btnText, styles.btnTextSecondary]}>סגור</Text>
                  </Pressable>
                  <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => { /* redeem flow */ }}>
                    <Text style={[styles.btnText, styles.btnTextPrimary]}>ממש נקודות</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
          )}
    </Modal>
    </View>
  );
}

function MemoOffer(props: Offer & { onPress: (o: Offer) => void }) {
  const { onPress, ...offer } = props;
  return <OfferCard {...offer} onPress={() => onPress(offer)} />;
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
  modalImage:{width:'100%',height:'100%'},
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

  // Modal styles
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    // height:'100%'
  },
 
  sheetTitle: { fontSize: 20, fontWeight: '700', textAlign: 'left', marginTop: 8 },
  sheetMeta: { fontSize: 14, color: '#666', textAlign: 'left', marginTop: 6 },
  metaStrong: { color: '#000', fontWeight: '600' },
  sheetDesc: { fontSize: 16, lineHeight: 22, color: '#333', textAlign: 'left', marginTop: 12 },

  ctaRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: { backgroundColor: '#d50000' },
  btnSecondary: { backgroundColor: '#f1f1f1' },
  btnText: { fontSize: 16, fontWeight: '600' },
  btnTextPrimary: { color: '#fff' },
  btnTextSecondary: { color: '#333' },
});
