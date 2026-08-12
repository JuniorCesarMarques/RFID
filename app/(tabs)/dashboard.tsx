import EmptyDashboard from "@/components/EmptyDashboard";
import EmptyState from "@/components/EmptyState";
import { useInventarios } from "@/contexts/InventariosContext";
import { buscarAtivosInventarioDashboard } from "@/database/ativosRepository";
import { useDataBase } from "@/database/DatabaseContext";
import { ActivityIndicator } from "@ant-design/react-native";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export type Realizado = {
  Realizado: number;
  Total: number;
  centroDeCustos: string;
  subdivisao: string;
  novoCentroDeCustos: string;
  novaSubdivisao: string;
};

export default function Dashboard() {
  const db = useDataBase();

  const { inventarioAtual } = useInventarios();

  const [ativos, setAtivos] = useState<Realizado[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      if (!db) return;

      const getAtivosInventarios = async () => {
        try {
          setLoading(true);
          const result = await buscarAtivosInventarioDashboard(
            db,
            inventarioAtual?.id,
          );

          setAtivos(result);
        } catch (error) {
          console.log("ERRO AO BUSCAR ATIVOS", error);
        }finally {
          setLoading(false);
        }
      };

      getAtivosInventarios();
      return () => {};
    }, [db, inventarioAtual?.id]),
  );


  if (!inventarioAtual) return <EmptyDashboard />;

  return (
    <View
      style={{
        borderRadius: 24,
        backgroundColor: "#FFFFFF",
        padding: 18,
        paddingBottom: 100,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        elevation: 4,
        borderWidth: 1,
        borderColor: "#EEF2F7",
        gap: 18,
      }}
    >
      {/* Header */}
      <View
        style={{
          backgroundColor: "#F8FAFC",
          borderRadius: 18,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: "#E2E8F0",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "700",
            color: "#0F172A",
            textAlign: "center",
          }}
        >
          {inventarioAtual?.codigo_inventario}
        </Text>

        <Text
          style={{
            marginTop: 4,
            fontSize: 13,
            color: "#64748B",
            textAlign: "center",
          }}
        >
          {inventarioAtual?.descricao}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size={50} color={"#60A5FA"} />
      ) : (
        <>
          {ativos.length ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                gap: 14,
                paddingBottom: 10,
              }}
            >
              {ativos.map((a, index) => {
                const porcentagem = Number(
                  ((a?.Realizado * 100) / a?.Total).toFixed(1),
                );

                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#F8FAFC",
                      borderRadius: 20,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: "#E2E8F0",
                      gap: 14,
                    }}
                  >
                    {/* Topo */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "700",
                            color: "#0F172A",
                          }}
                        >
                          {a?.novoCentroDeCustos || a?.centroDeCustos}
                        </Text>

                        <Text
                          style={{
                            marginTop: 2,
                            fontSize: 13,
                            color: "#64748B",
                          }}
                        >
                          {a?.novaSubdivisao || a?.subdivisao}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: "#DBEAFE",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 999,
                        }}
                      >
                        <Text
                          style={{
                            color: "#2563EB",
                            fontWeight: "700",
                            fontSize: 13,
                          }}
                        >
                          {porcentagem}%
                        </Text>
                      </View>
                    </View>

                    {/* Barra */}
                    <View>
                      <View
                        style={{
                          height: 12,
                          backgroundColor: "#E2E8F0",
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            width: `${porcentagem}%`,
                            height: "100%",
                            backgroundColor: "#2563EB",
                            borderRadius: 999,
                          }}
                        />
                      </View>

                      <Text
                        style={{
                          marginTop: 8,
                          textAlign: "right",
                          fontSize: 12,
                          fontWeight: "600",
                          color: "#475569",
                        }}
                      >
                        {a.Realizado} de {a.Total} ativos encontrados
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <EmptyState
              title="Nenhum centro de custo disponível para este inventário."
              description="Verifique se a lista de ativos foi importada e se existem centros selecionados."
            />
          )}
        </>
      )}
    </View>
  );
}
