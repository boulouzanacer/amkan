import { StyleSheet, Text, View } from "react-native";

export default function MapScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.title}>Carte interactive</Text>
      <View style={styles.map}>
        <Text style={styles.pin}>220 EUR</Text>
        <Text style={[styles.pin, styles.pinTwo]}>95 EUR</Text>
      </View>
      <Text style={styles.muted}>Clustering, prix sur carte et recherche dans la zone visible.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 26, fontWeight: "700", color: "#17211f" },
  map: { flex: 1, minHeight: 440, backgroundColor: "#dbe8e2", borderRadius: 8, padding: 24 },
  pin: { alignSelf: "flex-start", backgroundColor: "white", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontWeight: "700" },
  pinTwo: { alignSelf: "flex-end", marginTop: 140 },
  muted: { color: "#61716c" }
});
