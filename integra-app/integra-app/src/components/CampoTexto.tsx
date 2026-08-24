import { View, Text, TextInput } from 'react-native'
import { Control, FieldValues, Path, useController} from 'react-hook-form'
import { useState } from 'react'

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
    const texto = valor ?? ''
    if (!texto) return ['505', '']
    const coincidencia = texto.match(/^\+(\d*)\s*(.*)$/)
    return coincidencia ? [coincidencia[1], coincidencia[2]] : ['505', '']
}

export function CampoTexto<T extends FieldValues>({
    control, name, title, placeholder,
    keyboardType = 'default', autoComplete='off', secureTextEntry=false, opcional=false, telefono=false,
}: Props<T>) {

    const {field, fieldState} = useController({name, control})
    const error = fieldState.error?.message
    const esTelefono = keyboardType === 'phone-pad' && telefono === true
    const [codigoPais, numero] = esTelefono ? separarTelefono(field.value as string) : ['', '']
    const [isFocused, setIsFocused] = useState(false)
    const claseBorde = error ? 'border-danger' : isFocused ? 'border-primary border-2' : 'border-line-strong'


    const actualizarTelefono = (codigo: string, num: string) => {
        field.onChange(`+${codigo} ${num}`.trim())
    }

    return (
        <View className="mb-4">
            <Text className='mb-2 font-lexend-bold'>
                {title} 
                {opcional && <Text className='text-label text-content-muted font-lexend'> (opcional)</Text>} {!opcional && <Text className={`${error ? 'text-alert' : 'text-content-muted'}`}></Text>}
            </Text>

            {esTelefono ? (
                <View className="flex-row gap-2">
                    <View className={`flex-row  bg-surface-raised items-center border rounded-chip px-2 ${claseBorde}`}>
                        <Text className="text-[18px] text-content-muted">+</Text>
                        <TextInput
                        value={codigoPais}
                        onChangeText={(texto) => actualizarTelefono(texto, numero)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            field.onBlur()
                            setIsFocused(false)
                        }}

                        keyboardType="number-pad"
                        maxLength={4}
                        maxFontSizeMultiplier={1.3}
                        textAlignVertical="center"
                        className={`font-lexend flex-1 border rounded-chip bg-surface-raised py-3 px-2 text-[18px] ${claseBorde}`}
                        />
                    </View>

                    <TextInput
                    placeholder={placeholder}
                    value={numero}
                    onChangeText={(texto) => actualizarTelefono(codigoPais, texto)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        field.onBlur() 
                        setIsFocused(false)
                    }}
                    keyboardType="phone-pad"
                    autoComplete={autoComplete}
                    maxFontSizeMultiplier={1.3}
                    textAlignVertical="center"
                    className={`font-lexend border rounded-chip bg-surface-raised py-3 px-2 text-[18px] ${claseBorde}`}

                    />
                </View>
            ) : (
                <TextInput
                placeholder={placeholder}
                value={(field.value as string) ?? ''}
                onChangeText={field.onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    field.onBlur()
                    setIsFocused(false)
                }}
                keyboardType={keyboardType}
                autoComplete={autoComplete}
                secureTextEntry={secureTextEntry}
                maxFontSizeMultiplier={1.3}
                textAlignVertical="center"
                className={`font-lexend border rounded-chip bg-surface-raised py-3 px-2 text-[18px] ${claseBorde}`}
                />
            )}

            {error && <Text className="text-danger text-sm mt-1">{error}</Text>}
        </View>
    )
}
