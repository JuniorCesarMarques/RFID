import GetIcon from "@/components/GetIcon";
import { useDataBase } from "@/database/DatabaseContext";
import { useLiveLocation } from "@/hooks/useLiveLocation";
import { AtivosInventario } from "@/types";
import { ActivityIndicator } from "@ant-design/react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import AlertComponent from "@/components/AlertComponent";
import ListaAtivosMapa from "@/components/ListaAtivosMapa";
import { useInventarios } from "@/contexts/InventariosContext";
import { buscarAtivosMapa } from "@/database/ativosRepository";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export type AtivosMapa = AtivosInventario & {
  Aplica: number;
};

export default function App() {
  const { location } = useLiveLocation();
  const { inventarioAtual } = useInventarios();
  const db = useDataBase();

  const [loading, setLoading] = useState<boolean>(false);

  const [ativos, setAtivos] = useState<AtivosMapa[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!inventarioAtual) return;

        setLoading(true);
        const res: AtivosMapa[] = await buscarAtivosMapa(
          db,
          inventarioAtual.id,
        );
        setAtivos(res);
        setLoading(false);
      })();
    }, [inventarioAtual?.id]),
  );

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={100} color={"#60A5FA"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/*  */}
      {inventarioAtual ? (
        <ListaAtivosMapa
          loading={loading}
          ativos={ativos}
          setAtivos={setAtivos}
        />
      ) : (
        <AlertComponent text="Selecione um inventário para visualizar os ativos no mapa." />
      )}
      {/* MAPA */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {ativos?.map((a, i) => {
          if (a.Aplica) {
            return (
              <Marker
                key={i}
                coordinate={{
                  latitude: Number(a.latitude),
                  longitude: Number(a.longitude),
                }}
                title={a.codigo_ativo}
                description={a.descricao_ativo}
              >
                <GetIcon categoria={a.categoria_ativo} />
              </Marker>
            );
          }
        })}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          pinColor="red"
          zIndex={100}
        >
          <FontAwesome6 name="person-walking" size={30} color="red" />
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flex: 1,
  },
});
