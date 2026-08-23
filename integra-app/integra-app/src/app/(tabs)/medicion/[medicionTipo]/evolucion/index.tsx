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

export const ANCHO_GRAFICA = Dimensions.get("window").width - 40

export const TEMA_GRAFICA = {
    background: color.surfaceRaised,
    plotBackground: color.surfaceRaised,
    grid: color.border,
    axis: color.border,
    text: color.contentSubtle,
    mutedText: color.contentDisabled,
    series: [color.primary],
    typography: { axisLabelSize: 11 },
    tooltip: {
        background: color.surfaceRaised,
        border: color.border,
        text: color.content,
        mutedText: color.contentSubtle,
        borderRadius: 12,
        padding: 10,
        fontSize: 13,
        labelFontSize: 11,
        shadowColor: color.content,
        shadowOpacity: 0.12,
        shadowOffsetY: 4,
    },
}


export default function EvolucionScreen() {
    const { medicionTipo } = useLocalSearchParams()
    const perfil = useValue(perfil$)
    const mediciones = useValue(mediciones$)
    const tipos = useValue(tiposMedicion$)

    const tipo = buscarPorId(tipos, medicionTipo as string)
    const medicionesTipo = medicionesDeTipo(mediciones, medicionTipo as string, perfil.id)

    const datosGrafica = retornarMedicionesParaGrafica(medicionesTipo)
    const esMedicionDoble = tipo ? esDoble(tipo) : false

    const promedio = datosGrafica.reduce((acc, valorActual) => {
        return (acc + valorActual.valor)
    }, 0)

    console.log(promedio / medicionesTipo.length)

    return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={["top"]} className="bg-surface">
                <TopBar name={` Evolucion — ${tipo?.nombre}`} canGoBack={true} />
            </SafeAreaView>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                <View>

                </View>

                {medicionesTipo.length >= 2 && (
                    <View className="p-5">
                        <Text>{tipo?.unidad}</Text>
                        <LineChart
                            data={datosGrafica}
                            xKey="medido_en"
                            series={[
                                {
                                    yKey: "valor",
                                    label: tipo?.etiqueta_principal ?? tipo?.nombre,
                                    color: color.primary,
                                    strokeWidth: 2.5,
                                    curve: "monotone",
                                    area: true,
                                    areaFill: { fromColor: color.primary, fromOpacity: 0.16, toOpacity: 0 },
                                    dot: {
                                        visible: true,
                                        radius: 4,
                                        fill: color.surfaceRaised,
                                        stroke: color.primary,
                                        strokeWidth: 2,
                                    },
                                },
                                ...(esMedicionDoble
                                    ? [
                                          {
                                              yKey: "valor_secundario" as const,
                                              label: tipo?.etiqueta_secundaria ?? "Secundario",
                                              color: color.primary,
                                              strokeOpacity: 0.55,
                                              strokeDasharray: [6, 4],
                                              strokeWidth: 2,
                                              curve: "monotone" as const,
                                              dot: {
                                                  visible: true,
                                                  radius: 3,
                                                  fill: color.surfaceRaised,
                                                  stroke: color.primary,
                                                  strokeWidth: 2,
                                              },
                                          },
                                      ]
                                    : []),
                            ]}
                            width={ANCHO_GRAFICA}
                            height={240}
                            theme={TEMA_GRAFICA}
                            yDomain="auto"
                            labelStrategy="auto"
                            labelMinGap={8}
                            showHorizontalGridLines
                            showVerticalGridLines={false}
                            interaction="tap"
                            crosshair
                            tooltip
                            legend={
                                esMedicionDoble
                                    ? { visible: true, position: "bottom", align: "center" }
                                    : undefined
                            }
                            formatXLabel={(v) => String(new Date(v as string).toDateString().slice(4, 11))}
                            formatYLabel={(v) => String(Math.round(v))}
                        />
                    </View>
                )}

                {medicionesTipo.length === 1 && (
                    <View className="mx-5 mb-2 items-center rounded-card border border-line bg-surface-raised px-5 py-8">
                        <Text className="text-caption text-content-subtle">
                            {formatearFecha(new Date(medicionesTipo[0].medido_en))}
                        </Text>
                        <View className="flex-row items-baseline gap-1 mt-2">
                            <Text className="text-display font-bold text-content">
                                {medicionesTipo[0].valor_secundario != null
                                    ? `${medicionesTipo[0].valor}/${medicionesTipo[0].valor_secundario}`
                                    : medicionesTipo[0].valor}
                            </Text>
                            <Text className="text-body text-content-subtle">{tipo?.unidad}</Text>
                        </View>
                        <Text className="text-caption text-content-subtle mt-3 text-center">
                            Necesitas al menos 2 mediciones para ver la evolucion
                        </Text>
                    </View>
                )}

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