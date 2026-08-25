import { formatearHoraDeTexto } from "@/lib/fechas";
import { horariosOrdenados, Medicamento, formatearDias } from "@/state/medicamentos";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { View, Text, Pressable } from "react-native";
import { iconoDeForma } from "./iconos";
import { color } from "@/theme/colors";

export default function MedicinasLista (m: Medicamento) {
    const suspendido = !m.activo

    return (
        <Pressable key={m.id} className="p-4 px-6 bg-surface-raised flex-row flex border-b border-line active:bg-surface-sunken"
        onPress={() => router.navigate(
            {
            pathname: '/medicacion/[medicacionId]',
            params: {medicacionId: m.id}
            }
        )}
        >

            <View className="flex items-center justify-center rounded-control mr-4">
                {iconoDeForma(m.forma, suspendido ? color.contentDisabled : color.contentMuted)}
            </View>

            <View className="flex-col flex-1 gap-1">
            <Text className={`font-lexend text-subheading ${suspendido ? 'text-content-disabled' : 'text-content'}`}>
                {m.nombre} {m.dosis} {m.unidad}
            </Text>

            {suspendido ? (
                <Text className="font-lexend text-caption text-content-disabled">Recordatorios pausados</Text>
            ) : horariosOrdenados(m).length === 0 ? (
                <Text className="font-lexend text-content-disabled">Sin horarios</Text>
            ) : (
                horariosOrdenados(m).map((h) => (
                <Text key={h.id} className="font-lexend text-content-muted">
                    {formatearHoraDeTexto(h.hora)} · {formatearDias(h.dias)}
                </Text>
                ))
            )}

            {m.indicaciones && !suspendido && (
                <View className="mt-3 pt-3 border-t border-line">
                    <Text className="font-lexend text-caption text-content-subtle">
                        {m.indicaciones}
                    </Text>
                </View>
            )}
            </View>

            <View className="flex-row items-center gap-2">
                <ChevronRight color={suspendido ? color.contentDisabled : color.contentMuted}/>
            </View>
        </Pressable>
    )
}