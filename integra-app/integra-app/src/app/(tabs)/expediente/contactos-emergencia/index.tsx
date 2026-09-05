import ContactoEmergencia from "@/features/contactos-emergencia/ContactoEmergencia";
import TopBar from "@/components/TopBar";
import { contactosDelPerfil, contactosEmergencia$ } from "@/state/contactos-emergencia";
import { useValue } from "@legendapp/state/react";
import { router } from "expo-router";
import { View, ScrollView, Pressable, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { perfil$ } from "@/state/usuario";
import { color } from "@/theme/colors";
import { useRef } from "react";
import Swipeable, { SwipeableMethods, SwipeDirection } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { RightSwipe } from "../diagnosticos";
import { pedirConfirmacion } from "@/components/Alert";

export default function ContactosEmergenciaScreen() {

    const perfil = useValue(perfil$)
    const contactos = contactosDelPerfil(useValue(contactosEmergencia$), perfil.id)

    const swipeableRef = useRef<SwipeableMethods>(null)
    
    if(!perfil.id || !contactos) {
          return (
            <View className="flex-1">
                    <SafeAreaView edges={['top']} className="bg-slate-100">
                        <TopBar name='Mi Expediente' canGoBack={false}/>
                    </SafeAreaView>
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={color.primary}/>
                    </View> 
                </View>
          )
    }
    
    return (
        <View className="flex-1">
                <SafeAreaView edges={['top']} className="bg-slate-100">
                    <TopBar name='Contactos de Emergencia' canGoBack={true}/>
                </SafeAreaView>
                <ScrollView className="flex-1 bg-slate-100">
                    <View className="flex justify-center p-6 ">
                        <Text className="text-slate-500/60">Estos contactos seran mostrados en tu QR de emergencia para ser contactados por personal medico</Text>
                    </View>

                    <Pressable>
                         {contactos.map((contacto) => (
                            <Swipeable key = {contacto.id} friction={1} rightThreshold={140} overshootRight={false} renderRightActions={(prog, drag, methods) => 
                            RightSwipe(
                            prog, drag, methods, 
                            () => router.navigate({
                                pathname: '/expediente/contactos-emergencia/[contactoId]',
                                params: {contactoId: contacto.id}
                                }), 
                                
                            () => 
                                pedirConfirmacion({
                                    titulo: 'Eliminar contacto',
                                    mensaje: 'Se eliminara el contacto de emergencia y toda su informacion. Se borrara del expediente',
                                    textoConfirmar: 'Eliminar',
                                    destructivo: true,
                                    alConfirmar: () => {
                                      contactosEmergencia$[contacto.id].delete()
                                      router.back()
                                    },
                                })
                            )} 

                            ref={swipeableRef}
                            >
                                <ContactoEmergencia key={contacto.id} nombre={contacto.nombre} relacion={contacto.relacion} telefono = {contacto.telefono} />
                            
                            </Swipeable>   

                            
                        ))}
                    </Pressable>

                    <Pressable className="p-4 py-6 flex justify-center items-center border m-6 rounded-xl active:bg-slate-200/70" onPress={() => router.navigate('/expediente/contactos-emergencia/agregar-contacto')}>
                        <Text className="text-md">+ Agregar contacto</Text>
                    </Pressable>
                </ScrollView>
        </View>
    )
}