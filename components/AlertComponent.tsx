import Foundation from "@expo/vector-icons/Foundation";
import { StyleSheet, Text, View } from "react-native";

type Props = {
    text: string
}

export default function AlertComponent({text}: Props) {
  return (
    <View style={styles.aviso}>
      <Foundation name="alert" size={24} color="#F57C00" />
      <Text style={styles.alertText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
 aviso: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFF3E0",
  borderWidth: 1,
  borderColor: "#FFE0B2",
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  gap: 5
},
alertText: {
  color: "#856404",
},
});
