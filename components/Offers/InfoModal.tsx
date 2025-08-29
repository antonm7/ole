import { Image, Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Offer } from "./OfferCard";

export function InfoModal({modalVisible, closeModal, onDismiss, selected}:{modalVisible:boolean, closeModal:() => void, onDismiss:() => void, selected:Offer}) {
    return (
        <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={Platform.OS !== 'ios'}         // ❗ iOS must be non-transparent
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
        onRequestClose={closeModal}
        onDismiss={onDismiss}          // optional cleanup
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
    )

}

const styles = StyleSheet.create({
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 8,
      },
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
      sheetWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
      },
      modalImage:{width:'100%',height:'100%'},
      btnPrimary: { backgroundColor: '#d50000' },
      btnSecondary: { backgroundColor: '#f1f1f1' },
      btnText: { fontSize: 16, fontWeight: '600' },
      btnTextPrimary: { color: '#fff' },
      btnTextSecondary: { color: '#333' },
      sheetTitle: { fontSize: 20, fontWeight: '700', textAlign: 'left', marginTop: 8 },
      sheetMeta: { fontSize: 14, color: '#666', textAlign: 'left', marginTop: 6 },
      metaStrong: { color: '#000', fontWeight: '600' },
      sheetDesc: { fontSize: 16, lineHeight: 22, color: '#333', textAlign: 'left', marginTop: 12 },
      backdrop: {
        ...StyleSheet.absoluteFillObject,
      },
})
