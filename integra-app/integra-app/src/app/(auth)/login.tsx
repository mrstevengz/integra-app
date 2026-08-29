import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { LoginForm, loginSchema } from "../../features/auth/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CampoTexto } from "@/components/CampoTexto";

export default function LoginScreen() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mostrarContrasenia, setMostrarContrasenia] = useState(true);

  const toggleMostrar = () => {
    setMostrarContrasenia((mostrarContrasenia) => !mostrarContrasenia);
  };

  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formValues: LoginForm) {
    setCargando(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: formValues.email,
      password: formValues.password,
    });

    if (error) setError(error.message);
    setCargando(false);
  }

  return (
    <View className="flex-1 justify-center px-6">
      <View className="flex justify-center items-center">
        <View>
          <Image
            source={require("../../../assets/icon.svg")}
            style={{ width: 100, height: 100 }}
          />
        </View>
        <Text className="text-4xl font-bold mb-2">Bienvenido a Integra</Text>
        <Text className="text-slate-500 mb-8">
          Tu expediente medico siempre contigo
        </Text>
      </View>

      <View>
        <CampoTexto
          control={control}
          name="email"
          title="Correo electronico"
          placeholder="Ingresa tu correo electronico"
          keyboardType="email-address"
          autoComplete="email"
        />

        <CampoTexto
          control={control}
          name="password"
          title="Contraseña"
          placeholder="Ingresa tu contraseña"
          autoComplete="new-password"
          secureTextEntry={mostrarContrasenia}
          presionarIcono={() => toggleMostrar()}
          esContrasenia={true}
        />

        {error && <Text className="text-red-600 text-sm mb-3">{error}</Text>}
      </View>

      <Pressable
        onPress={handleSubmit(onSubmit)}
        disabled={cargando}
        className="bg-primary active:bg-primary-pressed p-4 rounded-chip mt-6 items-center"
      >
        {cargando ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-lexend text-white">Iniciar sesion</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => router.push("/registro")}
        className="mt-4 items-center"
      >
        <Text className="font-lexend">¿No tienes cuenta? Crea una</Text>
      </Pressable>
    </View>
  );
}
