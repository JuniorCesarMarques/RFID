import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text, View } from "react-native";

type Props = {
  tableMode?: boolean;
  title?: string;
  description?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function EmptyState({
  tableMode,
  title = "Nenhum item encontrado",
  description = "Não há informações para exibir no momento.",
  icon = "package-variant-closed",
}: Props) {
  return (
    <View
      style={
        tableMode
          ? {
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              overflow: "hidden",

              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 3,

              marginHorizontal: 10,
              marginBottom: 80,
            }
          : { backgroundColor: "#FFFFFF", height: "100%" }
      }
    >
      {/* HEADER ESQUELETO */}
      {tableMode && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F8FAFC",
            borderBottomWidth: 1,
            borderBottomColor: "#E2E8F0",
            paddingVertical: 14,
            paddingHorizontal: 18,
            gap: 18,
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <View
              key={index}
              style={{
                height: 14,
                width: index === 1 ? 180 : 90,
                borderRadius: 999,
                backgroundColor: "#E2E8F0",
              }}
            />
          ))}
        </View>
      )}

      {/* CONTEÚDO */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 80,
          paddingHorizontal: 32,
        }}
      >
        <View
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            backgroundColor: "#F1F5F9",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <MaterialCommunityIcons name={icon} size={48} color="#94A3B8" />
        </View>

        <Text
          style={{
            fontSize: 26,
            fontWeight: "700",
            color: "#0F172A",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#64748B",
            textAlign: "center",
            lineHeight: 24,
            maxWidth: 320,
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}
