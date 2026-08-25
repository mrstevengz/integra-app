import { router, useLocalSearchParams } from "expo-router";
import { useValue } from "@legendapp/state/react";
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "@/components/TopBar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CampoTexto } from "@/components/CampoTexto";
import { CampoSelect } from "@/components/CampoSelect";
import { contactosEmergencia$} from "@/state/contactos-emergencia";
import { buscarPorId } from "@/state/consultas";
import { ContactosForm, contactosSchema, TIPO_RELACION } from "@/features/contactos-emergencia/contactos-schema";

export default function EditarCondicion() {
    const {contactoId} = useLocalSearchParams()
    const insets = useSafeAreaInsets()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const contactosLista = useValue(contactosEmergencia$)
    const item = buscarPorId(contactosLista, contactoId as string)

    const {control, handleSubmit, reset, formState: {isDirty}} = useForm<ContactosForm>({

        resolver: zodResolver(contactosSchema),
        mode: 'onTouched',
        defaultValues: {
            nombre: '',
            relacion: '',
            telefono: ''
        },

        values: item ? {
            nombre: item.nombre,
            relacion: item.relacion,
            telefono: item.telefono,
        }: undefined
    })


    function onSubmit(formValues: ContactosForm) {
        if (isSubmitting) return 
        setIsSubmitting(true)

        if (!item) return
        const id = item.id
        try {
            contactosEmergencia$[id].assign!({
            nombre: formValues.nombre,
            relacion: formValues.relacion,
            telefono: formValues.telefono
            })

            reset(formValues)
            router.back()
        } catch (error) {
            console.error('No se pudo guardar el contacto de emergencia', error)
        } finally {
            setIsSubmitting(false)
        }
       
    }

    if (!item) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-gray-400">Error</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Editar' canGoBack={true}/>
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

                    <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting || !isDirty}
                        className="bg-primary active:bg-primary-pressed p-4 rounded-control mt-6">
                        <Text className="font-lexend text-center text-content-on-primary">
                            {isSubmitting? "Guardando..." : "Guardar contacto de emergencia"}
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}