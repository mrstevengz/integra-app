import { useState } from "react"
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Camera } from "lucide-react-native"
import { urlPublica } from "@/lib/almacenamiento"
import { actualizarAvatar, eliminarAvatar } from "@/state/perfil-acciones"
import { color } from "@/theme/colors"

type AvatarPerfilProps = {
    perfilId: string
    avatarPath: string | null
    iniciales: string
    editable?: boolean
    tamano?: number
}

export default function AvatarPerfil({
    perfilId, avatarPath, iniciales, editable = false, tamano = 112,
}: AvatarPerfilProps) {
    const [ocupado, setOcupado] = useState(false)

    async function elegirDeGaleria() {
        const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permiso.granted) {
            Alert.alert(
                'Sin acceso a las fotos',
                'Activa el permiso desde los ajustes del telefono para elegir una foto.',
            )
            return
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
        })

        if (resultado.canceled) return

        const imagen = resultado.assets?.[0]

        if (!imagen?.base64) {
            Alert.alert('No se pudo leer la imagen', 'Intenta con otra foto.')
            return
        }

        setOcupado(true)
        try {
            await actualizarAvatar(perfilId, imagen.base64, imagen.mimeType ?? 'image/jpeg')
        } catch (error) {
            console.error('[avatar] fallo la subida', error)
            Alert.alert('No se pudo subir la foto', 'Revisa tu conexion e intenta de nuevo.')
        } finally {
            setOcupado(false)
        }
    }

    async function quitarFoto() {
        setOcupado(true)
        try {
            await eliminarAvatar()
        } finally {
            setOcupado(false)
        }
    }

    function abrirOpciones() {
        if (!avatarPath) {
            elegirDeGaleria()
            return
        }

        Alert.alert('Foto de perfil', undefined, [
            { text: 'Elegir otra foto', onPress: elegirDeGaleria },
            { text: 'Quitar foto', style: 'destructive', onPress: quitarFoto },
            { text: 'Cancelar', style: 'cancel' },
        ])
    }

    const circulo = { width: tamano, height: tamano, borderRadius: tamano / 2 }

    return (
        <Pressable
            onPress={editable ? abrirOpciones : undefined}
            disabled={!editable || ocupado}
            accessibilityRole={editable ? 'button' : 'image'}
            accessibilityLabel={editable ? 'Cambiar foto de perfil' : 'Foto de perfil'}
            className="self-center"
        >
            <View
                style={circulo}
                className="items-center justify-center overflow-hidden bg-primary-subtle border border-line-primary"
            >
                {avatarPath ? (
                    <Image source={{ uri: urlPublica('avatares', avatarPath) }} style={circulo} />
                ) : (
                    <Text
                        className="font-lexend-bold text-primary"
                        style={{ fontSize: tamano * 0.34 }}
                    >
                        {iniciales}
                    </Text>
                )}

                {ocupado && (
                    <View style={circulo} className="absolute items-center justify-center bg-content/40">
                        <ActivityIndicator color={color.surfaceRaised} />
                    </View>
                )}
            </View>

            {editable && !ocupado && (
                <View
                    className="absolute bottom-0 right-0 h-9 w-9 items-center justify-center rounded-full bg-primary"
                    style={{ borderWidth: 2, borderColor: color.surface }}
                >
                    <Camera size={17} color={color.surfaceRaised} />
                </View>
            )}
        </Pressable>
    )
}