import {cerrarSesion } from "@/state/auth";
import { edadEnAnios, nombreCompleto, perfil$ } from "@/state/usuario";
import { useValue } from "@legendapp/state/react";
import { Text, View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import TopBar from "@/components/TopBar";
import { SafeAreaView } from "react-native-safe-area-context";
import PerfilSummary from "@/features/perfil/PerfilSummary";
import PerfilBox, { PerfilBoxText } from "@/features/perfil/PerfilBox";
import {condiciones$ } from "@/state/condiciones";
import { alergias$ } from "@/state/alergias";
import { contactosEmergencia$ } from "@/state/contactos-emergencia";
import { router } from "expo-router";
import ContactoEmergencia from "@/features/contactos-emergencia/ContactoEmergencia";
import { checklistExpediente$ } from "@/state/checklist-expediente";
import {QrCode} from "lucide-react-native";
import { color } from "@/theme/colors";
import { convertirALista, delPerfil } from "@/state/consultas";


export default function ExpedienteScreen() {
    //Obtener datos de sesion y perfil
    const perfil = useValue(perfil$)
    const condiciones = delPerfil(useValue(condiciones$), perfil.id)
    const alergias = delPerfil(useValue(alergias$), perfil.id)

    const contactos = delPerfil(useValue(contactosEmergencia$), perfil.id)
    const confirmadas = useValue(checklistExpediente$)

    

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

      const expedienteIncompleto = [
      perfil.genero == null || perfil.cedula == null,
      perfil.tipo_sangre == null,
      condiciones.length === 0,
      alergias.length === 0,
      contactos.length === 0,
    ].some((incompleta, i) => incompleta && !confirmadas[(['datosPersonales','tipoSangre','condiciones','alergias','contactoEmergencia'] as const)[i]])


    const nombre = nombreCompleto(perfil)

  return (

    <View className="flex-1">
        <SafeAreaView edges={['top']} className="bg-slate-100">

            <TopBar name='Mi Expediente' canGoBack={false} grande={true} subtitulo={`${new Date().toLocaleDateString('es-CR', {weekday: 'long'})}, ${new Date().getDate()} de ${new Date().toLocaleString('es-ES', {month: 'long'})}`}
            accion={() => router.navigate("/expediente/exportar")}
            accionIcono={<QrCode size={25} color={color.primary}/>}
            />

        </SafeAreaView>

        <ScrollView className="flex-grow bg-slate-100" contentContainerStyle={{paddingBottom: 100, paddingTop: 15 }}>

          <PerfilSummary perfil={perfil}/>

          {expedienteIncompleto && (
              <Pressable className="mt-3 p-4 px-5 bg-slate-200 border-l-2 border-slate-700 text-slate-500"
              onPress={() => router.navigate("/expediente/completar")}>
                  <Text>Expediente incompleto ——— Termina de completar tu perfil</Text>
              </Pressable>
          )}

          

          <PerfilBox titulo="Datos Personales" link="/expediente/perfil" linkName="Editar">
            <View className="flex flex-col">

              <PerfilBoxText titulo="Fecha de nac." data={perfil.fecha_nacimiento}/>
              <PerfilBoxText titulo="Telefono" data={perfil.telefono}/>
              <PerfilBoxText titulo="Tipo de sangre" data={perfil.tipo_sangre}/>
              <PerfilBoxText titulo="Medico tratante" data={perfil.medico_tratante}/>     

            </View>
          </PerfilBox> 

          <PerfilBox titulo="Condiciones" link="/expediente/diagnosticos" linkName="Editar">
          <ScrollView 
          contentContainerClassName="flex flex-row gap-3 px-4 mb-4 "
          horizontal
          >
            {condiciones.map((condicion) => (
              <Text
              key={condicion.id}
              className="p-2 border rounded-xl border-black/40 text-black/90"
              >{condicion.nombre}</Text>
            ))}
          </ScrollView>
          </PerfilBox>

          <PerfilBox titulo="Alergias" link="/expediente/diagnosticos" linkName="Editar">
            <ScrollView 
            contentContainerClassName="flex flex-row gap-3 px-4 mb-4"
            horizontal
            >
              {alergias.map((alergia) => (
                <Text
                key={alergia.id}
                className="p-2 border rounded-xl border-black/40 text-black/70"
                >{alergia.nombre}</Text>
              ))}
            </ScrollView>
          </PerfilBox>

          <PerfilBox titulo="Contactos de Emergencia" link="/expediente/contactos-emergencia" linkName="Agregar">
            {contactos.map((contacto) => (
              <Pressable key={contacto.id} onPress={() => router.navigate('/expediente/contactos-emergencia')}>
              <ContactoEmergencia  nombre={contacto.nombre} relacion={contacto.relacion} telefono = {contacto.telefono} />
              </Pressable>
            ))}
          </PerfilBox>

          <Pressable onPress={cerrarSesion} className="border border-danger-subtle items-center bg-red-500/60 p-4 mx-4 rounded-card mt-8">
            <Text className="font-lexend-bold text-danger">Cerrar sesion</Text>
          </Pressable>
        </ScrollView>
    </View>
  );
}

