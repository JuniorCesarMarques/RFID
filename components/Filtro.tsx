import { Picker } from "@react-native-picker/picker";
import { SetStateAction, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  setValue: React.Dispatch<SetStateAction<string>>;
  seFiled: React.Dispatch<SetStateAction<string>>;
  field: string;
  value: string;
};

export default function Filtro({
  setValue,
  seFiled
}: Props) {

  const inputRef = useRef<TextInput>(null);

  const [items] = useState([
    { label: "Código", value: "codigo_ativo" },
    { label: "Descrição", value: "descricao" },
  ]);

  return (
    <View style={[styles.filterContainer, { zIndex: 10, elevation: 10 }]}>
      <View style={{ alignSelf: "flex-start", zIndex: 20, minWidth: 150 }}>
        <Picker
          selectedValue="codigo_ativo"
          onValueChange={(value) => {
            inputRef.current?.clear();
            setValue("");
            seFiled(value)
          }}
        >
          {items.map((i, index) => (
            <Picker.Item key={index} label={i.label} value={i.value} />
          ))}
        </Picker>
      </View>
        <TextInput
          ref={inputRef}
          onChangeText={(e) => setValue(e)}
          style={styles.searchInput}
          placeholder="Buscar..."
          placeholderTextColor="#888"
        />
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
  },

  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  dropdownContainer: { borderColor: "#ccc" },
  dropdownText: { fontSize: 16, color: "#333" },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputDisabled: {
    backgroundColor: "#F1F5F9",
    color: "#94A3B8",
  },
});
