import { Link, RelativePathString, router } from "expo-router";
import { View, Text } from "react-native";

type PerfilBoxProps = {
    titulo: string;
    children: React.ReactNode
    link: RelativePathString
    linkName: string
}

type PerfilBoxTextProps = {
    titulo: string
    data: string | null
}

//PerfilBox funciona como un contenedor para PerfilBoxText. Recibe un titulo, link y nombre del link, y se le pasa mas componentes en {children}
export default function PerfilBox({titulo, children, link, linkName}: PerfilBoxProps) {
    return (
        <View className="flex flex-col">
            <View className="flex flex-row justify-between items-center px-4 my-4">
                <Text className="text-content uppercase tracking-wider font-lexend"
                onPress={() => router.navigate(link)}>{titulo}</Text>
                <Link className = "font-lexend text-primary text-label" href={link}>{linkName}</Link>
            </View>
            {children}
        </View>
    )
}

//Fila para poner dentro de PerfilBox y renderizar la informacion del usuario. Recibe un campo generico de data (puede ser fecha de nacimiento, doctor, etc) y un titulo que se le da en la pantalla
export function PerfilBoxText({titulo, data}: PerfilBoxTextProps) {
    return (
    <View className="flex flex-row justify-between p-4 px-5 bg-white border-b border-line group-active:bg-slate-200 ">
        <Text className="font-lexend text-body">{titulo}</Text>
        {data 
        ? <Text className="font-lexend text-label">{data}</Text> 
        :  <Text className="font-lexend text-label text-content-muted">Sin definir</Text> }

    </View>
    )
}