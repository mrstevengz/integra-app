import { Search } from "lucide-react-native";
import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export default function BarraBusqueda({
  value,
  setValue,
}: {
  value: string;
  setValue?: Dispatch<SetStateAction<string>>;
}) {
  return (
    <View className="bg-surface-raised rounded-t-card flex-row">
      <View className="flex-1 p-5">
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Buscar articulos.."
          style={{ fontFamily: "lexend" }}
        />
      </View>

      <View className="bg-primary rounded-t-card p-2 px-4 flex items-center justify-center">
        <Search color={"#ffffff"} />
      </View>
    </View>
  );
}
