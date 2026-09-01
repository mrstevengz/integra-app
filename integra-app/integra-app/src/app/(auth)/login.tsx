import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useState } from "react";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LoginForm, loginSchema } from "../../features/auth/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CampoTexto } from "@/components/CampoTexto";
import { iniciarSesionConGoogle } from "@/state/auth";
import { color } from "@/theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoginScreen() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cargandoGoogle, setCargandoGoogle] = useState(false);

  async function entrarConGoogle() {
    setCargandoGoogle(true);
    setError(null);

    try {
      const inicioSesion = await iniciarSesionConGoogle();
      if (inicioSesion) router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesion con Google");
    } finally {
      setCargandoGoogle(false);
    }
  }

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
    <KeyboardAvoidingView
      className="flex-1"
      behavior={undefined}

    >
      <ScrollView
        className="flex-grow bg-white"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 30,
          paddingBottom: 80,
        }}
      >
        <View className="flex-1 justify-center">
          <View className="items-center mb-8">
            <Image
              source={require("../../../assets/logos/icono.svg")}
              style={{ width: 100, height: 100 }}
            />
            <Text className="text-display font-bold my-2 font-lexend-bold">Bienvenido a Integra</Text>
            <Text className="text-slate-500 font-lexend text-body">
              Tu expediente medico siempre contigo
            </Text>
          </View>

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

          <Pressable
            onPress={handleSubmit(onSubmit)}
            disabled={cargando}
            className="bg-primary active:bg-primary-pressed p-5 rounded-chip mt-6 items-center"
          >
            {cargando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-lexend text-label text-white">Iniciar sesion</Text>
            )}
          </Pressable>

          <Pressable
            onPress={entrarConGoogle}
            disabled={cargando || cargandoGoogle}
            className="flex-row items-center justify-center gap-3 border border-line-strong p-5 rounded-chip mt-3 active:bg-surface-sunken"
          >
            {cargandoGoogle ? (
              <ActivityIndicator color={color.content} />
            ) : (
              <>
                <Ionicons name="logo-google" size={20} color={color.content} />
                <Text className="font-lexend text-label text-content">Continuar con Google</Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("/registro")}
            className="mt-4 items-center"
          >
            <Text className="font-lexend text-label">¿No tienes cuenta? <Text className="font-lexend-bold">Crea una</Text></Text>
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
