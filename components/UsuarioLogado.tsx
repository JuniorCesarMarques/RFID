
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type UsuarioLogadoProps = {
  usuario: string;
  onPressChange: () => void;
};

export default function UsuarioLogado({
  usuario,
  onPressChange,
}: UsuarioLogadoProps) {
  const inicial = usuario.trim().charAt(0).toUpperCase() || "U";

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
          <View style={styles.status} />
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>USUÁRIO RESPONSÁVEL</Text>
          <Text style={styles.username} numberOfLines={1}>
            {usuario}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={onPressChange}
        activeOpacity={0.7}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Trocar</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EDF5",

    shadowColor: "#172554",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  profile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#2563EB",
    fontSize: 20,
    fontWeight: "700",
  },

  status: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#94A3B8",
    marginBottom: 4,
  },

  username: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
  },

  arrow: {
    fontSize: 22,
    lineHeight: 22,
    color: "#2563EB",
    marginTop: -2,
  },
});
