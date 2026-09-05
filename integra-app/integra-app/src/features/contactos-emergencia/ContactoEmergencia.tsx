import { color } from "@/theme/colors";
import { UserStar } from "lucide-react-native";
import { Pressable, View, Text } from "react-native";

export type ContactoEmergenciaProps = {
    nombre: string;
    relacion: string
    telefono: string
}

//Fila que genera el contacto de emergencia. Recibe nombre, relacion y telefono (datos de la tabla) y una funcion que se le pasa en la pantalla
export default function ContactoEmergencia({nombre, relacion, telefono}: ContactoEmergenciaProps) {
    return (
         <Pressable className="flex flex-row items-center gap-3 p-4 px-5 bg-surface-raised border border-line active:bg-surface-sunken">
            <View className="bg-danger-subtle w-12 h-12 rounded-full items-center justify-center">
                <UserStar color={color.danger}/>
            </View>
            
        
            <View className="flex-1">
                <Text className="text-lg font-semibold">{nombre}</Text>
            <View className="flex flex-row gap-2">
                <Text className="font-lexend text-content-muted">{relacion ?? 'Sin definir'}</Text>
                <Text className="font-lexend">·</Text>
                <Text className="font-lexend text-content-muted">{telefono ?? 'Sin definir'}</Text>
            </View>
            </View>
        </Pressable>
    )
}