import { Path } from "react-hook-form"
import { RegistroForm } from "./registro-schema"

export type Paso = {
    titulo: string,
    subtitulo: string,
    campos: Path<RegistroForm>[]
}

export const PASOS: Paso[] = [
    {
        titulo: 'Informacion basica',
        subtitulo: '¡Hola! Cuéntanos un poco sobre ti.',
        campos: ['nombre', 'apellidos', 'email', 'fechaNacimiento']
    },
    {
        titulo: 'Contraseña',
        subtitulo: 'Protege tu cuenta con una contraseña segura.',
        campos: ['password', 'confirmar']
    },
    {
        titulo: 'Datos de contacto',
        subtitulo: 'Verifica tu identidad y contacto.',
        campos: ['telefono', 'cedula']
    },
    
]