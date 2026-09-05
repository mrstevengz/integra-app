import {cerrarSesion } from "@/state/auth";
import {perfil$ } from "@/state/usuario";
import { useValue } from "@legendapp/state/react";
import { Text, View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import TopBar from "@/components/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import PerfilSummary from "@/features/perfil/PerfilSummary";
import PerfilBox, { PerfilBoxText } from "@/features/perfil/PerfilBox";
import {condiciones$ } from "@/state/condiciones";
import { alergias$ } from "@/state/alergias";
import { contactosEmergencia$ } from "@/state/contactos-emergencia";
import { RelativePathString, router } from "expo-router";
import ContactoEmergencia from "@/features/contactos-emergencia/ContactoEmergencia";
import { checklistExpediente$ } from "@/state/checklist-expediente";
import {AlertTriangle, ChevronRight, CircleAlert, EyeClosedIcon, HeartPulse, LogOut, QrCode, User, UserPlus} from "lucide-react-native";
import { color } from "@/theme/colors";
import {delPerfil } from "@/state/consultas";
import { useSeccionesExpediente } from "@/hooks/useSeccionesExpediente";


export default function ExpedienteScreen() {
    //Obtener datos de sesion y perfil
    const { seccionesLista, completas } = useSeccionesExpediente()
    const perfil = useValue(perfil$)
    const condiciones = delPerfil(useValue(condiciones$), perfil.id)
    const alergias = delPerfil(useValue(alergias$), perfil.id)

    const contactos = delPerfil(useValue(contactosEmergencia$), perfil.id)

    

    if(!perfil.id || !condiciones) {
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

  const expedienteIncompleto = completas.length < seccionesLista.length

  return (

    <View className="flex-1">
        <SafeAreaView edges={['top']} className="bg-slate-100">

            <TopBar name='Mi Expediente' canGoBack={false} grande={true} subtitulo={`${new Date().toLocaleDateString('es-CR', {weekday: 'long'})}, ${new Date().getDate()} de ${new Date().toLocaleString('es-ES', {month: 'long'})}`}
            accion={() => router.navigate("/expediente/exportar")}
            accionIcono={<QrCode size={25} color={color.primary}/>}
            />

        </SafeAreaView>

        <ScrollView className="flex-grow bg-slate-100" contentContainerStyle={{paddingBottom: 100, paddingTop: 5 }}>

          <PerfilSummary perfil={perfil}/>

          {expedienteIncompleto && (
              <Pressable className="p-5 bg-surface-sunken gap-2"
              onPress={() => router.navigate("/expediente/completar")}>
                
                  <View className="flex-row">
                      <View className="flex-1 flex-row gap-2 items-center">
                        <CircleAlert/>
                        <Text className="font-lexend-bold">Expediente incompleto</Text>
                      </View>
                    
                     <Text className="font-lexend-bold text-body">{((completas.length / seccionesLista.length) * 100)}%</Text>
                  </View>

                  <View className="h-2 w-full overflow-hidden bg-content-disabled rounded-sheet">
                    <View className="h-full bg-primary rounded-sheet" style={{
                    width:  `${(completas.length/seccionesLista.length)* 100}%`
                    }}/>
                  </View>
                 
                  <View className="flex-row justify-between mt-2">
                    <Text className="font-lexend text-content-muted">Termina de completar tu perfil</Text>
                    <Pressable onPress={() => router.navigate("/expediente/completar")}>
                      <Text className="font-lexend text-label">Completar</Text>
                    </Pressable>
                  </View>
              </Pressable>
          )}

          

          <PerfilBox titulo="Datos Personales" link={"/expediente/perfil" as RelativePathString} linkName="Editar">
            <View className="flex flex-col">

              <PerfilBoxText titulo="Fecha de nac." data={perfil.fecha_nacimiento}/>
              <PerfilBoxText titulo="Telefono" data={perfil.telefono}/>
              <PerfilBoxText titulo="Tipo de sangre" data={perfil.tipo_sangre}/>
              <PerfilBoxText titulo="Medico tratante" data={perfil.medico_tratante}/>     

            </View>
          </PerfilBox> 

          <PerfilBox titulo="Condiciones" link={"/expediente/diagnosticos" as RelativePathString} linkName="Editar">
          {condiciones.length === 0 ? 
            <View className="flex-row justify-between p-4 px-5 bg-surface-raised items-center border-y border-line">
              <View className="flex-row items-center gap-4">
                <HeartPulse color={color.primary}/>
                <Text className="font-lexend text-label text-content-muted">Sin condiciones agregadas</Text>
              </View>
             
              <Pressable className="rounded-sheet p-3 border border-primary active:bg-primary-subtle" onPress={() => router.navigate('/expediente/diagnosticos/condicion/agregar-condicion')}>
                <Text className="text-primary font-lexend">Agregar</Text>
              </Pressable>

            </View>
        
          : 
            <View className="py-6 bg-surface-raised border-y border-line">         
            <ScrollView 
            contentContainerClassName="flex gap-3 bg-surface-raised px-6"
            horizontal
            showsHorizontalScrollIndicator={false}
            >
                {condiciones.map((condicion) => (
                  <View key={condicion.id} className="p-3 rounded-full border border-line bg-surface">
                  <Text
                  className="font-lexend text-label"
                  >{condicion.nombre}</Text>
                  </View>
                ))}
            </ScrollView>
            </View>
          }
          
          </PerfilBox>

          <PerfilBox titulo="Alergias" link={"/expediente/diagnosticos" as RelativePathString} linkName="Editar">
          {alergias.length === 0 ? 
             <View className="flex-row justify-between p-4 px-5 bg-surface-raised items-center border-y border-line border-l-4 border-l-danger">
              <View className="flex-row items-center gap-4">
                <AlertTriangle color={color.danger}/>
                <Text className="font-lexend text-label text-content-muted">Sin alergias registradas</Text>
              </View>
             
              <Pressable className="rounded-sheet p-3 border border-danger active:bg-primary-subtle" onPress={() => router.navigate('/expediente/diagnosticos/alergia/agregar-alergia')}>
                <Text className="text-danger font-lexend">Agregar</Text>
              </Pressable>

            </View>
          
          :
           <View className="py-6 bg-surface-raised border-y border-line border-l-4 border-l-danger">         
            <ScrollView 
            contentContainerClassName="flex gap-3 bg-surface-raised px-6"
            horizontal
            showsHorizontalScrollIndicator={false}
            >
                {alergias.map((alergia) => (
                  <View key={alergia.id} className="p-3 rounded-full border border-line bg-danger-subtle flex-row items-center gap-2 ">
                  <AlertTriangle size={20} color={color.danger}/>
                  <Text
                  className="font-lexend text-label text-danger"
                  >{alergia.nombre}</Text>
                  </View>
                ))}
            </ScrollView>
            </View>
          }
      
            
          </PerfilBox>

          <PerfilBox titulo="Contactos de Emergencia" link={"/expediente/contactos-emergencia" as RelativePathString} linkName="Agregar">
          {contactos.length === 0 ? 
             <Pressable className="flex-row justify-between p-4 py-6 bg-surface-raised items-center border-y border-line active:bg-surface-sunken" onPress={() => router.navigate('/expediente/contactos-emergencia')}>
              <View className="flex-row items-center gap-4">
                <View className="bg-danger-subtle w-12 h-12 rounded-full items-center justify-center">
                  <UserPlus color={color.danger}/>
                </View>
                
                <View className="flex-col">
                   <Text className="font-lexend text-content text-body">Agrega un contacto</Text>
                   <Text className="font-lexend text-content-muted">Para casos de emergencia</Text>
                </View>
               
              </View>
             
              <ChevronRight/>

            </Pressable>
        
          :   
             contactos.map((contacto) => (
              <Pressable key={contacto.id} onPress={() => router.navigate('/expediente/contactos-emergencia')}>
              <ContactoEmergencia  nombre={contacto.nombre} relacion={contacto.relacion} telefono = {contacto.telefono} />
              </Pressable>
              ))

          }
          </PerfilBox>

          <Pressable onPress={cerrarSesion} className="border border-danger-subtle items-center p-4 mx-4 rounded-card mt-8 flex-row justify-center gap-2 active:bg-surface-sunken">
            <LogOut color={color.danger}/>
            <Text className="font-lexend-bold text-danger text-body">Cerrar sesion</Text>
          </Pressable>
        </ScrollView>
    </View>
  );
}

