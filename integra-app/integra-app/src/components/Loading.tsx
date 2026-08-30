import { color } from "@/theme/colors";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "./TopBar";

type LoadingProps = {
    nombre: string
    regresa: boolean 
}

export default function Loading({nombre, regresa}: LoadingProps) {
    return (
         <View className="flex-1 bg-surface">
            <SafeAreaView edges={['top']} className="bg-surface">
                <TopBar name={nombre} canGoBack={regresa}/>
            </SafeAreaView>
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={color.primary}/>
            </View>
                </View>
    )
}