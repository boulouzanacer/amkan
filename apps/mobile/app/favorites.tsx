import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Favoris</Text>
      {["Week-end mer", "Famille", "Télétravail"].map((collection) => (
        <View key={collection} style={styles.card}>
          <Text style={styles.cardTitle}>{collection}</Text>
          <Text style={styles.muted}>Collections partagées, notes privées et comparaison.</Text>
          <Pressable style={styles.button}><Text style={styles.buttonText}>Comparer</Text></Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
  title: { fontSize: 26, fontWeight: "700", color: "#17211f" },
  card: { padding: 16, backgroundColor: "white", borderRadius: 8, gap: 8 },
  cardTitle: { fontSize: 18, fontWeight: "700" },
  muted: { color: "#61716c" },
  button: { alignSelf: "flex-start", backgroundColor: "#1f7a69", borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10 },
  buttonText: { color: "white", fontWeight: "700" }
});
