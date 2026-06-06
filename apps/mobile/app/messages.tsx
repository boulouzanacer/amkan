import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function MessagesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.title}>Messagerie</Text>
      <View style={styles.bubble}><Text>Temps réel, images, documents, réponses rapides et traduction.</Text></View>
      <View style={[styles.bubble, styles.sent]}><Text style={styles.sentText}>Arrivée autonome possible.</Text></View>
      <TextInput placeholder="Écrire un message" style={styles.input} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
  title: { fontSize: 26, fontWeight: "700", color: "#17211f" },
  bubble: { backgroundColor: "white", borderRadius: 8, padding: 14 },
  sent: { backgroundColor: "#1f7a69", alignSelf: "flex-end" },
  sentText: { color: "white" },
  input: { minHeight: 48, borderWidth: 1, borderColor: "#dfe7e3", borderRadius: 8, paddingHorizontal: 12, backgroundColor: "white" }
});
