import { Toma } from "@/state/tomas";
import { View, Text } from "react-native";


type ProgresoDelDiaProps = {
    tomasDeHoy: Toma[],
    tomasResueltas: number
}
export function ProgresoDelDia({tomasDeHoy, tomasResueltas}: ProgresoDelDiaProps) {

    if (tomasDeHoy.length === 0) return null
    
    return (
        <View className="flex-col gap-4 rounded-card border border-surface-raised bg-surface-raised p-4 shadow-sm mt-4">
            <View className="flex-row justify-between mb-2">
                <Text className="font-lexend text-content-muted text-label tracking-wide">Progreso del dia</Text>
                <Text className=" font-lexend text-subheading">{tomasDeHoy.length !== 0 ? `${tomasResueltas} de ${tomasDeHoy.length}` : `No hay tomas hoy`}</Text>
            </View>

            <View className="h-2 w-full overflow-hidden bg-neutral-color rounded-3xl">
                <View className="h-full rounded-lg bg-success" style={{
                    width: `${(tomasResueltas/tomasDeHoy.length)* 100}%`
                }}/>
            </View>
        </View>
    )
}