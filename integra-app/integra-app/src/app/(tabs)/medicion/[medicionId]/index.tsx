import { deleteAlert } from "@/components/Alert";
import TopBar from "@/components/TopBar";
import { buscarPorId } from "@/state/consultas";
import { formatearFecha } from "@/lib/fechas";
import { formatearHora } from "@/lib/fechas";
import {
  esDoble,
  mediciones$,
  tiposMedicion$,
  medicionesDeTipo,
} from "@/state/mediciones";
import { useValue } from "@legendapp/state/react";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { color } from "@/theme/colors";
import EstadoMedicionBarra, { calcularEstado, labelContexto } from "@/features/mediciones/EstadoMedicion";
import GraficaMedicion from "@/features/mediciones/GraficaMediciones";
import { perfil$ } from "@/state/usuario";


export default function DetalleMedicion() {
  const { medicionId } = useLocalSearchParams();
  const perfil = useValue(perfil$)
  const mediciones = useValue(mediciones$);
  const tipos = useValue(tiposMedicion$);

  const medicionAEditar = buscarPorId(mediciones, medicionId as string);
  const tipo = buscarPorId(tipos, medicionAEditar?.tipo_medicion_id ?? "");
  const date = new Date(medicionAEditar?.medido_en ?? new Date());
  const medicionesTipo = tipo ? medicionesDeTipo(mediciones, tipo.id, perfil.id) : [];


  const doble = tipo ? esDoble(tipo) : false;
  
  const estado =
    medicionAEditar && !doble
      ? calcularEstado(medicionAEditar.valor, tipo)
      : null;

  const id = medicionAEditar?.id ?? "";

  if (medicionAEditar === undefined) return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={color.primary} />
        </View>
  )

  return (
    <View className="flex-1">
      <SafeAreaView edges={["top"]} className="bg-surface">
        <TopBar name="Detalle de medición" canGoBack={true} />
      </SafeAreaView>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-grow bg-surface"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 16,
            paddingHorizontal: 20,
            paddingBottom: 120,
            gap: 16,
          }}
        >
          {/* Card de valor */}
          <View className="rounded-card bg-surface-raised border border-line-strong p-5 gap-4">
            <Text className="text-caption font-semibold text-content-muted uppercase">
              {tipo?.nombre}
            </Text>

            <View className="flex-row items-center gap-1.5">
              <Text className="text-[60px] font-extrabold text-content">
                {medicionAEditar?.valor}
                {doble && ` / ${medicionAEditar?.valor_secundario}`}
              </Text>
              <Text className="text-body text-content-muted mb-1">
                {tipo?.unidad}
              </Text>
            </View>

            {estado && tipo && (
              <EstadoMedicionBarra estado = {estado} tipo = {tipo}/>
            )}
          </View>

          {/* Card de detalles */}
          <View className="rounded-card bg-surface-raised border border-line-strong overflow-hidden">
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-line">
              <Text className="text-body text-content-muted">Fecha</Text>
              <Text className="text-body font-semibold text-content">
                {formatearFecha(date, { mesLargo: true, conAnio: true })}
              </Text>
            </View>

            <View className="flex-row items-center justify-between px-5 py-4 border-b border-line-strong">
              <Text className="text-body text-content-muted">Hora</Text>
              <Text className="text-body font-semibold text-content">
                {formatearHora(date)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between px-5 py-4 border-b border-line-strong">
              <Text className="text-body text-content-muted">Contexto</Text>
              <Text className="text-body font-semibold text-content">
                {labelContexto(medicionAEditar?.contexto ?? null)}
              </Text>
            </View>

            <View className="flex-row items-start justify-between px-5 py-4 gap-4">
              <Text className="text-body text-content-muted">Nota</Text>
              <Text className="text-body font-semibold text-content flex-1 text-right">
                {medicionAEditar?.nota ? medicionAEditar.nota : "Sin nota"}
              </Text>
            </View>
          </View>

          <Pressable onPress={() => router.navigate({pathname: "/medicion/[medicionTipo]/evolucion", params: {medicionTipo: tipo!.id}})}>
            <Text className="font-lexend">Contexto temporal</Text>
            </Pressable>
          <View className="items-center w-full">
          {tipo && medicionesTipo && 
            <GraficaMedicion tipo={tipo} medicionesTipo={medicionesTipo}/>
          }
          </View>

          {/* Acciones */}
          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 py-4 bg-surface-raised rounded-control border border-line-strong items-center active:bg-surface-sunken"
              onPress={() =>
                router.navigate({
                  pathname: "/medicion/[medicionId]/editar",
                  params: { medicionId: medicionAEditar.id },
                })
              }
            >
              <Text className="text-body font-semibold text-content">
                Editar
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 py-4 bg-surface-raised rounded-control border border-line-strong items-center active:bg-danger-subtle"
              onPress={() => {
                deleteAlert(() => {
                  mediciones$[id].delete();
                  router.navigate("/medicion/historial");
                });
              }}
            >
              <Text className="text-body font-semibold text-danger">
                Eliminar
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
