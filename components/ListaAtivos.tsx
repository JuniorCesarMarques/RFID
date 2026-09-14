import { AtivoComEncontrado } from "@/app/(tabs)/inventario";
import { SetStateAction, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import AlertDesconectado from "./AlertDesconectado";
import AtivoCard from "./AtivoCard";
import BuscaPorAproximacao from "./BuscaPorAproximacao";
import HeaderAtivos from "./HeaderAtivos";
import ModalGenerico from "./ModalGenerico";

type Props = {
  onAtivoEditado: () => void;
  handleSelectedCard: (codigo: string) => void;
  selecteds: string[];
  ativos: AtivoComEncontrado[];
  segmented: number;
  loading: boolean;
  setAtivosInventario: React.Dispatch<SetStateAction<AtivoComEncontrado[]>>;
};

export default function ListaAtivos({
  ativos,
  segmented,
  loading,
  handleSelectedCard,
  selecteds,
}: Props) {

  
  const [editCentrosModal, setEditentrosModal] = useState<boolean>(false);
  const [searchModal, setSearchModal] = useState<boolean>(false);

  const [ativoSelecionado, setAtivoSelecionado] =
    useState<AtivoComEncontrado | null>(null);

  const [epc, setEpc] = useState<string>("");

  const closeEditCentrosModal = () => setEditentrosModal(false);
  const closeSearchModal = () => setSearchModal(false);

  const handleOpenEditCentrosModal = (ativo: AtivoComEncontrado) => {
    setAtivoSelecionado(ativo);
    setEditentrosModal(true);
  };

  const handleOpenSearchModal = (epc: string) => {
    setSearchModal(true);
    setEpc(epc);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        paddingHorizontal: 10,
        marginBottom: 70,
      }}
    >
      <ModalGenerico
        width="80%"
        height="40%"
        modalState={searchModal}
        onClose={closeSearchModal}
      >
        <BuscaPorAproximacao epc={epc} />
      </ModalGenerico>

      <View style={styles.container}>
            <HeaderAtivos  />
            <View style={{ paddingBottom: 180 }}>
              <ScrollView>
                {ativos.map((a, index) => (
                  <AtivoCard
                    selecteds={selecteds}
                    onLongPress={handleSelectedCard}
                    onSearchIconPress={handleOpenSearchModal}
                    onEditIconPress={handleOpenEditCentrosModal}
                    showIcon={a.Encontrado !== 0}
                    key={index}
                    ativo={a}
                  />
                ))}
              </ScrollView>
            </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    paddingBottom: 20,
  },

  /* HEADER */

  cellHeader: {
    fontWeight: "600",
    fontSize: 14,
    color: "#334155",
    textAlign: "left",
    paddingHorizontal: 6,
  },

  // LARGURAS FIXAS (devem ser copiadas para o Card)
});
