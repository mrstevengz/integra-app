import { buscarPorId } from "@/state/consultas";
import { router, useLocalSearchParams } from "expo-router";
import { useValue } from "@legendapp/state/react";
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "@/components/TopBar";
import { AlergiasForm, alergiasSchema, SEVERIDAD_ALERGIA} from "@/features/alergias/alergias-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CampoTexto } from "@/components/CampoTexto";
import { CampoSelect } from "@/components/CampoSelect";
import { alergias$ } from "@/state/alergias";

export default function EditarCondicion() {
    const {alergiaId} = useLocalSearchParams()
    const insets = useSafeAreaInsets()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const alergiasLista = useValue(alergias$)
    const item = buscarPorId(alergiasLista, alergiaId as string)

    const {control, handleSubmit, reset} = useForm<AlergiasForm>({

        resolver: zodResolver(alergiasSchema),
        mode: 'onTouched',
        defaultValues: {
            nombre: '',
            severidad: '',
            detalles: ''
        },

        values: item ? {
            nombre: item.nombre,
            severidad: item.severidad,
            detalles: item.detalles,
        }: undefined
    })


    function onSubmit(formValues: AlergiasForm) {
        if (isSubmitting) return 
        setIsSubmitting(true)
        
        if (!item) return
        const id = item.id
        try {
            alergias$[id].assign!({
            nombre: formValues.nombre,
            severidad: formValues.severidad,
            detalles: formValues.detalles
            })

            reset(formValues)
            router.back()
        } catch (error) {
            console.error('No se pudo guardar la alergia', error)
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
        <View className="flex-1">
            <SafeAreaView edges={['top']} className="bg-slate-100">
                <TopBar name='Editar' canGoBack={true}/>
            </SafeAreaView>
            <KeyboardAvoidingView className="flex-1 bg-slate-100" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView
                    className="flex-grow bg-slate-100"
                    contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 20 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <CampoTexto name="nombre" control={control} title="Nombre de la condicion"/>

                    <CampoSelect name="severidad" control={control} title="Tipo de condicion" opciones={SEVERIDAD_ALERGIA}/>

                    <CampoTexto name="detalles" control={control} title="Detalles de la condicion (opcional)"/>
                </ScrollView>

                <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting}
                    style={{ marginBottom: insets.bottom + 12 + 49 }}
                    className="bg-primary active:bg-primary-pressed p-4 rounded-control mx-5 mt-3 mb-4">
                    <Text className="font-lexend text-center text-content-on-primary">
                        {isSubmitting? "Guardando..." : "Guardar condicion"}
                    </Text>
                </Pressable>
            </KeyboardAvoidingView>
        </View>
    )
}