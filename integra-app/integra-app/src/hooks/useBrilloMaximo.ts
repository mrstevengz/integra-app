import { useCallback } from "react"
import { useFocusEffect } from "expo-router"
import { Platform } from "react-native"
import * as Brightness from "expo-brightness"

function restaurarBrillo(previo: number | null) {
    if (Platform.OS === 'android') {
        Brightness.restoreSystemBrightnessAsync().catch(() => {})
        return
    }

    if (previo != null) Brightness.setBrightnessAsync(previo).catch(() => {})
}

export function useBrilloMaximo(activo: boolean) {
    useFocusEffect(
        useCallback(() => {
            if (!activo) return

            let previo: number | null = null
            let cancelado = false

            ;(async () => {
                try {
                    previo = await Brightness.getBrightnessAsync()
                    if (!cancelado) await Brightness.setBrightnessAsync(1)
                } catch (e) {
                    console.warn('[brillo] no se pudo ajustar', e)
                }
            })()

            return () => {
                cancelado = true
                restaurarBrillo(previo)
            }
        }, [activo]),
    )
}