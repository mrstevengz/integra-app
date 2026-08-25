import { CampoTexto } from "@/components/CampoTexto"
import { CampoSelect } from "@/components/CampoSelect"
import TopBar from "@/components/TopBar"
import { perfil$ } from "@/state/usuario"
import { zodResolver } from "@hookform/resolvers/zod"
import { useValue } from "@legendapp/state/react"
import { router } from "expo-router"
import { useForm } from "react-hook-form"
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text } from "react-native"
import { View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { useState } from "react"
import { ContactosForm, contactosSchema, TIPO_RELACION } from "@/features/contactos-emergencia/contactos-schema"
import { contactosEmergencia$ } from "@/state/contactos-emergencia"
import { crearId } from "@/lib/ids"
import { color } from "@/theme/colors"

export default function AgregarAlergiaScreen() {
    const perfil = useValue(perfil$)
    const insets = useSafeAreaInsets()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {control, handleSubmit, reset} = useForm<ContactosForm>({
        resolver: zodResolver(contactosSchema),
        defaultValues: {
            nombre: '',
            telefono: '',
            relacion: ''
        }
    })

    function onSubmit(formValues: ContactosForm) {
        if (isSubmitting) return 
        setIsSubmitting(true)
        
        try {
            const id = crearId()
            contactosEmergencia$[id].set({
            id,
            perfil_id: perfil.id,
            nombre: formValues.nombre,
            telefono: formValues.telefono,
            relacion: formValues.relacion
        })
        reset(formValues)
        router.back()
        } catch (error) {
            console.error('No se pudo guardar el contacto', error)
        } finally {
            setIsSubmitting(false)
        }
       
    }

     if (!perfil.id || !contactosEmergencia$) return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Agregar contacto de emergencia' canGoBack={true}/>
            </SafeAreaView>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={color.primary}/>
            </View>
        </View>
    )

    return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Agregar contacto' canGoBack={true}/>
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
                    keyboardShouldPersistTaps="handled"
                >
                    <CampoTexto name="nombre" control={control} title="Nombre"/>

                    <CampoTexto name="telefono" control={control} title="Numero telefonico" keyboardType="phone-pad" telefono={true}/>

                    <CampoSelect name="relacion" control={control} title="Tipo de relacion" opciones={TIPO_RELACION}/>

                    <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting}
                        className="bg-primary active:bg-primary-pressed p-4 rounded-control mt-6">
                        <Text className="font-lexend text-center text-content-on-primary">
                            {isSubmitting? "Guardando..." : "Guardar contacto"}
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}