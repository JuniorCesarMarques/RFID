import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export type Data = {
  novoCentroDeCustos: string;
  novaSubdivisao: string;
};

type Props = {
  closeModal: () => void;
  onEditCentro: (data: Data) => void;
};

export default function EditarCentroDeCustos({
  onEditCentro
}: Props) {

  const { control, handleSubmit, reset } = useForm<Data>({defaultValues: {
    novaSubdivisao: ""
  }});

  const onSubmit: SubmitHandler<Data> = async (data) => {
    onEditCentro(data);
  };

  useEffect(() => {
    return () => reset();
  }, [])

  return (
    <View>
      <Controller
        name="novoCentroDeCustos"
        control={control}
        rules={{
          required: "O campo é obrigatório.",
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
            <Text style={styles.label}>Centro de custos</Text>
            <TextInput
              placeholder="Centro de custos"
              style={[styles.input, error && styles.inputError]}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />
      <Controller
        name="novaSubdivisao"
        control={control}
        rules={{
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
            <Text style={styles.label}>Subdivisão</Text>
            <TextInput
              placeholder="Subdivisao"
              style={[styles.input, error && styles.inputError]}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
            />
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </>
        )}
      />
      <Button
        onPress={async () => {
          handleSubmit(onSubmit)();
        }}
        title="Editar"
      />
    </View>
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
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
