import { Link } from "expo-router";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const listings = [
  ["Villa Azur face mer", "Tipaza, Algérie", "220 EUR / nuit"],
  ["Cabane Atlas", "Ifrane, Maroc", "95 EUR / nuit"],
  ["Appartement Jardin Majorelle", "Marrakech, Maroc", "130 EUR / nuit"]
];

export default function HomeScreen() {
  return (
    <ScrollView>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" }}
        style={styles.hero}
      >
        <View style={styles.overlay}>
          <Text style={styles.brand}>Amkan</Text>
          <Text style={styles.subtitle}>Locations de vacances choisies avec soin.</Text>
        </View>
      </ImageBackground>
      <View style={styles.search}>
        <TextInput placeholder="Destination" style={styles.input} />
        <View style={styles.row}>
          <TextInput placeholder="Arrivée" style={[styles.input, styles.flex]} />
          <TextInput placeholder="Départ" style={[styles.input, styles.flex]} />
        </View>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </Pressable>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Logements</Text>
        {listings.map(([title, place, price]) => (
          <Link key={title} href="/listing" asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.muted}>{place}</Text>
              <Text style={styles.price}>{price}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { height: 320, justifyContent: "flex-end" },
  overlay: { padding: 24, backgroundColor: "rgba(23,33,31,0.36)" },
  brand: { color: "white", fontSize: 42, fontWeight: "700" },
  subtitle: { color: "white", fontSize: 17, marginTop: 8 },
  search: { margin: 16, padding: 14, borderRadius: 8, backgroundColor: "white", gap: 10 },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#dfe7e3", borderRadius: 8, paddingHorizontal: 12 },
  row: { flexDirection: "row", gap: 10 },
  flex: { flex: 1 },
  button: { minHeight: 48, borderRadius: 8, backgroundColor: "#bf6f4a", alignItems: "center", justifyContent: "center" },
  buttonText: { color: "white", fontWeight: "700" },
  section: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", color: "#17211f", marginBottom: 12 },
  card: { backgroundColor: "white", borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#e5ece8" },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#17211f" },
  muted: { marginTop: 4, color: "#61716c" },
  price: { marginTop: 10, fontWeight: "700", color: "#1f7a69" }
});
