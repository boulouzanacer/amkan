import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fbfcfa" },
        headerTintColor: "#17211f",
        contentStyle: { backgroundColor: "#fbfcfa" }
      }}
    />
  );
}
