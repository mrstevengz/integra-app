import { formatearFecha } from "@/lib/fechas"
import { esDoble, Medicion, retornarMedicionesParaGrafica, TipoMedicion } from "@/state/mediciones"
import { color } from "@/theme/colors"
import { View, Text, Dimensions } from "react-native"
import { LineChart } from "react-native-chart-kit/v2"

type GraficaMedicionProps = {
    medicionesTipo: Medicion[],
    tipo: TipoMedicion,
    
}

//Retornar una constante especifica para dibujar la grafica sin importar la resolucion del telefono.
export const ANCHO_GRAFICA = Dimensions.get("window").width - 40

//Constante que guarda los temas de la grafica (para no ponerlos adentro del componente)
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



export default function GraficaMedicion({medicionesTipo, tipo}: GraficaMedicionProps) {
    const esMedicionDoble = tipo ? esDoble(tipo) : false
    const datosGrafica = retornarMedicionesParaGrafica(medicionesTipo)
    
    return (
        <>
            {medicionesTipo.length >= 2 && (
                <View className="px-5">
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
                        formatYLabel={(v) => String((v))}
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
        </>
    )
}