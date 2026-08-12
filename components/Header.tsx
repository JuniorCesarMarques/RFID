import { Image, Text, View, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View
      style={styles.container}
    >
      <Image style={{width: 210, height: 37}} source={require("@/assets/images/BMI-LOGO.png")} />
      <Text style={styles.text}>Inventário de ativos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 25,
        paddingBottom: 5,
        paddingHorizontal: 5,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "row",
        gap: 2,
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1
    },
    text: {
        fontSize: 20
    }
})