import { TipoMedicion } from "@/state/mediciones";
import { View, Text } from "react-native";

export type Estado = "bajo" | "normal" | "elevado";

//Funcion helper para retornar un estado segun los tipo_min y tipo_max de cada tipo
export function calcularEstado(valor: number, tipo?: TipoMedicion): Estado | null {
  if (!tipo) return null;
  if (valor < tipo.rango_min) return "bajo";
  if (valor > tipo.rango_max) return "elevado";
  return "normal";
}

const ETIQUETA_ESTADO: Record<Estado, string> = {
  bajo: "BAJO",
  normal: "NORMAL",
  elevado: "ELEVADO",
};

const ESTILO_ESTADO: Record<Estado, { texto: string; icono: string }> = {
  bajo: { texto: "text-warning-on-subtle", icono: "bg-warning" },
  normal: { texto: "text-success-on-subtle", icono: "bg-success" },
  elevado: { texto: "text-warning-on-subtle", icono: "bg-warning" },
};

//Retornar un string basado en el contexto que retorna la base de datos (en minuscula y kebab case) para mostrar en UI
export function labelContexto(contexto: string | null) {
  const map: Record<string, string> = {
    en_ayunas: "En ayunas",
    despues_comer: "Despues de comer",
    antes_dormir: "Antes de dormir",
    en_reposo: "En reposo",
    despues_ejercicio: "Despues de ejercicio",
    otro: "Otro",
  };
  return contexto ? (map[contexto] ?? "—") : "—";
}

type EstadoMedicionBarraProps = {
    estado: Estado,
    tipo: TipoMedicion
}

export default function EstadoMedicionBarra({estado, tipo} : EstadoMedicionBarraProps) {
    return (
        <View className="flex-row items-center justify-between rounded-control bg-surface-raised border border-line px-4 py-3">
          <View className="flex-row items-center gap-2">
            <View
              className={`w-3.5 h-3.5 rounded-[3px] ${ESTILO_ESTADO[estado].icono}`}
            />
            <Text
              className={`text-label font-bold ${ESTILO_ESTADO[estado].texto}`}
            >
              {ETIQUETA_ESTADO[estado]}
            </Text>
          </View>
          <Text className="text-caption text-content-muted">
            {tipo?.rango_min}-{tipo?.rango_max} {tipo?.unidad}
          </Text>
        </View>
    )
}