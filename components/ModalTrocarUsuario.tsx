import { useDataBase } from "@/database/DatabaseContext";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import ModalGenerico from "./ModalGenerico";

type ModalTrocarUsuarioProps = {
  state: boolean;
  closeModal: () => void;
  onChangeUser: (user: string) => void;
};

export default function ModalTrocarUsuario({
  state,
  closeModal,
  onChangeUser,
}: ModalTrocarUsuarioProps) {
    
  const db = useDataBase();

  const [user, setUser] = useState("");


  return (
    <ModalGenerico
      modalState={state}
      height="20%"
      width="90%"
      onClose={closeModal}
    >
      <Text style={styles.label}>Nome de usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o usuário"
        placeholderTextColor="#94A3B8"
        onChangeText={setUser}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => onChangeUser(user)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </ModalGenerico>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#1E293B",
  },
  button: {
    height: 44,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
