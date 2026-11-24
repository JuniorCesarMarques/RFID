import { AtivoComEncontrado } from "@/app/(tabs)/inventario";
import { SetStateAction, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
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
      style={styles.horizontalScroll}
      contentContainerStyle={styles.horizontalContent}
      showsHorizontalScrollIndicator
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
        <HeaderAtivos />
        <ScrollView
          nestedScrollEnabled
          style={styles.verticalScroll}
          contentContainerStyle={styles.verticalContent}
          showsVerticalScrollIndicator
        >
          {ativos.map((ativo, index) => (
            <AtivoCard
              selecteds={selecteds}
              onLongPress={handleSelectedCard}
              onSearchIconPress={handleOpenSearchModal}
              onEditIconPress={handleOpenEditCentrosModal}
              showIcon={ativo.Encontrado !== 0}
              key={ativo.id ?? index}
              ativo={ativo}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  horizontalScroll: {
    flex: 1,
  },
  horizontalContent: {
    flexGrow: 1,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  verticalScroll: {
    flex: 1,
  },
  verticalContent: {
    paddingBottom: 16,
  },
});
