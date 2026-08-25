import { View, Text, TextInput } from 'react-native'
import { Control, FieldValues, Path, useController } from 'react-hook-form'
import { useState } from 'react'
import { color } from '@/theme/colors'

//TODO: COMENTAR
const CODIGO_PAIS_POR_DEFECTO = '505'

type CampoEnfocado = 'codigoPais' | 'principal' | null

type Props<T extends FieldValues> = {
    name: Path<T>
    control: Control<T>
    placeholder?: string
    secureTextEntry?: boolean
    keyboardType?: 'default' | 'email-address' | 'phone-pad'
    autoComplete?: 'name' | 'family-name' | 'email' | 'new-password' | 'tel' | 'off'
    opcional?: boolean,
    title: string,
    telefono?: boolean,
}

function separarTelefono(valor: string | undefined): [string, string] {
    const texto = (valor ?? '').trim()
    if (!texto) return [CODIGO_PAIS_POR_DEFECTO, '']

    const coincidencia = texto.match(/^\+(\d*)\s*(.*)$/)
    if (!coincidencia) return [CODIGO_PAIS_POR_DEFECTO, texto]

    return [coincidencia[1], coincidencia[2]]
}

function unirTelefono(codigo: string, numero: string): string {
    if (!codigo && !numero) return ''
    return `+${codigo} ${numero}`.trim()
}

export function CampoTexto<T extends FieldValues>({
    control, name, title, placeholder,
    keyboardType = 'default', autoComplete = 'off', secureTextEntry = false, opcional = false, telefono = false,
}: Props<T>) {

    const { field, fieldState } = useController({ name, control })
    const error = fieldState.error?.message
    const esTelefono = keyboardType === 'phone-pad' && telefono === true
    const [codigoPais, numero] = esTelefono ? separarTelefono(field.value as string) : ['', '']
    const [enfocado, setEnfocado] = useState<CampoEnfocado>(null)

    function borde(campo: Exclude<CampoEnfocado, null>): string {
        if (error) return 'border-danger'
        return enfocado === campo ? 'border-primary' : 'border-line-strong'
    }

    function alSalir() {
        field.onBlur()
        setEnfocado(null)
    }

    return (
        <View className="mb-4">
            <Text className="mb-2 text-label font-lexend-bold font-medium text-content">
                {title}
                {opcional && (
                    <Text className="text-label font-lexend text-content-muted"> (opcional)</Text>
                )}
            </Text>

            {esTelefono ? (
                <View className="flex-row gap-2">
                    <View className={`w-24 flex-row items-center rounded-chip border bg-surface-raised px-3 ${borde('codigoPais')}`}>
                        <Text className="font-lexend text-[15px] text-content-muted">+</Text>

                        <TextInput
                            value={codigoPais}
                            onChangeText={(texto) => field.onChange(unirTelefono(texto.replace(/\D/g, ''), numero))}
                            onFocus={() => setEnfocado('codigoPais')}
                            onBlur={alSalir}
                            keyboardType="number-pad"
                            maxLength={4}
                            maxFontSizeMultiplier={1.3}
                            textAlignVertical="center"
                            placeholderTextColor={color.contentDisabled}
                            className="font-lexend flex-1 py-3 pl-1 text-[15px] text-content"
                        />
                    </View>

                    <TextInput
                        placeholder={placeholder}
                        value={numero}
                        onChangeText={(texto) => field.onChange(unirTelefono(codigoPais, texto))}
                        onFocus={() => setEnfocado('principal')}
                        onBlur={alSalir}
                        keyboardType="phone-pad"
                        autoComplete={autoComplete}
                        maxFontSizeMultiplier={1.3}
                        textAlignVertical="center"
                        placeholderTextColor={color.contentDisabled}
                        className={`font-lexend flex-1 rounded-chip border bg-surface-raised py-3 px-3 text-[15px] text-content ${borde('principal')}`}
                    />
                </View>
            ) : (
                <TextInput
                    placeholder={placeholder}
                    value={(field.value as string) ?? ''}
                    onChangeText={field.onChange}
                    onFocus={() => setEnfocado('principal')}
                    onBlur={alSalir}
                    keyboardType={keyboardType}
                    autoComplete={autoComplete}
                    secureTextEntry={secureTextEntry}
                    maxFontSizeMultiplier={1.3}
                    textAlignVertical="center"
                    placeholderTextColor={color.contentDisabled}
                    className={`font-lexend rounded-chip border bg-surface-raised py-3 px-3 text-[15px] text-content ${borde('principal')}`}
                />
            )}

            {error && <Text className="mt-1 text-caption font-lexend text-danger">{error}</Text>}
        </View>
    )
}