import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HostScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Dashboard hôte</Text>
      {["Revenus mois: 11 620 EUR", "Taux occupation: 76%", "Calendrier synchronisé", "Assistant annonce premium"].map((item) => (
        <View key={item} style={styles.card}><Text style={styles.cardTitle}>{item}</Text></View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
  title: { fontSize: 26, fontWeight: "700", color: "#17211f" },
  card: { padding: 16, backgroundColor: "white", borderRadius: 8 },
  cardTitle: { fontWeight: "700" }
});
