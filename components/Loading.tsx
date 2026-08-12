import { View } from "react-native";

export default function Loading() {
  return (
    <View
      style={{
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderTopColor: "transparent",
        borderColor: "blue",
        transform: "rotate",
      }}
    >
    </View>
  );
}
