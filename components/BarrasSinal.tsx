import { View } from "react-native";

type Props = {
  status: {
    level: number;
    color: string;
  };
};

export default function BarrasSinal({ status }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "baseline",
        gap: 8,
      }}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={{
            width: 20,
            height: i * 12,
            backgroundColor: status.level >= i ? status.color : "#E5E7EB",
            borderRadius: 4,
          }}
        />
      ))}
    </View>
  );
}
