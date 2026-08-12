import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { View, Text } from "react-native";

export default function AlertDesconectado() {


    return (
        <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <View
          style={{
            width: 110,
            height: 110,
            borderRadius: 999,
            backgroundColor: "#E2E8F0",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <FontAwesome5
            name="bluetooth-b"
            size={48}
            color="#64748B"
          />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: 12,
          }}
        >
          Leitor desconectado
        </Text>

        <Text
          style={{
            textAlign: "center",
            color: "#64748B",
            lineHeight: 24,
            fontSize: 16,
          }}
        >
          Conecte o leitor RFID para utilizar{"\n"}
          a busca por aproximação.
        </Text>
      </View>
    )
}