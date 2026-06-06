import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function NotificationsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Notifications</Text>
      {["Nouvelle réservation", "Message reçu", "Paiement à confirmer", "KYC en attente"].map((item) => (
        <View key={item} style={styles.card}>
          <Text style={styles.cardTitle}>{item}</Text>
          <Text style={styles.muted}>Push mobile, email et centre notifications.</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
  title: { fontSize: 26, fontWeight: "700", color: "#17211f" },
  card: { padding: 16, backgroundColor: "white", borderRadius: 8 },
  cardTitle: { fontWeight: "700" },
  muted: { marginTop: 4, color: "#61716c" }
});
