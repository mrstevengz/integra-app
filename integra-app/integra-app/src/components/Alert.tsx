import { Alert } from "react-native"


export const deleteAlert = (confirm: () => void) => {
    Alert.alert('Estas seguro que quieres eliminar esta fila', 'Esta accion no puede ser revertida', [
        {
            text: 'Cancelar',
            style: 'cancel'
        },
        {
            text: 'Confirmar',
            onPress: () => confirm(),
        }
    ])
}

type Confirmacion = {
    titulo: string
    mensaje: string
    textoConfirmar?: string
    destructivo?: boolean
    alConfirmar: () => void
}

export function pedirConfirmacion({
    titulo, mensaje, textoConfirmar = 'Confirmar', destructivo = false, alConfirmar,
}: Confirmacion) {
    Alert.alert(titulo, mensaje, [
        { text: 'Cancelar', style: 'cancel' },
        { text: textoConfirmar, style: destructivo ? 'destructive' : 'default', onPress: alConfirmar },
    ])
}