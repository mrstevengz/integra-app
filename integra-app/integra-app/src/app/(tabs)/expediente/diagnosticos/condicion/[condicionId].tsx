import { condiciones$} from "@/state/condiciones";
import { buscarPorId } from "@/state/consultas";
import { router, useLocalSearchParams } from "expo-router";
import { useValue } from "@legendapp/state/react";
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "@/components/TopBar";
import { CondicionesForm, condicionesSchema, TIPO_CONDICION } from "@/features/condiciones/condiciones-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { CampoTexto } from "@/components/CampoTexto";
import { CampoSelect } from "@/components/CampoSelect";

export default function EditarCondicion() {
    const {condicionId} = useLocalSearchParams()
    const insets = useSafeAreaInsets()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const condicionesLista = useValue(condiciones$)
    const item = buscarPorId(condicionesLista, condicionId as string)

    const {control, handleSubmit, reset} = useForm<CondicionesForm>({

        resolver: zodResolver(condicionesSchema),
        mode: 'onTouched',
        defaultValues: {
            nombre: '',
            tipo: '',
            detalles: ''
        },

        values: item ? {
            nombre: item.nombre,
            tipo: item.tipo,
            detalles: item.detalles,
        }: undefined
    })


    function onSubmit(formValues: CondicionesForm) {
        if (!item) return
        const id = item.id
        try {
            condiciones$[id].assign!({
            nombre: formValues.nombre,
            tipo: formValues.tipo,
            detalles: formValues.detalles
            })

            reset(formValues)
            router.back()
        } catch (error) {
            console.error('No se pudo guardar la condicion', error)
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

                    <CampoSelect name="tipo" control={control} title="Tipo de condicion" opciones={TIPO_CONDICION}/>

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