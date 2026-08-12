import { useInventarios } from "@/contexts/InventariosContext";
import { buscarCentrosAplicaveis } from "@/database/ativosRepository";
import { useDataBase } from "@/database/DatabaseContext";
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
import { CentrosAplica } from "./EditModal";

export type CentroDivisao = {
  centroDeCustos: string | undefined;
  subdivisao: string | undefined;
};

type Props = {
  selecionado: CentroDivisao | null;
  setSelecionado: React.Dispatch<SetStateAction<CentroDivisao | null>>;
  incluiManualInfo: boolean;
};

export default function CentrosDeCustosSelect({
  selecionado,
  setSelecionado,
  incluiManualInfo,
}: Props) {
  const db = useDataBase();

  const { inventarioAtual } = useInventarios();

  const [centros, setCentros] = useState<CentrosAplica[]>([]);

  const [open, setOpen] = useState(false);

  const buttonRef = useRef<View>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (inventarioAtual) {
      (async () => {
        const res = await buscarCentrosAplicaveis(inventarioAtual.id, db);

        setCentros(res);
      })();
    }
  }, [inventarioAtual?.id]);

  function abrirDropdown() {
    Keyboard.dismiss();

    setTimeout(() => {
      buttonRef.current?.measureInWindow((x, y, width, height) => {
        setPosition({
          top: y + height,
          left: x,
        });

        if (!incluiManualInfo) {
          setOpen(true);
        }
      });
    }, 50);
  }

  function selecionar(value: CentroDivisao | null) {
    setSelecionado(value);

    setOpen(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Centro de custos/Subdivisão:</Text>

      <Pressable
        ref={buttonRef}
        style={[
          styles.selectContainer,
          incluiManualInfo && styles.disabledContainer,
        ]}
        onPress={() => {
          if (open) {
            setOpen(false);
          } else {
            abrirDropdown();
          }
        }}
      >
        <Text style={[styles.selectedText]}>
          {selecionado
            ? `${selecionado.centroDeCustos} - ${selecionado.subdivisao}`
            : "Usar da lista de ativos"}
        </Text>

        <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[
              styles.dropdownContainer,
              {
                top: position.top,
                left: position.left,
              },
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Pressable style={styles.item} onPress={() => selecionar(null)}>
                <Text>Usar da lista de ativos</Text>
              </Pressable>

              {centros
                .filter((c) => c.aplica)
                .map((c, i) => (
                  <Pressable
                    key={i}
                    style={styles.item}
                    onPress={() => {
                      selecionar(c);
                    }}
                  >
                    <Text>
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

  selectedText: {
    flex: 1,
  },

  arrow: {
    fontSize: 12,
    color: "#666",
  },

  overlay: {
    flex: 1,
  },

  dropdownContainer: {
    position: "absolute",

    maxHeight: 250,

    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,

    backgroundColor: "#fff",

    overflow: "hidden",
    width: 190,
  },

  item: {
    padding: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  disabledContainer: {
    backgroundColor: "#F0F0F0",
    borderColor: "#D0D0D0",
    opacity: 0.6,
  },
});
