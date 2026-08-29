import { Cita } from "@/state/citas";
import { formatearFecha } from "@/lib/fechas";
import { formatearHora } from "@/lib/fechas";
import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";

interface ComponenteProps {
  citasProximas: Cita[];
}

export default function ProximaCita({ citasProximas }: ComponenteProps) {
  const citaReciente =
    citasProximas.length > 0
      ? citasProximas.reduce((a, b) =>
          new Date(b.programada_para).getTime() <
          new Date(a.programada_para).getTime()
            ? b
            : a,
        )
      : undefined;

  const fechaCita = new Date(citaReciente?.programada_para ?? new Date());

  function getDaysRemaining() {
    if (!citaReciente) return "";

    const aMedianoche = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    const dias = Math.round(
      (aMedianoche(fechaCita) - aMedianoche(new Date())) / 86400000,
    );

    if (dias === 0) return "Hoy";
    if (dias === 1) return "Mañana";
    return `En ${dias} días`;
  }

  return (
    <View className="w-full">
      <View className="flex-row items-center justify-between my-5">
        <Text className="text-heading font-lexend">Próxima cita</Text>

        <Pressable
          onPress={() => router.push("/cita")}
          hitSlop={8}
          accessibilityRole="button"
        >
          <Text className="text-body text-primary font-lexend-bold tracking-heading">
            Ver agenda
          </Text>
        </Pressable>
      </View>

      {!citaReciente ? (
        <View className="rounded-card border border-line bg-surface-raised p-5 items-center">
          <Text className="text-neutral-500 text-sm font-lexend">
            No tenés citas pendientes
          </Text>
        </View>
      ) : (
        <Pressable
          className="flex-col gap-4 rounded-card bg-surface-raised p-4 shadow-sm active:bg-surface-sunken"
          onPress={() =>
            router.navigate({
              pathname: "/cita/[citaId]",
              params: { citaId: citaReciente.id },
            })
          }
        >
          <View className="flex flex-row items-center gap-4 py-3">
            <View className="flex-2 p-4 items-center justify-center">
              <Text className="font-lexend text-display">
                {fechaCita.getDate()}
              </Text>

              <Text className="tracking-tight font-lexend text-content-muted">
                {fechaCita
                  .toLocaleDateString("es-CR", { month: "short" })
                  .toUpperCase()}
              </Text>
            </View>

            <View className="h-20 w-px bg-content opacity-15 mr-2"></View>

            <View className="flex-1 pr-3 flex-col gap-2">
              <Text className="tracking-tight font-lexend text-heading">
                {citaReciente.especialidad}
              </Text>

              <Text className="tracking-tight font-lexend text-label text-content-muted">
                {citaReciente.medico}
              </Text>

              <Text className="tracking-tight font-lexend text-label text-content-subtle">
                {formatearFecha(fechaCita).slice(0, 3)}{" "}
                {formatearHora(fechaCita)} ⋅ {getDaysRemaining()}
              </Text>
            </View>

            <View>
              <Text className="text-content-subtle text-heading mr-4">{`>`}</Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}
