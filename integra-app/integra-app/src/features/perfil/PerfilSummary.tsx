import { conseguirIniciales, edadEnAnios, Perfil } from "@/state/usuario";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";
import AvatarPerfil from "./AvatarPerfil";

type PerfilSummaryProps = {
    perfil: Perfil
}

//Retorna el 'resumen' del perfil del usuario, aqui deberia ir la imagen que seleccionen tambien. Se le pasa el nombre, edad, genero y cedula, y al hacer click (onPress) navega a la pagina /expediente/perfil para que el usuario pueda cambiar su informacion
export default function PerfilSummary({perfil}: PerfilSummaryProps) {
    return (
        <Pressable className="flex flex-row gap-4 p-4 border-b border-black/20 active:bg-black/5 bg-white"
            onPress={() => router.navigate("/expediente/perfil")}>
            <View className="items-center">
                <AvatarPerfil
                perfilId={perfil.id}
                avatarPath={perfil.avatar_path}
                iniciales={conseguirIniciales(perfil)}
                tamano={80}
                />
            </View>
            <View className="flex-1">
                <Text className="text-3xl font-semibold">{perfil.nombre}</Text>
                <Text className="text-lg color-black/50">{perfil.fecha_nacimiento ? edadEnAnios(perfil.fecha_nacimiento) : null} años | {perfil.genero ? perfil.genero : 'Por definir'}</Text>
                <Text className="text-lg color-black/50">Cedula: {perfil.cedula ? perfil.cedula : 'Por definir'}</Text>
            </View>
        </Pressable>
    )
}