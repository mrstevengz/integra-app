import { Image } from "expo-image";
import { router } from "expo-router";
import { Activity, Calendar, ChevronRight, HeartPulse, Pill } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function InicioIncompleto() {
    return (
        <>
            <View className="flex-col flex items-center bg-surface-raised p-6 rounded-card shadow-sm border border-line gap-4">
                <View className="p-3 rounded-card">
                    <Image
                    source={require("../../../assets/logos/icono.svg")}
                    style={{ width: 50, height: 50 }}
                    />
                </View>
                <Text className="font-lexend-bold text-title">Configura tu perfil de salud</Text>
                <Text className="font-lexend text-center text-label text-content-muted">Agrega tu primer registro para comenzar. Tus mediciones, medicamentos y citas apareceran aqui.</Text>
                <Pressable className="bg-primary active:bg-primary-pressed py-4 px-2 rounded-chip mt-6 items-center w-full" onPress={() => router.navigate('/expediente')}
                    accessibilityLabel="Configurar perfil"
                    accessibilityHint="Dale click al boton para ingresar a tu perfil de usuario"
                    accessibilityRole="button">
                    <Text className="font-lexend text-label text-white">Comenzar</Text>
                </Pressable>
            </View>

            <Text className="font-lexend text-label text-content-muted mt-4 mb-2">Configuracion rapida</Text>

            <Pressable className="flex-row items-center bg-surface-raised p-4 rounded-card shadow-sm border border-line gap-4 mb-3 active:bg-surface-sunken"
            onPress={() => router.navigate('/medicion')}
            accessibilityLabel="Registrar una medicion"
            accessibilityHint="Dale click al boton para ir a la pantalla de mediciones"
            accessibilityRole="button">
                <View className="flex-1 flex-row gap-4">
                    <View className="flex p-3 rounded-chip bg-surface">
                        <Activity/>
                    </View>

                    <View className="flex-col">
                        <Text className="font-lexend text-subheading">Registrar una medicion</Text>
                        <Text className="font-lexend text-caption text-content-muted">Peso, presion arterial, glucosa</Text>
                    </View>
                </View>

                <ChevronRight/>
                

            </Pressable>

            <Pressable className="flex-row items-center bg-surface-raised p-4 rounded-card shadow-sm border border-line gap-4 mb-3 active:bg-surface-sunken"
            onPress={() => router.navigate('/medicacion')}
            accessibilityLabel="Agregar un medicamento"
            accessibilityHint="Dale click al boton para ir a la pantalla de medicaciones"
            accessibilityRole="button">
                <View className="flex-1 flex-row gap-4">
                    <View className="flex p-3 rounded-chip bg-surface">
                        <Pill/>
                    </View>

                    <View className="flex-col">
                        <Text className="font-lexend text-subheading">Agregar un medicamento</Text>
                        <Text className="font-lexend text-caption text-content-muted">Controla dosis y recordatorios</Text>
                    </View>
                </View>

                <ChevronRight/>
                

            </Pressable>

            <Pressable className="flex-row items-center bg-surface-raised p-4 rounded-card shadow-sm border border-line gap-4 mb-3 active:bg-surface-sunken"
            onPress={() => router.navigate('/cita')}
            accessibilityLabel="Programar una cita"
            accessibilityHint="Dale click al boton para ir a la pantalla de citas"
            accessibilityRole="button">
                <View className="flex-1 flex-row gap-4">
                    <View className="flex p-3 rounded-chip bg-surface">
                        <Calendar/>
                    </View>

                    <View className="flex-col">
                        <Text className="font-lexend text-subheading">Programar una cita</Text>
                        <Text className="font-lexend text-caption text-content-muted">Manten tus visitas en un solo lugar</Text>
                    </View>
                </View>

                <ChevronRight/>
                

            </Pressable>
        </>
    )
}