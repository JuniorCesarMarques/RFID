import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  openModal: () => void;
}

export default function EditCdcBtn({ openModal }: Props) {
  return (
    <Pressable onPress={openModal} style={styles.container}>
      <Text style={styles.btn}>Editar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-end",
  },
  btn: {
    padding: 10,
    color: "white",
    width: "20%",
    backgroundColor: "#2563eb",
    textAlign: "center",
    borderRadius: 10
  }
});
