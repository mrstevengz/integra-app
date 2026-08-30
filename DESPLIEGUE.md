# Despliegue

Guía para llevar Integra a producción. Cubre las tres piezas que se publican por separado y en este orden.

| Pieza | Dónde vive | Con qué se publica |
|---|---|---|
| **Esquema de la base** | `integra-app/integra-app/drizzle/` | `drizzle-kit migrate` |
| **Edge Function** | `integra-app/integra-app/supabase/functions/` | Supabase CLI |
| **Aplicación móvil** | `integra-app/integra-app/` | EAS Build |

El orden importa: la aplicación asume que las tablas, las políticas y los buckets ya existen. Si publicás la app primero, los usuarios ven pantallas vacías y errores de permisos.

> Todas las rutas de este documento son relativas a `integra-app/integra-app/`, salvo que se indique otra cosa.

---

## Antes de empezar: tres bloqueadores

Estos tres puntos hacen fallar la compilación o degradan el resultado. Resolvelos antes de la primera build.

### 1. Los íconos están en SVG

`app.json` apunta a archivos `.svg`:

```json
"icon": "./assets/icon.svg",
"splash": { "image": "./assets/splash-icon.svg" },
"android": { "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.svg" } },
"web": { "favicon": "./assets/favicon.svg" }
```

**Expo no procesa SVG en esos campos.** Espera PNG. En Expo Go no se nota porque el ícono que ves es el de Expo Go, pero una build de producción sale con el ícono en blanco o falla al generar los recursos.

Exportá los PNG desde el SVG y actualizá las cuatro rutas:

| Campo | Tamaño | Nota |
|---|---|---|
| `icon` | 1024 × 1024 | Sin transparencia, sin esquinas redondeadas — el sistema las aplica |
| `splash.image` | 1284 × 2778 o el logo centrado | Se escala según `resizeMode: "contain"` |
| `android.adaptiveIcon.foregroundImage` | 1024 × 1024 | Dejá margen: Android recorta el 33% exterior |
| `web.favicon` | 48 × 48 | — |

El SVG puede quedarse en `assets/` para el README, que sí lo renderiza.

### 2. Falta el identificador de iOS

`app.json` tiene `android.package` pero el bloque de iOS solo trae `supportsTablet`. **Sin `bundleIdentifier` no se puede compilar para iOS.**

```json
"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.mrstevengz.integraapp"
}
```

Usá el mismo identificador que en Android para no llevar dos nombres. Una vez publicado en la App Store **no se puede cambiar**, así que elegilo con calma.

### 3. La tipografía no está resolviendo

`app.json` carga tres familias:

```
LexendDeca-Black.ttf · LexendDeca-Bold.ttf · LexendDeca-Regular.ttf
```

Pero `tailwind.config.js` mapea la clase `font-lexend` a la familia `"Lexend_Font"`, que ya no existe. Resultado: **toda la aplicación está usando la fuente del sistema**, no Lexend.

No rompe la compilación, pero shippea una tipografía distinta a la diseñada. En `tailwind.config.js`:

```js
      fontFamily: {
        lexend: ["LexendDeca-Regular"],
      },
```

Y ojo con los pesos: al ser tres archivos con tres familias distintas, `font-bold` no cambia nada — hay que cambiar de `fontFamily`, no de `fontWeight`. Si querés que los pesos funcionen con clases, conviene pasar a la versión variable de Lexend.

---

## Requisitos

| Herramienta | Para qué | Instalación |
|---|---|---|
| Node 20+ | Todo | — |
| **EAS CLI** | Compilar y publicar la app | `npm install -g eas-cli` |
| **Supabase CLI** | Edge Functions | `npm install -g supabase` |
| Cuenta de Expo | Builds en la nube | [expo.dev](https://expo.dev) |
| Cuenta de Google Play | Publicar en Android | 25 USD, pago único |
| Apple Developer | Publicar en iOS | 99 USD al año |

Para Android se puede compilar y distribuir un APK sin cuenta de Play. Para iOS **no hay forma** de instalar en un dispositivo físico sin cuenta de desarrollador.

---

# Parte 1 — Backend

## 1.1 Separá desarrollo de producción

Creá un **proyecto de Supabase distinto** para producción. Es lo más importante de esta sección.

Con un solo proyecto, cualquier migración que probás en tu máquina toca los datos reales de las personas que usan la aplicación. Y son datos médicos.

| Entorno | Proyecto | `DATABASE_URL` apunta a |
|---|---|---|
| Desarrollo | `integra-dev` | El de desarrollo |
| Producción | `integra-prod` | El de producción — solo al desplegar |

## 1.2 Aplicar el esquema

Las migraciones viven en `drizzle/`, no en `supabase/migrations/`. Eso significa que **`supabase db push` no las ve** — hay que aplicarlas con drizzle.

```bash
cd integra-app/integra-app

# Apuntá DATABASE_URL al proyecto de producción, temporalmente
npx drizzle-kit migrate
```

Verificá que llegaron las doce tablas:

```sql
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;
```

> Volvé a apuntar `DATABASE_URL` a desarrollo apenas termines. Un `drizzle-kit push` accidental contra producción no tiene deshacer.

## 1.3 Verificar las políticas de seguridad

Esto no es opcional. Es lo único que separa el expediente de una persona del de otra.

```sql
-- Ninguna tabla debe aparecer acá
select tablename from pg_tables
where schemaname = 'public' and rowsecurity = false;

-- Cada tabla de datos debe tener sus políticas
select tablename, policyname, cmd from pg_policies
where schemaname = 'public'
order by tablename;
```

Todas las tablas deben tener RLS activo. `articulos` es la única con lectura pública; el resto compara `auth.uid()` contra `perfil_id`.

**Probalo de verdad** antes de publicar: creá dos cuentas, cargá un medicamento en cada una, y confirmá desde el panel que ninguna ve los datos de la otra.

## 1.4 Crear el bucket de avatares

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatares', 'avatares', true, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "avatares_lectura_publica"
on storage.objects for select to public
using (bucket_id = 'avatares');

create policy "avatares_subir_propio"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'avatares'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatares_actualizar_propio"
on storage.objects for update to authenticated
using (
  bucket_id = 'avatares'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatares_borrar_propio"
on storage.objects for delete to authenticated
using (
  bucket_id = 'avatares'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

Los buckets **no se crean con las migraciones de drizzle**. Hay que correr esto a mano en cada proyecto nuevo.

## 1.5 Configurar la autenticación

En **Authentication → Providers → Email**:

| Ajuste | Producción | Por qué |
|---|---|---|
| Confirm email | **Activado** | Sin confirmación, cualquiera se registra con un correo ajeno |
| Secure email change | Activado | Pide confirmación en las dos direcciones |
| Minimum password length | 8 o más | — |

En **Authentication → URL Configuration**, agregá el esquema de la aplicación a las URL permitidas:

```
integra-app://
```

Sale de `"scheme": "integra-app"` en `app.json`. Sin eso, los enlaces de confirmación de correo no devuelven al usuario a la aplicación.

**Personalizá las plantillas de correo** en Authentication → Email Templates. Las que vienen por defecto dicen "Supabase" y en una aplicación médica eso genera desconfianza.

## 1.6 Desplegar la Edge Function

El proyecto tiene una función en `supabase/functions/expediente/`, que sirve los expedientes compartidos por QR.

```bash
cd integra-app/integra-app

supabase login
supabase link --project-ref <ref-de-produccion>
supabase functions deploy expediente
```

El `<ref-de-produccion>` es el identificador del proyecto, visible en Project Settings → General.

Las funciones reciben `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` automáticamente. Si necesitás otras variables:

```bash
supabase secrets set NOMBRE=valor
supabase secrets list
```

Verificá que responde:

```bash
curl -i "https://<ref>.supabase.co/functions/v1/expediente?codigo=prueba" \
  -H "apikey: <clave-anon>"
```

---

# Parte 2 — Aplicación móvil

## 2.1 Vincular el proyecto con EAS

```bash
cd integra-app/integra-app

eas login
eas init
```

`eas init` agrega un `extra.eas.projectId` a `app.json`. **Ese identificador se versiona** — es lo que conecta el código con tu proyecto en expo.dev.

## 2.2 Crear `eas.json`

En la raíz de `integra-app/integra-app/`:

```json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development"
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "channel": "production",
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

Los tres perfiles y para qué sirve cada uno:

| Perfil | Qué produce | Para quién |
|---|---|---|
| `development` | Cliente de desarrollo con el depurador | Vos, mientras programás |
| `preview` | APK instalable directo | Pruebas con usuarios reales antes de publicar |
| `production` | AAB para Play Store, IPA para App Store | Publicación |

**Por qué `apk` en preview y `app-bundle` en producción:** un APK se instala tocándolo, así que sirve para pasárselo a alguien por WhatsApp. Google Play **exige** AAB, que no se puede instalar a mano.

**`appVersionSource: "remote"` con `autoIncrement`** hace que EAS lleve la cuenta del número de build. Sin eso tenés que subir `versionCode` y `buildNumber` a mano en cada envío, y olvidarse una vez hace que la tienda rechace el archivo.

## 2.3 Variables de entorno

Las builds corren **en los servidores de Expo**, donde tu `.env.local` no existe — está en el `.gitignore` y nunca se sube. Hay que registrarlas en EAS:

```bash
eas env:create --environment production \
  --name EXPO_PUBLIC_SUPABASE_URL \
  --value "https://<ref-produccion>.supabase.co" \
  --visibility plaintext

eas env:create --environment production \
  --name EXPO_PUBLIC_SUPABASE_KEY \
  --value "<clave-anon-de-produccion>" \
  --visibility plaintext

eas env:list --environment production
```

Repetí para `--environment preview` con los valores que corresponda.

### Por qué `plaintext` y no `secret`

Las variables `EXPO_PUBLIC_*` **quedan incrustadas en el binario en tiempo de compilación**. Cualquiera que descargue el APK las puede leer. Marcarlas como secretas en EAS no las oculta — solo te impide verlas a vos en el panel.

Y no es un problema: la clave anónima por sí sola no da acceso a nada. Toda la autorización la imponen las políticas de la base.

> **`DATABASE_URL` no va a EAS. Nunca.** Es una credencial de superusuario y solo la usa `drizzle-kit` desde tu máquina. Si termina en una variable `EXPO_PUBLIC_*`, queda dentro de la aplicación de todos los usuarios y cualquiera puede leer y borrar la base entera.

## 2.4 Compilar

```bash
# APK de prueba
eas build --platform android --profile preview

# Producción
eas build --platform android --profile production
eas build --platform ios --profile production
```

La primera vez EAS te pregunta por las credenciales de firma. **Dejá que las genere y las guarde él** (`Generate new keystore`). Si perdés el keystore de Android no podés volver a publicar actualizaciones de esa aplicación jamás — hay que subirla como una app nueva, y los usuarios pierden sus instalaciones.

Como `/android` e `/ios` están en el `.gitignore`, EAS ejecuta `prebuild` en cada compilación y genera los proyectos nativos desde `app.json`. Por eso los tres bloqueadores del principio importan: se aplican en ese momento.

La compilación tarda entre 10 y 25 minutos y el enlace de descarga sale en la consola y en expo.dev.

## 2.5 Publicar en las tiendas

```bash
eas submit --platform android --profile production
eas submit --platform ios --profile production
```

Para Android hace falta una cuenta de servicio de Google Play; EAS te guía la primera vez.

**Antes del envío**, preparalo en cada consola: descripción, capturas, política de privacidad y clasificación de contenido. Las dos tiendas piden **una URL pública de política de privacidad** y la revisan — para una aplicación que maneja datos médicos es lo primero que miran.

En el cuestionario de Google Play, declará que la aplicación **recolecta datos de salud** y explicá que se cifran en tránsito y que el usuario puede eliminarlos. Ocultarlo es causa de retiro.

## 2.6 Versionado

`app.json` tiene la versión visible para el usuario:

```json
"version": "1.0.0"
```

Subila siguiendo versionado semántico: parche para correcciones, menor para funciones nuevas, mayor para cambios que rompen compatibilidad.

El número interno de build (`versionCode` en Android, `buildNumber` en iOS) lo maneja EAS solo gracias a `autoIncrement`. No los pongas en `app.json`.

---

# Parte 3 — Actualizaciones sin recompilar

EAS Update permite publicar cambios de JavaScript sin pasar por la revisión de las tiendas. Los usuarios los reciben al abrir la aplicación.

```bash
npx expo install expo-updates
eas update:configure

eas update --branch production --message "Corrige el cálculo de la próxima toma"
```

## Qué se puede y qué no

| Se actualiza por OTA | Necesita recompilar y reenviar |
|---|---|
| Pantallas, componentes, estilos | Agregar o quitar un módulo nativo |
| Lógica de estado y consultas | Cambiar permisos en `app.json` |
| Textos, validaciones, correcciones | Cambiar ícono, nombre o esquema |
| Ajustes de NativeWind | Subir la versión del SDK de Expo |

La regla: **si tocaste `app.json`, `package.json` o instalaste algo con `expo install`, hay que recompilar.** Todo lo demás va por OTA.

El `channel` de cada perfil en `eas.json` es lo que conecta una build con su rama de actualizaciones. Una build de `production` solo recibe updates publicadas en el canal `production`.

---

# Lista de verificación de release

**Antes de compilar**

- [ ] Los cuatro íconos son PNG y `app.json` los apunta
- [ ] `ios.bundleIdentifier` está definido
- [ ] `tailwind.config.js` apunta a la familia de fuente correcta
- [ ] `version` subida en `app.json`
- [ ] `npx tsc --noEmit` sin errores
- [ ] Variables cargadas en EAS y apuntando a **producción**

**Backend**

- [ ] Migraciones aplicadas en el proyecto de producción
- [ ] Ninguna tabla con `rowsecurity = false`
- [ ] Aislamiento probado con dos cuentas reales
- [ ] Bucket `avatares` creado con sus cuatro políticas
- [ ] Confirmación de correo activada
- [ ] `integra-app://` en las URL permitidas
- [ ] Plantillas de correo personalizadas
- [ ] Edge Function `expediente` desplegada y respondiendo

**Prueba en dispositivo, con la build de `preview`**

- [ ] Registro con correo nuevo y confirmación
- [ ] Inicio y cierre de sesión repetidos, sin datos cruzados
- [ ] Alta de medicamento y generación de tomas
- [ ] Marcar, posponer y omitir una dosis
- [ ] Registrar una medición y ver su gráfica
- [ ] Crear una cita y registrar su resultado
- [ ] Subir y cambiar la foto de perfil
- [ ] Generar el QR de emergencia y el PDF del expediente
- [ ] **Modo avión**: leer, escribir, reconectar y verificar que sincronizó
- [ ] Cerrar y abrir la aplicación: los datos persisten

**Publicación**

- [ ] Política de privacidad publicada en una URL accesible
- [ ] Formulario de datos de salud declarado en Play Console
- [ ] Capturas y descripción cargadas
- [ ] Tag de la versión en git

---

# Marcha atrás

**Una actualización OTA que salió mal:**

```bash
eas update:list --branch production
eas update:republish --group <id-de-la-version-anterior>
```

Es inmediato, sin revisión de tienda. Por eso conviene publicar por OTA todo lo que se pueda.

**Una build que salió mal:** en Play Console se detiene el despliegue y se promueve la versión anterior. En App Store Connect se retira del venta y se reenvía la anterior. Es lento — la revisión de Apple puede tardar días.

**Una migración que salió mal:** no hay deshacer automático. Por eso importa tanto revisar el `.sql` generado antes de aplicarlo, y tener respaldos activos. Supabase los hace a diario en los planes pagos; en el gratuito **no hay respaldos automáticos** y una migración destructiva es irreversible.

Antes de cualquier migración con `DROP` o `ALTER COLUMN` en producción, sacá un respaldo manual:

```bash
supabase db dump --project-ref <ref> -f respaldo-$(date +%F).sql
```
