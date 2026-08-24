import { CampoTexto } from "@/components/CampoTexto"
import { CondicionesForm, condicionesSchema, TIPO_CONDICION } from "@/features/condiciones/condiciones-schema"
import { CampoSelect } from "@/components/CampoSelect"
import TopBar from "@/components/TopBar"
import { condiciones$ } from "@/state/condiciones"
import { perfil$ } from "@/state/usuario"
import { zodResolver } from "@hookform/resolvers/zod"
import { useValue } from "@legendapp/state/react"
import { router } from "expo-router"
import { useForm } from "react-hook-form"
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text } from "react-native"
import { View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import * as Crypto from 'expo-crypto';
import { useState } from "react"
import { crearId } from "@/lib/ids"
import { color } from "@/theme/colors"

export default function AgregarCondicionScreen() {
    const perfil = useValue(perfil$)
    const insets = useSafeAreaInsets()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {control, handleSubmit, reset} = useForm<CondicionesForm>({
        resolver: zodResolver(condicionesSchema),
        defaultValues: {
            nombre: '',
            tipo: '',
            detalles: ''
        }
    })


    function onSubmit(formValues: CondicionesForm) {
        if (isSubmitting) return 
        setIsSubmitting(true)
        
        try {
            const id = crearId()
            condiciones$[id].set({
            id,
            perfil_id: perfil.id,
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

     if (!perfil.id) return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Agregar condicion' canGoBack={true}/>
            </SafeAreaView>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={color.primary}/>
            </View>
        </View>
    )

    return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Agregar condicion' canGoBack={true}/>
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
                    <CampoTexto name="nombre" control={control} title="Nombre de la condicion"/>

                    <CampoSelect name="tipo" control={control} title="Tipo de condicion" opciones={TIPO_CONDICION}/>

                    <CampoTexto name="detalles" control={control} title="Detalles de la condicion" opcional={true}/>

                    <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting}
                        className="bg-primary active:bg-primary-pressed p-4 rounded-control mt-6">
                        <Text className="font-lexend text-center text-content-on-primary">
                            {isSubmitting? "Guardando..." : "Guardar condicion"}
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}