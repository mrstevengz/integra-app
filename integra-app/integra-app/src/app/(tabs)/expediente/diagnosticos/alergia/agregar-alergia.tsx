import { CampoTexto } from "@/components/CampoTexto"
import { AlergiasForm, alergiasSchema, SEVERIDAD_ALERGIA } from "@/features/alergias/alergias-schema"
import { CampoSelect } from "@/components/CampoSelect"
import TopBar from "@/components/TopBar"
import { alergias$ } from "@/state/alergias"
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

export default function AgregarAlergiaScreen() {
    const perfil = useValue(perfil$)
    const insets = useSafeAreaInsets()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {control, handleSubmit, reset} = useForm<AlergiasForm>({
        resolver: zodResolver(alergiasSchema),
        defaultValues: {
            nombre: '',
            severidad: '',
            detalles: ''
        }
    })
    
    function onSubmit(formValues: AlergiasForm) {
        if (isSubmitting) return 
        setIsSubmitting(true)
        
        try {
            const id = crearId()
            alergias$[id].set({
            id,
            perfil_id: perfil.id,
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

     if (!perfil.id) return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Agregar alergia' canGoBack={true}/>
            </SafeAreaView>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={color.primary}/>
            </View>
        </View>
    )

    return (
        <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name='Agregar alergia' canGoBack={true}/>
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
                    <CampoTexto name="nombre" control={control} title="Nombre de la alergia"/>

                    <CampoSelect name="severidad" control={control} title="Severidad de la alergia" opciones={SEVERIDAD_ALERGIA}/>

                    <CampoTexto name="detalles" control={control} title="Detalles de la alergia" opcional={true}/>

                    <Pressable onPress={handleSubmit(onSubmit)} disabled={isSubmitting}
                        className="bg-primary active:bg-primary-pressed p-4 rounded-control mt-6">
                        <Text className="font-lexend text-center text-content-on-primary">
                            {isSubmitting? "Guardando..." : "Guardar alergia"}
                        </Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}