import { View, Text, ScrollView, TouchableOpacity, Platform, Pressable } from "react-native"
import { syncState } from "@legendapp/state"
import { SafeAreaView } from "react-native-safe-area-context"
import { router, useFocusEffect } from "expo-router"
import { useValue } from "@legendapp/state/react"
import TopBar from "@/components/TopBar"
import { medicamentos$, medicamentosActivos } from "@/state/medicamentos";
import { tomasDelDia, tomas$, agruparTomasPorHora, tomasVigentesDelDia } from "@/state/tomas";
import { useCallback, useEffect } from "react"
import { perfil$ } from "@/state/usuario"
import { generarTomasPendientes } from "@/state/tomas-generar"
import {TomasDelDia} from "@/features/medicamentos/TomasDelDia"
import TopBarSecondary from "@/components/TopBarSecondary"
import { GlassView } from "expo-glass-effect"
import { Check, CircleCheck } from "lucide-react-native"
import { color } from "@/theme/colors"

export default function MedicacionScreen() {
    const perfil = useValue(perfil$)

    const medicamentos = useValue(medicamentos$)

    const tomas = useValue(tomas$)

    //Lista de medicamentos activos
    const lista = medicamentosActivos(medicamentos, perfil?.id)

    //Tomas de hoy
    const hoy = tomasVigentesDelDia(tomas, medicamentos, new Date(), perfil?.id)

    //Todas las Tomas sin resolver (no especifica al grupo)
    const sinResolver = hoy.filter(
        (t) => t.estado === 'pendiente' || t.estado === 'pospuesta'
    )

    //Las tomas se agrupan por hora. Retorna una lista con 'hora, Toma'
    const grupos = agruparTomasPorHora(hoy)

    const tomasSincronizadas = useValue(syncState(tomas$).lastSync)

    const tomasListas = useValue(syncState(tomas$).isLoaded)
    const medsListos = useValue(syncState(medicamentos$).isLoaded)

    const sincronizados = lista.filter((m) => m.created_at).length

    const tomasResueltas = hoy.length - sinResolver.length

    useFocusEffect(
        useCallback(() => {
        if (!perfil?.id) return
    }, [perfil?.id, tomasSincronizadas, tomasListas, medsListos])
    )

    useEffect(() => {
        if (!perfil?.id) return
        generarTomasPendientes(perfil.id)
    }, [perfil?.id, sincronizados, tomasSincronizadas, tomasListas, medsListos])

    if (hoy.length === 0) return (
         <View className="flex-1 bg-surface">
            <View className="absolute top-0 left-0 right-0 z-10">
                <SafeAreaView edges={['top']} className="bg-surface">
                    <TopBar
                        name="Medicación"
                        canGoBack={false}
                        grande
                        subtitulo={`${new Date().toLocaleDateString('es-CR', {weekday: 'long'})}, ${new Date().getDate()} de ${new Date().toLocaleString('es-ES', {month: 'long'})}`}
                    />
                </SafeAreaView>
           
                <TopBarSecondary active="Tomas" tab1="Tomas" tab2="Medicamentos" route1="/medicacion" route2="/medicacion/historial"/>
        </View>
      
          <View className="flex-1 items-center justify-center px-8">
            <View className="flex-col gap-2 items-center">
              <View className="w-32 h-32 bg-success-subtle rounded-full flex flex-col items-center overflow-hidden justify-center">
            
                <View className="items-center justify-center rounded-sheet">
                  <CircleCheck
                    color={color.success}
                    size={50} 
                    strokeWidth={2} 
                  />
                </View>
            
              </View>
      
              <Text className="font-lexend text-heading text-center">¡Todo al dia!</Text>
              <Text className="font-lexend text-label text-center text-content-muted">No tienes tomas pendientes hoy. Disfruta tu dia.</Text>
            </View>
          </View>
        </View>
    )


    return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar
                    name="Medicación"
                    canGoBack={false}
                    grande
                    subtitulo={`${new Date().toLocaleDateString('es-CR', {weekday: 'long'})}, ${new Date().getDate()} de ${new Date().toLocaleString('es-ES', {month: 'long'})}`}
                />
            </SafeAreaView>

            <TopBarSecondary active="Tomas" tab1="Tomas" tab2="Medicamentos" route1="/medicacion" route2="/medicacion/historial"/>


            <ScrollView
                className="flex-grow"
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 80 }}
            >

                {hoy.length === 0 ? null : (
                    <View className=" flex flex-col">
                        <View className="flex-row justify-between mb-2 px-6">
                            <Text className="text-label text-content-muted font-lexend">Progreso del dia</Text>
                            <Text className = "font-lexend-bold">{hoy.length !== 0 ? `${tomasResueltas} de ${hoy.length} dosis` : `No hay dosis programadas para hoy`}</Text>
                        </View>
                        <View className="h-1 w-full overflow-hidden rounded-card bg-surface">
                            <View className="h-full bg-success" style={{
                                 width: `${hoy.length > 0 ? (tomasResueltas / hoy.length) * 100 : 0}%`
                            }}/>
                        </View>
                        
                    </View>
                )}
               
                {hoy.length === 0 ? (
                    <View className="mx-6 mb-8 rounded-card border border-dashed border-line-strong bg-surface-raised px-5 py-8 items-center">
                        <Text className="text-body text-content-muted text-center font-lexend">
                            No hay dosis programadas para hoy.
                        </Text>
                    </View>
                ) : (
                    <View className="mb-8">
                    {grupos.length === 0 ? (
                    <View className="mx-6 mb-8 rounded-2xl border border-dashed border-neutral-200 bg-white px-5 py-8 items-center">
                        <Text className="text-body text-content-muted font-lexend">
                            No hay dosis programadas para hoy.
                        </Text>
                    </View>
                ) : (
                    <View>
                        {grupos.map((g) => (
                            <TomasDelDia key={g.hora} grupo={g} medicamentos={medicamentos} />
                        ))}
                    </View>
                )}
                    </View>
                )}

                
            </ScrollView>


            <GlassView
            style={{
            position: 'absolute',
            bottom: 144, 
            right: 24,   
            height: 64,  
            width: 64,   
            borderRadius: 32, 
            overflow: 'hidden',
            }}
            glassEffectStyle="clear"
            tintColor="#1C469C"
            isInteractive
            >
                <TouchableOpacity
                onPress={() => router.navigate('/medicacion/agregar-medicamento')}
                accessibilityRole="button"
                className={`flex-1 justify-center items-center ${Platform.OS === "android" ? 'bg-primary' : ''}`}
                >
                <Text className="text-content-on-primary text-center items-center text-4xl">+</Text>
                </TouchableOpacity>
            </GlassView>

           

            
        </View>
    )
}
