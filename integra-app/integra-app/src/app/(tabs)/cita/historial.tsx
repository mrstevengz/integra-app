import { Text, View, ScrollView, TouchableOpacity, Platform, Pressable } from "react-native";
import TopBar from "@/components/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBarSecondary from "@/components/TopBarSecondary";
import { GlassView } from "expo-glass-effect";
import { router } from "expo-router";
import { useValue } from "@legendapp/state/react";
import { citas$, resultadosCita$, citasResueltas, resultadoDeCita } from "@/state/citas";
import { perfil$ } from "@/state/usuario";
import { formatearFecha } from "@/lib/fechas";
import { formatearHora } from "@/lib/fechas";
import EstadoCita from "@/features/citas/EstadoCita";
import { CalendarPlus } from "lucide-react-native";
import { color } from "@/theme/colors";

export default function HistorialCitaScreen() {
  const perfil = useValue(perfil$)
  const citas = useValue(citas$)
  const resultados = useValue(resultadosCita$)

  //Solo las que ya tienen resultado registrado: asistida, no asistida o cancelada.
  const historial = citasResueltas(citas, resultados, perfil.id)

  if (historial.length === 0) return (
  <View className="flex-1 bg-slate-100">
    <View className="absolute top-0 left-0 right-0 z-10">
      <SafeAreaView edges={['top']} className="bg-slate-100">
        <TopBar name='Citas medicas' canGoBack={false}/>
      </SafeAreaView>
      <TopBarSecondary active="Historial" tab1="Pendientes" tab2="Historial" route1="/cita" route2="/cita/historial"/>
    </View>

    <View className="flex-1 items-center justify-center px-8">
      <View className="flex-col gap-2 items-center">
        <View className="w-24 h-24 bg-slate-100 border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center overflow-hidden">
      
      
          <View className="w-full h-6 bg-primary flex flex-row justify-center items-center gap-6 relative">
            <View className="w-1.5 h-3 bg-surface rounded-full opacity-80" />
            <View className="w-1.5 h-3 bg-surface rounded-full opacity-80" />
          </View> 
  
  
          <View className="flex-1 items-center justify-center">
            <CalendarPlus 
              color={color.primary}
              size={30} 
              strokeWidth={2} 
            />
          </View>
      
        </View>

        <Text className="font-lexend text-heading text-center">No tienes citas programadas</Text>
        <Text className="font-lexend text-label text-center text-content-muted">Programa tus consultas y manten todas tus visitas en un solo lugar</Text>

        <Pressable className ="bg-primary active:bg-primary-pressed p-5 px-8 rounded-chip mt-6 items-center" onPress={() => router.navigate("/cita/agregar-cita")}>
          <Text className="font-lexend text-label text-white">Programar cita</Text>
        </Pressable>
      </View>
    </View>
  </View>
  )


  return (
    <View className="flex-1">
      <SafeAreaView edges={['top']} className="bg-slate-100">
        <TopBar name='Citas medicas' canGoBack={false}/>
      </SafeAreaView>

      <TopBarSecondary active="Historial" tab1="Pendientes" tab2="Historial" route1="/cita" route2="/cita/historial"/>

      <ScrollView className="flex-1 bg-slate-100">
        {historial.length === 0 && (
         <View className="flex-1 items-center justify-center">
            <Text>Hola</Text>
         </View>
        )}

        {historial.map((c) => {
          const date = new Date(c.programada_para)
          const resultado = resultadoDeCita(resultados, c.id)

          return (
            <Pressable key={c.id}
              className="p-6 justify-between flex flex-row items-center border-b border-slate-400 bg-bg-color active:bg-neutral-200"
              onPress={() => router.navigate({
                pathname: '/cita/[citaId]',
                params: { citaId: c.id }
              })}>
              <View className="flex-1 gap-2">
                <Text className="text-xl font-semibold">{c.especialidad}</Text>
                <Text className="text-md text-slate-500">{c.medico}</Text>
                <Text className="text-md">
                  {formatearFecha(date)}, {formatearHora(date)}
                </Text>
                {resultado && <EstadoCita resultado={resultado.tipo_resultado} />}
              </View>
            </Pressable>
          )
        })}
      </ScrollView>

      <GlassView
        style={{ position: 'absolute', bottom: 144, right: 24, height: 64, width: 64, borderRadius: 32, overflow: 'hidden' }}
        glassEffectStyle="clear" tintColor="#000000E6" isInteractive>
        <TouchableOpacity
          onPress={() => router.navigate('/cita/agregar-cita')}
          accessibilityRole="button"
          className={`flex-1 justify-center items-center ${Platform.OS === "android" ? 'bg-txt-color' : ''}`}>
          <Text className="text-white text-center items-center text-4xl">+</Text>
        </TouchableOpacity>
      </GlassView>
    </View>
  );
}