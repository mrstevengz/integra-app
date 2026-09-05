import { Dimensions, Pressable, ScrollView, View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { useValue } from "@legendapp/state/react"
import { LineChart } from "react-native-chart-kit/v2"
import TopBar from "@/components/TopBar"
import { diasEntre, formatearFecha, formatearHora } from "@/lib/fechas"
import { buscarPorId } from "@/state/consultas"
import {
    esDoble,
    mediciones$,
    medicionesDeTipo,
    retornarMedicionesParaGrafica,
    tiposMedicion$,
} from "@/state/mediciones"
import { perfil$ } from "@/state/usuario"
import { labelHelper } from "../agregar/[resultadoMedicion]"
import { color } from "@/theme/colors"
import GraficaMedicion from "@/features/mediciones/GraficaMediciones"


export default function EvolucionScreen() {
    const { medicionTipo } = useLocalSearchParams()
    const perfil = useValue(perfil$)
    const mediciones = useValue(mediciones$)
    const tipos = useValue(tiposMedicion$)

    const tipo = buscarPorId(tipos, medicionTipo as string)
    const medicionesTipo = medicionesDeTipo(mediciones, medicionTipo as string, perfil.id)

    //TODO: Implementar max, min y promedio
    // const promedio = datosGrafica.reduce((acc, valorActual) => {
    //     return (acc + valorActual.valor)
    // }, 0)

    // console.log(promedio / medicionesTipo.length)

    return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={["top"]} className="bg-surface">
                <TopBar name={` Evolucion — ${tipo?.nombre}`} canGoBack={true} />
            </SafeAreaView>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                <View>

                </View>

                {tipo && medicionesTipo && 
                <GraficaMedicion tipo={tipo} medicionesTipo={medicionesTipo}/>
                }

                <Text className="text-label font-semibold uppercase tracking-wider text-content-subtle px-5 mb-2">
                    Ultimas mediciones
                </Text>

                {medicionesTipo.length === 0 && (
                    <Text className="text-caption text-content-subtle px-5 py-6">
                        Todavia no hay mediciones de este tipo.
                    </Text>
                )}

                {medicionesTipo.map((m) => {
                    const medidoEn = new Date(m.medido_en)
                    const dias = diasEntre(medidoEn, new Date())
                    const cuando =
                        dias === 0 ? "Hoy" : dias === 1 ? "Ayer" : formatearFecha(medidoEn)

                    return (
                        <Pressable
                            key={m.id}
                            onPress={() =>
                                router.navigate({
                                    pathname: "/medicion/[medicionId]",
                                    params: { medicionId: m.id },
                                })
                            }
                            className="flex-row items-center justify-between px-5 py-4 bg-surface-raised border-b border-line active:bg-surface-sunken"
                        >
                            <View className="flex-1">
                                <Text className="text-body text-content">
                                    {cuando} · {formatearHora(medidoEn)}
                                </Text>
                                {m.contexto && (
                                    <Text className="text-caption text-content-subtle mt-1">
                                        {labelHelper(m.contexto)}
                                    </Text>
                                )}
                            </View>

                            <View className="flex-row items-baseline gap-1">
                                <Text className="text-heading font-bold text-content">
                                    {m.valor_secundario != null
                                        ? `${m.valor}/${m.valor_secundario}`
                                        : m.valor}
                                </Text>
                                <Text className="text-caption text-content-subtle">
                                    {tipo?.unidad}
                                </Text>
                            </View>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    )
}