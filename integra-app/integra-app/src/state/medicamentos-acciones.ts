import { batch } from "@legendapp/state"
import { convertirALista } from "./consultas"
import { medicamentos$ } from "./medicamentos"
import { estaSinResolver, tomas$ } from "./tomas"

function tomasDelMedicamento(medicamentoId: string) {
    return convertirALista(tomas$.get()).filter((t) => t.medicamento_id === medicamentoId)
}

export function suspenderMedicamento(medicamentoId: string) {
    const ahora = Date.now()

    const aCancelar = tomasDelMedicamento(medicamentoId).filter(
        (t) => estaSinResolver(t) && new Date(t.programada_para).getTime() >= ahora,
    )

    batch(() => {
        medicamentos$[medicamentoId].assign({ activo: false })
        for (const t of aCancelar) tomas$[t.id].delete()
    })
}

export function reactivarMedicamento(medicamentoId: string) {
    medicamentos$[medicamentoId].assign({ activo: true })
}

export function eliminarMedicamento(medicamentoId: string) {
    const aEliminar = tomasDelMedicamento(medicamentoId)

    batch(() => {
        for (const t of aEliminar) tomas$[t.id].delete()
        medicamentos$[medicamentoId].delete()
    })
}