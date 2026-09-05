import { Tabs } from "expo-router";
import BarraTabs from "@/components/BarraTabs";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BarraTabs {...props} />}
    >
      <Tabs.Screen name="(index)" />
      <Tabs.Screen name="medicacion" />
      <Tabs.Screen name="medicion" />
      <Tabs.Screen name="cita" />
      <Tabs.Screen name="expediente" />
    </Tabs>
  );
}