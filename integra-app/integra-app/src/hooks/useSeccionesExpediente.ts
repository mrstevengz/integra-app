import { useValue } from "@legendapp/state/react"
import { perfil$ } from "@/state/usuario"
import { condiciones$, condicionesDelPerfil } from "@/state/condiciones"
import { alergias$ } from "@/state/alergias"
import { contactosEmergencia$, contactosDelPerfil } from "@/state/contactos-emergencia"
import { checklistExpediente$, ClaveChecklist, seccionesExpediente } from "@/state/checklist-expediente"
import { delPerfil } from "@/state/consultas"

export function useSeccionesExpediente() {
    const perfil = useValue(perfil$)
    const condiciones = condicionesDelPerfil(useValue(condiciones$), perfil.id)
    const alergias = delPerfil(useValue(alergias$), perfil.id)
    const contactos = contactosDelPerfil(useValue(contactosEmergencia$), perfil.id)
    const confirmadas = useValue(checklistExpediente$)

    const seccionesLista = seccionesExpediente(perfil, condiciones.length, alergias.length, contactos.length, confirmadas)
    const completas = seccionesLista.filter(seccion => seccion.completada)

    const checkSeccion = (id: ClaveChecklist) => {
        checklistExpediente$[id].set(true)
    }

    return { seccionesLista, completas, checkSeccion }
}
