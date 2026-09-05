import { View, Text, ScrollView, Pressable } from "react-native";
import Categorias from "@/features/articulos/CategoriasBox";
import { SafeAreaView } from "react-native-safe-area-context";
import DestacadosBox from "@/features/articulos/DestacadosBox";
import TopBar from "@/components/TopBar";
import BarraBusqueda from "@/features/articulos/BarraBusqueda";
import { useState } from "react";
import { useValue } from "@legendapp/state/react";
import { articulos$ } from "@/state/articulos";
import { convertirALista } from "@/state/consultas";
import { estilosScrollView } from "..";
import { router } from "expo-router";

export default function ArticulosPage() {
  const articulos = useValue(articulos$);
  const articulosLista = convertirALista(articulos);

  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtrado = q
    ? articulosLista.filter((a) => a.titulo.toLowerCase().includes(q))
    : articulosLista;

  return (
    <View className="flex-1">
      <SafeAreaView edges={["top"]} className="bg-slate-100">
        <TopBar name="Informacion y salud" canGoBack={true} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={estilosScrollView}>
        <BarraBusqueda value={query} setValue={setQuery} />

        {q.length !== 0 && (
          <View className="rounded-t-card">
            {filtrado.length > 0 ? (
              filtrado.map((a) => (
                <Pressable
                  key={a.id}
                  onPress={() =>
                    router.navigate({
                      pathname: "/articulos/[categoriaArt]/[articuloId]",
                      params: { categoriaArt: a.categoria, articuloId: a.id },
                    })
                  }
                  className="p-4 bg-surface-raised w-full"
                >
                  <Text className="font-lexend mb-1">{a.titulo}</Text>
                  <Text
                    className="font-lexend text-content-muted text-sm"
                    numberOfLines={2}
                  >
                    {a.sintomas}
                  </Text>
                </Pressable>
              ))
            ) : (
              <View className="p-4 bg-surface-raised">
                <Text className="font-lexend">
                  No se encontraron resultados para "{query}"
                </Text>
              </View>
            )}
          </View>
        )}

        <DestacadosBox />
        <Categorias />
      </ScrollView>
    </View>
  );
}
