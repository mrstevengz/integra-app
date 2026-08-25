import { EstadoToma } from "@/state/tomas";
import { color } from "@/theme/colors";
import { ChevronRight, Hourglass, LucideIcon, X } from "lucide-react-native";
import { Check } from 'lucide-react-native';


export type EstadoVisual = {
    etiqueta: string
    tile: string          
    iconoColor: string    
    titulo: string        
    detalle: string       
    accionable: boolean   
}


export function etiquetaEstado(estado: EstadoToma): string {
    const map: Record<EstadoToma, string> = {
        pendiente: 'Pendiente',
        tomada: 'Tomada',
        pospuesta: 'Pospuesta',
        omitida: 'Omitida'
    }
    return map[estado]
}

export function colorEstado(estado: EstadoToma): string {
    const map: Record<EstadoToma, string> = {
        pendiente: 'text-content',
        tomada: 'text-success-on-subtle',
        pospuesta: 'text-warning-on-subtle',
        omitida: 'text-danger',
    }
    return map[estado]
}

export function colorEstadoIcono(estado: EstadoToma): string {
    const map: Record<EstadoToma, string> = {
        pendiente: '#4b5563',           
        tomada: '#22c55e',              
        pospuesta: '#f59e0b',           
        omitida: '#ef4444',             
    }
    return map[estado] || '#4b5563';   
}



const ICONOS: Record<EstadoToma, LucideIcon> = {
    pendiente: ChevronRight,
    tomada: Check,
    pospuesta: Hourglass,
    omitida: X

}

export function iconoEstado(estado: EstadoToma | undefined) {
    const Icono = estado ? ICONOS[estado] : Check
    return <Icono className={colorEstadoIcono(estado as EstadoToma)}/>

}
