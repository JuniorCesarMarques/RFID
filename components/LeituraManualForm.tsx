import { SetStateAction, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox } from "react-native-paper";

export type FormData = {
  codigo: string;
  comentarios?: string;
  centroDeCustos?: string;
  subdivisao?: string;
};

type Props = {
  onSubmit: (data: FormData) => Promise<boolean>;
  setChecked: React.Dispatch<SetStateAction<boolean>>;
  checked: boolean;
};

export default function LeituraManualForm({ onSubmit, checked, setChecked }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clearInput = () => {
    reset();
    inputRef.current?.clear();
  };

  const onFormSubmit = async (data: FormData) => {
    const res = await onSubmit(data);
    if (!res) return;
    clearInput();
  };

  const onEnter = async (c: string) => {
    const res = await onSubmit({ codigo: c });
    inputRef.current?.clear();
    if (!res) return;
    clearInput();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputCodigoContainer}>
        <Controller
          control={control}
          name="codigo"
          rules={{
            required: "Campo obrigatório",
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <View style={styles.formControl}>
              <Text style={styles.label}>Código</Text>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Código"
                submitBehavior="submit"
                onSubmitEditing={(c) => onEnter(c.nativeEvent.text)}
              />

              <TouchableOpacity
                onPress={() => {
                  handleSubmit(onFormSubmit)();
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Ler</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <Text style={{ color: "red" }}>{errors?.codigo?.message}</Text>

      <View style={styles.checkboxContainer}>
        <Checkbox.Item
          position="leading"
          onPress={() => setChecked((prev) => !prev)}
          status={checked ? "checked" : "unchecked"}
          label="Incluir informações manualmente"
        />
      </View>

      {checked && (
        <View style={styles.otherFieldsContainer}>
          <Controller
            control={control}
            name="centroDeCustos"
            rules={{
              required: "Campo obrigatório",
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <View style={styles.formControl}>
                  <Text style={styles.label}>Centro de custos</Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Centro de custos"
                    submitBehavior="submit"
                    onSubmitEditing={(c) => onEnter(c.nativeEvent.text)}
                  />
                </View>
                <Text style={{ color: "red" }}>{error?.message}</Text>
              </>
            )}
          />
          <Controller
            control={control}
            name="subdivisao"
            rules={{
              required: "Campo obrigatório",
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <View style={styles.formControl}>
                  <Text style={styles.label}>Subdivisão</Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Subdivisão"
                    submitBehavior="submit"
                    onSubmitEditing={(c) => onEnter(c.nativeEvent.text)}
                  />
                </View>
                <Text style={{ color: "red" }}>{error?.message}</Text>
              </>
            )}
          />
          <Controller
            control={control}
            name="comentarios"
            rules={{
              required: "Campo obrigatório.",
            }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <View style={styles.formControl}>
                  <Text style={styles.label}>Comentários</Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Comentários"
                    submitBehavior="submit"
                    onSubmitEditing={(c) => onEnter(c.nativeEvent.text)}
                  />
                </View>
                <Text style={{ color: "red" }}>{error?.message}</Text>
              </>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  inputCodigoContainer: {
    width: "40%",
    maxWidth: 500,
    alignSelf: "center",
    gap: 5,
    flexDirection: "row",
  },

  otherFieldsContainer: {
    width: "40%",
    maxWidth: 500,
    alignSelf: "center",
    marginTop: 10,
  },

  formControl: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    gap: 10,
  },

  label: {
    width: 130,
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#111827",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginTop: 4,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
  },

  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
