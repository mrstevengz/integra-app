import TopBar from "@/components/TopBar"
import { iconoDeForma } from "@/features/medicamentos/iconos"
import { buscarPorId } from "@/state/consultas"
import { formatearDias, horariosOrdenados, medicamentos$ } from "@/state/medicamentos"
import { useValue } from "@legendapp/state/react"
import { router, useLocalSearchParams } from "expo-router"
import { View, Text, ScrollView, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { estilosScrollView } from "../../(index)"
import { formatearHoraDeTexto } from "@/lib/fechas"
import { deleteAlert, pedirConfirmacion } from "@/components/Alert"
import { color } from "@/theme/colors"
import { eliminarMedicamento, reactivarMedicamento, suspenderMedicamento } from "@/state/medicamentos-acciones"

export default function GestionarMedicamento() {
    const {medicacionId} = useLocalSearchParams()
    const medicamentos = useValue(medicamentos$)

    const medicamento = buscarPorId(medicamentos, medicacionId as string)

    if (!medicamento) return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Gestionar medicamento' canGoBack={true}/>
            </SafeAreaView>
            <View className="flex-1 items-center justify-center px-6">
                <Text className="font-lexend text-body text-content-muted text-center">
                    Este medicamento ya no esta disponible.
                </Text>
            </View>
        </View>
    )

    const suspendido = !medicamento.activo


return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Gestionar medicamento' canGoBack={true}/>
            </SafeAreaView>

            <ScrollView className="" contentContainerStyle={estilosScrollView}>
                <View className="bg-surface-raised rounded-card border border-line p-6 flex flex-row mb-3">
                    <View className="flex items-center justify-center rounded-control mr-4 bg-surface-sunken p-3 border border-line-strong">
                    {iconoDeForma(medicamento.forma, suspendido ? color.contentDisabled : color.contentMuted)}
                    </View>

                    <View className="flex-1">
                        <Text className={`font-lexend text-subheading ${suspendido ? 'text-content-disabled' : 'text-content'}`}>
                            {medicamento.nombre} {medicamento.dosis} {medicamento.unidad}
                        </Text>

                        {suspendido && (
                            <View className="self-start rounded-chip bg-warning-subtle px-2 py-1 mt-1">
                                <Text className="font-lexend text-caption text-warning-on-subtle">Suspendido</Text>
                            </View>
                        )}

                        {horariosOrdenados(medicamento).length === 0 ? (
                            <Text className="font-lexend text-content-disabled">Sin horarios</Text>
                        ) : (
                            horariosOrdenados(medicamento).map((h) => (
                            <Text key={h.id} className="font-lexend text-content-muted">
                                {formatearHoraDeTexto(h.hora)} · {formatearDias(h.dias)}
                            </Text>
                            ))
                        )}
                    </View>
                </View>

                <Pressable
                      className="py-3 bg-surface-raised rounded-control border border-line-strong items-center active:bg-surface-sunken mb-4"
                      onPress={() => router.navigate({pathname: '/medicacion/[medicacionId]/editar', params: {medicacionId: medicamento.id}})}
                >
                    <Text className="text-body text-content font-lexend">
                        Editar
                    </Text>
                </Pressable>

                <Text className="font-lexend text-body">Opciones</Text>

                {suspendido ? (
                    <View className="bg-surface-raised rounded-card border border-line p-6 flex flex-col mt-4 gap-3">
                        <Text className="font-lexend text-subheading">Medicamento suspendido</Text>
                        <Text className="font-lexend text-caption text-content-muted">Los recordatorios estan pausados. Al reactivarlo vuelven a generarse desde hoy.</Text>

                        <Pressable
                          className="py-4 bg-surface-raised rounded-control border border-line-strong items-center active:bg-primary-subtle"
                          onPress={() => reactivarMedicamento(medicamento.id)}
                        >
                          <Text className="text-body font-semibold text-primary">
                            Reactivar medicamento
                          </Text>
                        </Pressable>
                    </View>
                ) : (
                    <View className="bg-surface-raised rounded-card border border-line p-6 flex flex-col mt-4 gap-3">
                        <Text className="font-lexend text-subheading">Suspender temporalmente</Text>
                        <Text className="font-lexend text-caption text-content-muted">Los recordatorios se pausaran. El historial se conserva y podras reactivarlo en cualquier momento.</Text>

                        <Pressable
                          className="py-4 bg-surface-raised rounded-control border border-line-strong items-center active:bg-surface-sunken"
                          onPress={() => {
                            pedirConfirmacion({
                              titulo: 'Suspender medicamento',
                              mensaje: 'Se pausaran los recordatorios pendientes de hoy en adelante. El historial se conserva.',
                              textoConfirmar: 'Suspender',
                              alConfirmar: () => suspenderMedicamento(medicamento.id),
                            })
                          }}
                        >
                          <Text className="text-body font-semibold text-content">
                            Suspender medicamento
                          </Text>
                        </Pressable>
                    </View>
                )}

                <View className="bg-surface-raised rounded-card border border-line p-6 flex flex-col mt-4 gap-3">
                    <Text className="font-lexend text-subheading">Eliminar permanentemente</Text>
                    <Text className="font-lexend text-caption text-content-muted">Se eliminaran el medicamento y todo su historial de dosis. Esta accion no se puede revertir.</Text>

                    <Pressable
                      className="py-4 bg-surface-raised rounded-control border border-line-strong items-center active:bg-danger-subtle"
                      onPress={() => {
                        pedirConfirmacion({
                          titulo: 'Eliminar medicamento',
                          mensaje: 'Se eliminaran el medicamento y todas sus dosis, incluido el historial.',
                          textoConfirmar: 'Eliminar',
                          destructivo: true,
                          alConfirmar: () => {
                            eliminarMedicamento(medicamento.id)
                            router.back()
                          },
                        })
                      }}
                    >
                      <Text className="text-body font-semibold text-danger">
                        Eliminar medicamento
                      </Text>
                    </Pressable>
                </View>
                
            </ScrollView>
        </View>
    )
}