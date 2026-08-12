import { useInventarios } from "@/contexts/InventariosContext";
import { buscarCentrosAplicaveis } from "@/database/ativosRepository";
import { useDataBase } from "@/database/DatabaseContext";
import Checkbox from "expo-checkbox";
import { SetStateAction, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CentroDivisao } from "./CentrosDeCustosSelect";
import { CentrosAplica } from "./EditModal";

type Props = {
  setSelecionados: React.Dispatch<SetStateAction<CentroDivisao[]>>;
  selecionados: CentroDivisao[];
};

export default function FiltroSeletor({
  selecionados,
  setSelecionados,
}: Props) {
  const db = useDataBase();

  const { inventarioAtual } = useInventarios();

  const [centros, setCentros] = useState<CentrosAplica[]>([]);

  const [open, setOpen] = useState<boolean>(false);

  const buttonRef = useRef<View>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidHide", () => {
      setTimeout(() => {
        buttonRef.current?.measureInWindow((x, y, width, height) => {
          setPosition({
            top: y + height,
            left: x,
          });
        });
      }, 50);
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (inventarioAtual && open) {
      (async () => {
        const res = await buscarCentrosAplicaveis(inventarioAtual?.id, db);

        setCentros(res);
      })();
    }
  }, [inventarioAtual?.id, open]);

  function isSelected(item: CentroDivisao) {
    return selecionados.some(
      (s) =>
        s.centroDeCustos === item.centroDeCustos &&
        s.subdivisao === item.subdivisao,
    );
  }

  function toggle(item: CentroDivisao) {
    const exists = isSelected(item);

    let updated: CentroDivisao[];

    if (exists) {
      updated = selecionados.filter(
        (s) =>
          !(
            s.centroDeCustos === item.centroDeCustos &&
            s.subdivisao === item.subdivisao
          ),
      );
    } else {
      updated = [...selecionados, item];
    }

    setSelecionados(updated);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filtro:</Text>

      <Pressable
        ref={buttonRef}
        style={styles.selectContainer}
        onPress={() => {
          if (!open) {
            buttonRef.current?.measureInWindow((x, y, width, height) => {
              setPosition({
                top: y + height,
                left: x,
              });
            });

            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
      >
        <Text style={styles.dropdownText}>
          {selecionados.length > 0
            ? `${selecionados.length} selecionado(s)`
            : "Selecionar filtros"}
        </Text>

        <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable onPress={() => setOpen(false)} style={styles.overlay}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.dropdownContainer,
              { top: position.top, left: position.left },
            ]}
          >
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {centros.map((c, i) => (
                <Pressable
                  key={i}
                  style={styles.item}
                  onPress={() => toggle(c)}
                >
                  <Checkbox value={isSelected(c)} />
                  <Text style={styles.itemText}>
                    {c.centroDeCustos} - {c.subdivisao}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 999,
    flexDirection: "row",
  },

  label: {
    fontWeight: "bold",
  },

  selectContainer: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,

    backgroundColor: "#fff",

    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 10,
    width: 190,
  },

  dropdownText: {
    color: "#333",
  },

  arrow: {
    fontSize: 12,
    color: "#666",
  },

  overlay: {
    flex: 1,
  },

  dropdownContainer: {
    pointerEvents: "auto",
    position: "absolute",

    width: 190,
    height: 250,

    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,

    backgroundColor: "#fff",

    overflow: "hidden",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,

    padding: 12,

    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  itemText: {
    flex: 1,
    color: "#333",
  },
});
