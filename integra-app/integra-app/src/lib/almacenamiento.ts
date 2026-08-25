import { decode } from 'base64-arraybuffer'
import { supabase } from './supabase'

//Bucket/Cubeta es donde va almacenada la informacion que se envia / recibe. Se especifica como avatares o articulos porque son los unicos dos lugares donde se usaran imagenes, para limitar errores con dejarlo tipo string.
export type Cubeta = 'avatares' | 'articulos'

export async function subirImagen(cubeta: Cubeta, ruta: string, base64: string, contentType = 'image/jpeg'): Promise<void> {

    const {error} = await supabase.storage.from(cubeta).upload(ruta, decode(base64), {contentType})

    if (error) throw error
}

//No es async, simplemente arma un string concatenando el URL del proyecto, el bucket y la ruta.
export function urlPublica(cubeta: Cubeta, ruta: string): string {
    return supabase.storage.from(cubeta).getPublicUrl(ruta).data.publicUrl
}

export async function borrarImagen(cubeta: Cubeta, ruta: string): Promise<void> {
    const { error } = await supabase.storage.from(cubeta).remove([ruta])
    if (error) throw error
}