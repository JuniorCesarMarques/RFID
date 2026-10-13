import React from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { CamposBasicos } from "./CamposBasicosForm";

type NovoInventarioFormType = {
  onSubmit: SubmitHandler<FormData>;
  title: string;
  textButton: string;
};

export type FormData = {
  usuario: string;
  codigo: string;
  descricao: string;
  status: number;
  dataHoraCriacao: string;
  dataHoraAtualizacao: string;
  centroDeCustos: string;
  subdivisao: string;
  aplica: number;
};

export default function InventarioForm({
  onSubmit,
  title,
  textButton,
}: NovoInventarioFormType) {
  const methods = useForm<FormData>();
  const { control, handleSubmit } = methods;


  return (
    <FormProvider {...methods}>
      <View>
        <Text style={{ marginBottom: 10, fontWeight: "bold" }}>{title}</Text>
        <Text style={styles.label}>Usuário Responsável</Text>
        <Controller
          control={control}
          name="usuario"
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              placeholder="Usuário"
              onBlur={onBlur}
              value={value}
              style={[styles.input, error && styles.inputError]}
              onChangeText={onChange}
            />
          )}
        />
        <CamposBasicos />
        <Button
          title={textButton}
          onPress={async () => {
            await handleSubmit(onSubmit)();
          }}
        />
      </View>
    </FormProvider>
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
