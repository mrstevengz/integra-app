import MedicinasLista from "@/features/medicamentos/MedicinasLista";
import TopBarSecondary from "@/components/TopBarSecondary";
import TopBar from "@/components/TopBar";
import { medicamentos$, medicamentosActivos } from "@/state/medicamentos";
import { perfil$ } from "@/state/usuario";
import { useValue } from "@legendapp/state/react";
import { ScrollView, View, Text, TouchableOpacity, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassView } from "expo-glass-effect";
import { router } from "expo-router";

export default function HistorialMedicamentos() {
    const perfil = useValue(perfil$)
    
    const medicamentos = useValue(medicamentos$)
    
    const lista = medicamentosActivos(medicamentos, perfil?.id)
    
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
            
            {lista.length === 0 && (
            <View className="mx-6 mb-6 rounded-2xl border border-dashed border-neutral-200 bg-white px-5 py-8 items-center">
                <Text className="text-neutral-500 text-sm text-center">
                    Todavia no has agregado medicamentos.
                </Text>
            </View>
            )}
            
            {lista.map((item) => (
            <MedicinasLista key = {item.id} {...item}/>
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