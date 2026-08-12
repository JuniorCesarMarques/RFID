import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FormData = {
  codigo: string;
};

export default function LeituraManualInput({
  onSubmit,
}: {
  onSubmit: (codigo: string) => void;
}) {
  const { control, handleSubmit, reset } = useForm<FormData>();
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clearInput = () => {
    reset();
    inputRef.current?.clear();
  };

  const onFormSubmit = async (data: FormData) => {
    onSubmit(data.codigo);
    clearInput();
  };

  const onEnter = (c: string) => {
    console.log(c);
    onSubmit(c);
    clearInput();
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="codigo"
        rules={{
          required: "Código é obrigatório",
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
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
            <Text style={{color: "red"}}>{error?.message}</Text>
          </>
        )}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "70%",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
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
