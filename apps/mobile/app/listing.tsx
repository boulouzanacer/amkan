import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function ListingScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Villa Azur face mer</Text>
      <Text style={styles.muted}>Tipaza, Algérie · 4.9 étoiles</Text>
      <View style={styles.photo} />
      <Text style={styles.sectionTitle}>Détail logement</Text>
      <Text style={styles.body}>Galerie, carte Google Maps, équipements, règles, avis, favoris et réservation.</Text>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Réserver</Text>
        <TextInput placeholder="Arrivée" style={styles.input} />
        <TextInput placeholder="Départ" style={styles.input} />
        <TextInput placeholder="Voyageurs" style={styles.input} keyboardType="number-pad" />
        <Pressable style={styles.button}><Text style={styles.buttonText}>Confirmer</Text></Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 14 },
  title: { fontSize: 26, fontWeight: "700", color: "#17211f" },
  muted: { color: "#61716c" },
  photo: { height: 260, borderRadius: 8, backgroundColor: "#dbe8e2" },
  sectionTitle: { fontSize: 19, fontWeight: "700", color: "#17211f" },
  body: { color: "#61716c", lineHeight: 22 },
  form: { backgroundColor: "white", borderRadius: 8, padding: 16, gap: 10 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#dfe7e3", borderRadius: 8, paddingHorizontal: 12 },
  button: { minHeight: 48, borderRadius: 8, backgroundColor: "#1f7a69", alignItems: "center", justifyContent: "center" },
  buttonText: { color: "white", fontWeight: "700" }
});
