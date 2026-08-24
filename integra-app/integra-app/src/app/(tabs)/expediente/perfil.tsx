import { View, ActivityIndicator, ScrollView, Pressable, Text, KeyboardAvoidingView, Platform, TouchableOpacity} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "@/components/TopBar";
import { useValue } from "@legendapp/state/react";
import { perfil$ } from "@/state/usuario";
import { useForm } from "react-hook-form";
import { PerfilForm, perfilSchema } from "@/features/perfil/perfil-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { OPCIONES_GENEROS, TIPOS_SANGRE } from "@/features/perfil/perfil-schema";
import { CampoTexto } from "@/components/CampoTexto";
import { CampoSelect } from "@/components/CampoSelect";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { color } from "@/theme/colors";

export default function PerfilScreen() {
    const perfil = useValue(perfil$)
    const insets = useSafeAreaInsets()

    const {control, handleSubmit, formState: {isDirty}, reset} = useForm<PerfilForm>({
        resolver: zodResolver(perfilSchema),
        mode: 'onTouched',
        defaultValues: {
            nombre: '', apellidos: '', genero: '', cedula: '', tipoSangre: '', telefono: '', medicoTratante: '',
        },
         values: perfil ? {
            nombre: perfil.nombre ?? '',
            apellidos: perfil.apellidos ?? '',
            telefono: perfil.telefono ?? '',
            cedula: perfil.cedula ?? '',
            genero: perfil.genero ?? '',
            tipoSangre: perfil.tipo_sangre ?? '',
            medicoTratante: perfil.medico_tratante ?? '',
        } : undefined,
    })

    function onSubmit(formValues: PerfilForm) {
        perfil$.assign({
            nombre: formValues.nombre,
            apellidos: formValues.apellidos,
            genero: formValues.genero || null,
            cedula: formValues.cedula || null,
            tipo_sangre: formValues.tipoSangre || null,
            telefono: formValues.telefono || null,
            medico_tratante: formValues.medicoTratante || null,
        })

        reset(formValues)
        router.back()
    }

    if (!perfil) return (
    <View className="flex-1 bg-surface">
        <SafeAreaView edges={['top']} className="bg-surface">
            <TopBar name='Mi Expediente' canGoBack={false}/>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={color.primary}/>
        </View>
    </View>
    )

    

    return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Datos personales' canGoBack={true}/>
            </SafeAreaView>

        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    className="flex-grow"
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 20,
                        paddingTop: 20,
                        paddingBottom: insets.bottom + 12 + 49,
                    }}
                    keyboardShouldPersistTaps="handled">
                
                <TouchableOpacity className="w-28 h-28 rounded-full flex items-center justify-center bg-slate-300 m-auto mb-8">
                    <Ionicons name="person-sharp" size={40}/>
                </TouchableOpacity>

                <CampoTexto
                name="nombre" control = {control} title="Nombre"
                autoComplete="name"
                />

                <CampoTexto
                name="apellidos" control = {control} title="Apellidos" 
                autoComplete="family-name"
                />

                <CampoSelect name="genero" control={control} title="Genero" opciones={OPCIONES_GENEROS}/>

                <CampoTexto
                name="telefono" control = {control} title="Numero telefonico" 
                keyboardType="phone-pad"
                autoComplete="tel" telefono={true}
                />

                <CampoSelect name="tipoSangre" control={control} title="Tipo de sangre" opciones={TIPOS_SANGRE}/>

                <CampoTexto
                name="cedula" control = {control} title="Cedula de identidad" 
                />

                <CampoTexto
                name="medicoTratante" control = {control} title="Medico Tratante"
                />


                <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={!isDirty}
                className={`p-4 rounded-control mt-6 ${isDirty ? 'bg-primary active:bg-primary-pressed' : 'bg-content-disabled'}`}
                >
                    <Text className="font-lexend text-center text-content-on-primary">Guardar cambios</Text>
                </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}