import { citas$, resultadosCita$, citasNoResueltas } from "@/state/citas"
import { buscarPorId } from "@/state/consultas"
import { medicamentos$ } from "@/state/medicamentos"
import { mediciones$, medicionesDelPerfil, tiposMedicion$ } from "@/state/mediciones"
import { tomas$, tomasVigentesDelDia } from "@/state/tomas"
import { perfil$ } from "@/state/usuario"
import { useValue } from "@legendapp/state/react"
import { router } from "expo-router"
import { View, Pressable, Text } from "react-native"
import ArticulosDestacados from "../articulos/ArticulosDestacados"
import ProximaCita from "../citas/ProximaCita"
import { ProgresoDelDia } from "../medicamentos/ProgresoDelDia"
import { ProximaToma } from "../medicamentos/ProximaToma"

export default function InicioCompleto() {
        const perfil = useValue(perfil$)
        
        const tomas = useValue(tomas$)
        const medicamentos = useValue(medicamentos$)
        const tomasDeHoy = tomasVigentesDelDia(tomas, medicamentos, new Date(), perfil?.id)
        
        const sinResolver = tomasDeHoy.filter(
            (t) => t.estado === 'pendiente' || t.estado === 'pospuesta'
        )
    
        const tomasResueltas = tomasDeHoy.length - sinResolver.length
    
        const hoy = new Date()
    
        const mediciones = useValue(mediciones$)
        const tipos = useValue(tiposMedicion$)
        const citas = useValue(citas$)
        
        const resultados = useValue(resultadosCita$)
        const citasProximasLista = citasNoResueltas(citas, resultados, perfil.id)
            .filter((c) => new Date(c.programada_para).getTime() >= hoy.getTime())
            
        const medicionesHistorial = medicionesDelPerfil(mediciones, perfil.id)
    
        const medicionComponente = medicionesHistorial.slice(0, 2)
        
    return (
        <>
        <ProximaToma tomas = {tomasDeHoy}/>

            <ProgresoDelDia tomasDeHoy ={tomasDeHoy} tomasResueltas={tomasResueltas}/>

            <ProximaCita citasProximas={citasProximasLista}/>

             <View className="flex-row items-center justify-between my-5">
                <Text className="text-heading font-lexend">
                    Ultimas mediciones
                </Text>
            
                <Pressable onPress={() => router.push('/medicion')} hitSlop={8} accessibilityRole="button">
                    <Text className="text-body text-primary font-lexend-bold tracking-heading">Ver todas</Text>
                </Pressable>
            </View>

            {medicionComponente.length === 0 && (
                <View className="rounded-2xl border border-neutral-200 bg-white p-5 items-center justify-between">
                    <Text className="text-content-muted text-label font-lexend">No hay historial de mediciones</Text>
                </View>
            )}

            <View className="flex-row gap-6">
                {medicionComponente.map((m => {
                    const t = buscarPorId(tipos, m.tipo_medicion_id)
                    const medidoEn = new Date(m.medido_en)

                    return (
                        <Pressable className="flex-col flex-1 gap-2 justify-start rounded-card bg-surface-raised p-4 shadow-sm active:bg-surface-sunken" key={m.id} onPress={() => router.navigate('/medicion/historial')}>
                            <Text className="font-lexend text-content-subtle">{t?.nombre}</Text>
                            <Text className="font-lexend-bold text-title tracking-tighter">{m.valor} {m.valor_secundario && `/ ${m.valor_secundario}`}</Text>
                            <Text className="font-lexend text-primary-pressed">{t?.unidad}</Text>
                            <Text className="font-lexend text-primary-on-subtle">{medidoEn.toDateString().slice(4, 10)} {medidoEn.toTimeString().slice(0,5)}</Text>
                        </Pressable>
                    )
                }))}
            </View>

            <View className="flex-row items-center justify-between my-5">
                <Text className="text-heading font-lexend">
                    Articulos Destacados
                </Text>
            
                <Pressable onPress={() => router.push('/articulos')} hitSlop={8} accessibilityRole="button">
                    <Text className="text-body text-primary font-lexend-bold tracking-heading">Ver todos</Text>
                </Pressable>

                
            </View>

            <ArticulosDestacados/>
        </>
    )
}