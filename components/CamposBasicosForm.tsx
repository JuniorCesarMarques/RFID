import { Inventario } from "@/types";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, Text, TextInput } from "react-native";

export function CamposBasicos({inventarioAtual}: {inventarioAtual?: Inventario}) {
  const { control, reset } = useFormContext();

  useEffect(() => {
    // reseta ao desmontar para garantir que defaultValue esteja sempre atualizado ao montar
  return () => reset();
}, []);                                                                             


  return (
<>
  <Text style={styles.label}>Código</Text>
  <Controller
    control={control}
    name="codigo"
    defaultValue={inventarioAtual?.codigo_inventario}
    rules={{
      required: "O código é obrigatório.",
      pattern: {
        value: /^[a-zA-Z0-9 ]+$/,
        message: "Use apenas letras e números.",
      },
    }}
    render={({
      field: { onChange, onBlur, value },
      fieldState: { error },
    }) => (
      <>
        <TextInput
          placeholder="Código"
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
        />
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </>
    )}
  />

  <Text style={styles.label}>Descrição</Text>
  <Controller
    control={control}
    name="descricao"
    defaultValue={inventarioAtual?.descricao}
    rules={{
      required: "A descrição é obrigatória.",
      pattern: {
        value: /^[a-zA-Z0-9 ]+$/,
        message: "Use apenas letras e números.",
      },
    }}
    render={({
      field: { onChange, onBlur, value },
      fieldState: { error },
    }) => (
      <>
        <TextInput
          placeholder="Descrição"
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
        />
        {error && <Text style={styles.errorText}>{error.message}</Text>}
      </>
    )}
  />
</>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  label: {
  marginBottom: 4,
  fontWeight: "500",
},
});
