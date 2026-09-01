import {supabase} from '@/lib/supabase'
import { observable } from '@legendapp/state'
import { getAllSyncStates } from '@legendapp/state/sync'
import type { Session } from '@supabase/supabase-js'
import { makeRedirectUri } from 'expo-auth-session'
import * as QueryParams from 'expo-auth-session/build/QueryParams'
import * as WebBrowser from 'expo-web-browser'

export const auth$ = observable({
    session: null as Session | null,
    cargando: true,
    cerrandoSesion: false
})

//TODO: POR COMENTAR

async function limpiarDatosLocales() {
    //Resetear TODAS las tablas sincronizadas 
    //en memoria y en su cache persistida
    await Promise.all(
        getAllSyncStates().map(([syncState$]) => syncState$.reset())
    )
}

supabase.auth.onAuthStateChange((evento, sesion) => {
    auth$.session.set(sesion)
    auth$.cargando.set(false)

    if(evento === "SIGNED_OUT" && !auth$.cerrandoSesion.get()) {
        auth$.cerrandoSesion.set(true)
        limpiarDatosLocales().finally(() => auth$.cerrandoSesion.set(false))
    }
})

export async function cerrarSesion() {
    //Bloquea la navegacion hasta que la limpieza termine por completo.
    auth$.cerrandoSesion.set(true)

    try {
        //Invalidar la sesion local y del servidor
        await supabase.auth.signOut()
        await limpiarDatosLocales()
    } finally {
        auth$.cerrandoSesion.set(false)
    }
}

const URL_REDIRECCION = makeRedirectUri({ path: 'auth/callback' })

export async function iniciarSesionConGoogle(): Promise<boolean> {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: URL_REDIRECCION, skipBrowserRedirect: true }
    })
    if (error) throw error

    const resultado = await WebBrowser.openAuthSessionAsync(data.url ?? '', URL_REDIRECCION)
    if (resultado.type !== 'success') return false

    const { params, errorCode } = QueryParams.getQueryParams(resultado.url)
    if (errorCode) throw new Error(errorCode)

    const { error: errorSesion } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token
    })
    if (errorSesion) throw errorSesion

    return true
}