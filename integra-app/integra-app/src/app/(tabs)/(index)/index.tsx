import {View, ScrollView, ActivityIndicator} from "react-native";
import TopBar from "@/components/TopBar";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useValue } from "@legendapp/state/react";
import { conseguirIniciales, perfil$ } from "@/state/usuario";
import { tomas$} from "@/state/tomas";
import { mediciones$} from "@/state/mediciones";
import {delPerfil } from "@/state/consultas";
import { medicamentos$ } from "@/state/medicamentos";
import AvatarPerfil from "@/features/perfil/AvatarPerfil";
import { color } from "@/theme/colors";
import InicioCompleto from "@/features/perfil/InicioFull";
import InicioIncompleto from "@/features/perfil/InicioIncompleto";

//Valores de padding para el scrollview, queria hacer esto para usarlo en mas pantallas pero literalmente es la unica pantalla que usa estos valores especificos, js slime me.
export const estilosScrollView = {
    paddingTop: 20,
    paddingBottom: 120,
    paddingHorizontal: 20,
}

export default function HomeScreen() {
    const perfil = useValue(perfil$)
    const tomas = delPerfil(useValue(tomas$), perfil.id)
    const medicamentos = delPerfil(useValue(medicamentos$), perfil.id)
    const mediciones = delPerfil(useValue(mediciones$), perfil.id)

    if (!perfil.id) return (
         <View className="flex-1 bg-surface">
        <SafeAreaView edges={['top']} className="bg-surface">
            <TopBar
            name={`Hola, ${perfil.nombre}`}
            canGoBack={false}
            grande
            subtitulo={`${new Date().toLocaleDateString('es-CR', {weekday: 'long'})}, ${new Date().getDate()} de ${new Date().toLocaleString('es-ES', {month: 'long'})}`}
            accion={() => router.navigate("/expediente")}
            accionIcono={<AvatarPerfil
                    perfilId={perfil.id}
                    avatarPath={perfil.avatar_path}
                    iniciales={conseguirIniciales(perfil)}
                    tamano={45}
                />}
            />

            <ScrollView>
                <ActivityIndicator size="large" color={color.primary}/>
            </ScrollView>
        </SafeAreaView>
        </View>
    )

   let nuevo = tomas.length === 0 && medicamentos.length === 0 && mediciones.length === 0

    
  return (
    <View className="flex-1 bg-surface">
        <SafeAreaView edges={['top']} className="bg-surface">
            <TopBar
            name={`Hola, ${perfil.nombre}`}
            canGoBack={false}
            grande
            subtitulo={`${new Date().toLocaleDateString('es-CR', {weekday: 'long'})}, ${new Date().getDate()} de ${new Date().toLocaleString('es-ES', {month: 'long'})}`}
            accion={() => router.navigate("/expediente")}
            accionIcono={<AvatarPerfil
                    perfilId={perfil.id}
                    avatarPath={perfil.avatar_path}
                    iniciales={conseguirIniciales(perfil)}
                    tamano={45}
                    
            />}
            accionLabel="Ir al perfil"
            />
        </SafeAreaView>

       <ScrollView
                className="flex-grow bg-surface"
                contentContainerStyle={estilosScrollView}
        >

            {nuevo ? <InicioIncompleto/> : <InicioCompleto/>}

        </ScrollView>
    </View>
  );
}
