import { Text, View, ScrollView, Pressable} from "react-native";
import TopBar from "@/components/TopBar";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useValue } from "@legendapp/state/react";
import { perfil$ } from "@/state/usuario";
import { tomas$, tomasDelDia } from "@/state/tomas";
import { ProximaToma } from "@/features/medicamentos/ProximaToma";
import { mediciones$, medicionesDelPerfil, tiposMedicion$ } from "@/state/mediciones";
import { buscarPorId } from "@/state/consultas";
import ArticulosDestacados from "@/features/articulos/ArticulosDestacados";
import ProximaCita from "@/features/citas/ProximaCita";
import { citas$, resultadosCita$, citasNoResueltas } from "@/state/citas";
import { color } from "@/theme/colors";
import { User } from "lucide-react-native";

export const estilosScrollView = {
    paddingTop: 20,
    paddingBottom: 120,
    paddingHorizontal: 20,
}

export default function HomeScreen() {
    const perfil = useValue(perfil$)
    

    const tomas = useValue(tomas$)
    const tomasDeHoy = tomasDelDia(tomas, new Date(), perfil?.id)
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
    <View className="flex-1 bg-surface">
        <SafeAreaView edges={['top']} className="bg-surface">
            <TopBar
            name={`Hola, ${perfil.nombre}`}
            canGoBack={false}
            grande
            subtitulo={`${new Date().toLocaleDateString('es-CR', {weekday: 'long'})}, ${new Date().getDate()} de ${new Date().toLocaleString('es-ES', {month: 'long'})}`}
            accion={() => router.navigate("/expediente")}
            accionIcono={<User size={30} color={color.primary}/>}
            />
        </SafeAreaView>

       <ScrollView
                className="flex-grow bg-surface"
                contentContainerStyle={estilosScrollView}
        >

            <ProximaToma tomas = {tomasDeHoy}/>

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
                    <Text className="text-neutral-500 text-sm font-lexend">No hay historial de mediciones</Text>
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

        </ScrollView>
    </View>
  );
}
