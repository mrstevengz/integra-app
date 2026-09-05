import { borrarImagen, subirImagen } from '@/lib/almacenamiento'
import { crearId } from '@/lib/ids'
import { perfil$ } from './usuario'

//Actualiza o crea un avatar si no tiene. Recibe una imagen de expo image picker y crea una ruta con un UUID aleatorio. Sube la imagen al servidor y guarda la ruta nueva al perfil del usuario.
export async function actualizarAvatar(
    perfilId: string,
    base64: string,
    contentType: string,
): Promise<void> {
    const rutaAnterior = perfil$.avatar_path.get()
    const rutaNueva = `${perfilId}/${crearId()}.jpg`

    await subirImagen('avatares', rutaNueva, base64, contentType)

    perfil$.avatar_path.set(rutaNueva)

    if (rutaAnterior) {
        try {
            await borrarImagen('avatares', rutaAnterior)
        } catch (error) {
            console.warn('[avatar] no se pudo borrar la imagen anterior', error)
        }
    }
}

//Si existe una ruta almacenada en el perfil, borra la imagen del servidor y actualiza la ruta.
export async function eliminarAvatar(): Promise<void> {
    const ruta = perfil$.avatar_path.get()
    if (!ruta) return

    perfil$.avatar_path.set(null)

    try {
        await borrarImagen('avatares', ruta)
    } catch (error) {
        console.warn('[avatar] no se pudo borrar la imagen', error)
    }
}