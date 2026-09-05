import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomTabBarProps } from "expo-router/js-tabs";
import { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color } from "@/theme/colors";

type NombreIonicon = ComponentProps<typeof Ionicons>["name"];

type Destino = {
  etiqueta: string;
  icono: NombreIonicon;
  iconoActivo: NombreIonicon;
};

const DESTINOS: Record<string, Destino> = {
  "(index)": { etiqueta: "Inicio", icono: "home-outline", iconoActivo: "home" },
  medicacion: { etiqueta: "Medicacion", icono: "medkit-outline", iconoActivo: "medkit" },
  medicion: { etiqueta: "Mediciones", icono: "pulse-outline", iconoActivo: "pulse" },
  cita: { etiqueta: "Citas", icono: "calendar-outline", iconoActivo: "calendar" },
  expediente: { etiqueta: "Expediente", icono: "document-text-outline", iconoActivo: "document-text" },
};

const DURACION_TRANSICION = 200;

type PropsItem = {
  destino: Destino;
  activo: boolean;
  alPresionar: () => void;
};

function ItemTab({ destino, activo, alPresionar }: PropsItem) {
  const progreso = useDerivedValue(
    () => withTiming(activo ? 1 : 0, { duration: DURACION_TRANSICION }),
    [activo]
  );

  const estiloPildora = useAnimatedStyle(() => ({
    opacity: progreso.value,
    transform: [{ scale: 0.8 + progreso.value * 0.2 }],
  }));

  const { etiqueta, icono, iconoActivo } = destino;
  const tinte = activo ? color.primary : color.contentSubtle;

  return (
    <Pressable
      onPress={alPresionar}
      accessibilityRole="button"
      accessibilityState={{ selected: activo }}
      accessibilityLabel={etiqueta}
      android_ripple={{ color: color.borderPrimary, borderless: true, radius: 40 }}
      className="flex-1 items-center justify-center px-1 pt-2 pb-1"
    >
      <View className="h-8 w-14 items-center justify-center">
        <Animated.View style={estiloPildora} className="absolute inset-0 rounded-full bg-primary-subtle" />
        <Ionicons name={activo ? iconoActivo : icono} size={22} color={tinte} />
      </View>

      <Text
        numberOfLines={1}
        style={{ color: tinte }}
        className={`text-tab mt-1 ${activo ? "font-lexend-bold" : "font-lexend"}`}
      >
        {etiqueta}
      </Text>
    </Pressable>
  );
}

export default function BarraTabs({ state, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{ paddingBottom: bottom }}
      className="flex-row bg-surface-raised border-t-hairline border-line"
    >
      {state.routes.map((ruta, indice) => {
        const destino = DESTINOS[ruta.name];
        if (!destino) return null;

        const activo = state.index === indice;

        function irADestino() {
          const evento = navigation.emit({
            type: "tabPress",
            target: ruta.key,
            canPreventDefault: true,
          });

          if (!activo && !evento.defaultPrevented) {
            navigation.navigate(ruta.name, ruta.params);
          }
        }

        return <ItemTab key={ruta.key} destino={destino} activo={activo} alPresionar={irADestino} />;
      })}
    </View>
  );
}