import TopBarSecondary from "@/components/TopBarSecondary";
import TopBar from "@/components/TopBar";
import { buscarPorId } from "@/state/consultas";
import {
  mediciones$,
  medicionesDelPerfil,
  tiposMedicion$,
} from "@/state/mediciones";
import { perfil$ } from "@/state/usuario";
import { useValue } from "@legendapp/state/react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { labelHelper } from "./[medicionTipo]/agregar/[resultadoMedicion]";
import { router } from "expo-router";
import { formatearFecha } from "@/lib/fechas";
import { formatearHora } from "@/lib/fechas";
import { Activity, HeartPulse } from "lucide-react-native";
import { color } from "@/theme/colors";

export default function HistorialMediciones() {
  const perfil = useValue(perfil$);
  const mediciones = useValue(mediciones$);
  const tipos = useValue(tiposMedicion$);

  const medicionesHistorial = medicionesDelPerfil(mediciones, perfil.id);

  if (medicionesHistorial.length === 0) return (
    <View className="flex-1 bg-surface">
      <View className="absolute top-0 left-0 right-0 z-10">
        <SafeAreaView edges={['top']} className="bg-slate-100">
          <TopBar name="Medicion" canGoBack={false} />
        </SafeAreaView>
         <TopBarSecondary
        active="Historial"
        tab1="Registrar"
        tab2="Historial"
        route1="/medicion"
        route2="/medicion/historial"
      />
      </View>
  
      <View className="flex-1 items-center justify-center px-8">
        <View className="flex-col gap-2 items-center">
          <View className="w-80 h-40 bg-danger-subtle border border-line  rounded-sheet shadow-sm flex flex-col items-center overflow-hidden justify-center">
        
            <View className="items-center justify-center bg-surface-raised p-4 rounded-sheet">
              <Activity
                color={color.danger}
                size={30} 
                strokeWidth={2} 
              />
            </View>
        
          </View>
  
          <Text className="font-lexend text-heading text-center">Tu historial esta vacio</Text>
          <Text className="font-lexend text-label text-center text-content-muted">Registra tu peso, presion, glucosa para ver tus tendencias con el tiempo.</Text>
  
          <Pressable className ="active:bg-primary-pressed p-5 px-12 rounded-card mt-6 items-center bg-danger" onPress={() => router.navigate("/medicion")}>
            <Text className="font-lexend text-label text-white">Registrar medicion</Text>
          </Pressable>
        </View>
      </View>
    </View>
    )

  return (
    <View className="flex-1">
      <SafeAreaView edges={["top"]} className="bg-slate-100">
        <TopBar name="Medicion" canGoBack={false} />
      </SafeAreaView>

      <TopBarSecondary
        active="Historial"
        tab1="Registrar"
        tab2="Historial"
        route1="/medicion"
        route2="/medicion/historial"
      />

      <ScrollView
        className="flex-grow"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {medicionesHistorial.map((m) => {
          const t = buscarPorId(tipos, m.tipo_medicion_id);
          const medidoEn = new Date(m.medido_en);

          return (
            <Pressable
              key={m.id}
              className="p-6 justify-between flex flex-row items-center border-b border-slate-400 bg-surface-raised active:bg-surface-sunken"
              onPress={() =>
                router.navigate({
                  pathname: "/medicion/[medicionId]",
                  params: { medicionId: m.id },
                })
              }
            >
              <View>
                <Text className="text-md font-semibold">{t?.nombre}</Text>
                <Text className="text-sm text-slate-500">
                  {formatearFecha(medidoEn)} ⋅ {formatearHora(medidoEn)}{" "}
                  {labelHelper(m.contexto)}
                </Text>
              </View>

              <Text className="text-lg font-bold">
                {m.valor} {m.valor_secundario && `/ ${m.valor_secundario}`}{" "}
                {t?.unidad}{" "}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
