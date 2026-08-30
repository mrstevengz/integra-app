import MedicinasLista from "@/features/medicamentos/MedicinasLista";
import TopBarSecondary from "@/components/TopBarSecondary";
import TopBar from "@/components/TopBar";
import { medicamentos$, medicamentosActivos, medicamentosInactivos } from "@/state/medicamentos";
import { perfil$ } from "@/state/usuario";
import { useValue } from "@legendapp/state/react";
import { ScrollView, View, Text, TouchableOpacity, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassView } from "expo-glass-effect";
import { router } from "expo-router";
import { CalendarPlus, Pill } from "lucide-react-native";
import { color } from "@/theme/colors";
import { delPerfil } from "@/state/consultas";

export default function HistorialMedicamentos() {
    const perfil = useValue(perfil$)
    
    const medicamentos = useValue(medicamentos$)
    const medicamentosLista = delPerfil(medicamentos, perfil.id)
    
    const lista = medicamentosActivos(medicamentos, perfil?.id)
    const suspendidos = medicamentosInactivos(medicamentos, perfil?.id)

    if (medicamentosLista.length === 0) return (
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

            <TopBarSecondary active="Medicamentos" tab1="Tomas" tab2="Medicamentos" route1="/medicacion" route2="/medicacion/historial"/>
        </View>

    
        <View className="flex-1 items-center justify-center px-8">
          <View className="flex-col gap-2 items-center">
            <View className="w-32 h-32 rounded-full flex flex-col items-center overflow-hidden bg-primary-subtle border-primary-on-subtle border-2">
           
              <View className="flex-1 items-center justify-center">
                <Pill
                  color={color.primary}
                  size={40} 
                  strokeWidth={2} 
                />
              </View>
          
            </View>
    
            <Text className="font-lexend text-heading text-center">Sin medicamentos aun</Text>
            <Text className="font-lexend text-label text-center text-content-muted">Agrega tus medicamentos y recibe recordatorios para cada dosis</Text>
    
            <Pressable className ="bg-primary active:bg-primary-pressed p-5 px-8 rounded-card mt-6 items-center" onPress={() => router.navigate("/medicacion/agregar-medicamento")}>
              <Text className="font-lexend text-label text-white">Agregar medicamento</Text>
            </Pressable>
          </View>
        </View>
    </View>
    )
    
    return (
        <View className="flex-1">
        <SafeAreaView edges={['top']} className="bg-surface">
            <TopBar
                name="Medicación"
                canGoBack={false}
                grande
                subtitulo={`${new Date().toLocaleDateString('es-CR', {weekday: 'long'})}, ${new Date().getDate()} de ${new Date().toLocaleString('es-ES', {month: 'long'})}`}
            />
        </SafeAreaView>
        
        <TopBarSecondary active="Medicamentos" tab1="Tomas" tab2="Medicamentos" route1="/medicacion" route2="/medicacion/historial"/>

        <ScrollView
        className="flex-grow bg-surface"
        contentContainerStyle={{ paddingBottom: 80 }}>

            {lista.length === 0 ? null : (

                <View className="p-4 border-b border-line flex-row px-6 bg-surface">
                    <Text className="font-lexend flex-1 text-label text-content-muted">Activos</Text>
                    <Text className="font-lexend-bold text-label text-content-muted">{lista.length}</Text>
                </View>
            
            )}
                    
            {lista.map((item) => (
            <MedicinasLista key = {item.id} {...item}/>
            ))}

            {suspendidos.length > 0 && (
                <View className="p-4 border-b border-line flex-row px-6 bg-surface">
                    <Text className="font-lexend flex-1 text-label text-content-muted">Suspendidos</Text>
                    <Text className="font-lexend-bold text-label text-content-muted">{suspendidos.length}</Text>
                </View>            
            )}

            {suspendidos.map((item) => (
            <MedicinasLista key={item.id} {...item}/>
            ))}

           


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