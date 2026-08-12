import { buscarTodosAtivos, inserirAtivos } from "@/database/ativosRepository";
import { Ativo, Inventario } from "@/types";
import * as DocumentPicker from "expo-document-picker";
import { SQLiteDatabase } from "expo-sqlite";
import { SetStateAction } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import * as XLSX from "xlsx";

const requiredColumns = [
  "codigo_ativo",
  "descricao",
  "comentarios",
  "centrodecustos",
  "subdivisao",
  "categoria",
  "localizacao",
  "datahorainventariado",
  "status",
  "datahoracriacao",
  "datahoraatualizacao",
];

type PickXLSXParams = {
  inventarioAtual: Inventario | null;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  db: SQLiteDatabase;
};

export const pickXLSX = async ({
  inventarioAtual,
  setLoading,
  db,
}: PickXLSXParams) => {
  if (!inventarioAtual) return;
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ],
      copyToCacheDirectory: true,
    });

    setLoading(true);

    if ("canceled" in result && result.canceled) {
      setLoading(false);
      return;
    }

    const file = result.assets[0];

    const response = await fetch(file.uri);
    const arrayBuffer = await response.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json<any>(sheet, { defval: null });

    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

    const header = rows[0] ?? [];

    // VALIDAÇÕES

    // REQUIRED COLUNMS
    const columnsNormalized = (rows[0] ?? []).map((col) =>
      col?.toString().trim().toLowerCase(),
    );

    const missing = requiredColumns.filter(
      (col) => !columnsNormalized.includes(col),
    );

    if (missing.length) {
      Toast.show({
        type: "error",
        text1: "A planilha possui colunas inválidas ou faltantes.",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    // PLANILHA SEM DADOS
    if (!rawData.length) {
      Toast.show({
        type: "error",
        text1: "Nenhum dado encontrado na planilha.",
        position: "top",
        topOffset: 60,
      });
      return;
    }

    // LINHAS SEM CÓDIGO
    const emptyCode = rawData
      .map((a, index) => ({ codigo: a.codigo_ativo, index: index }))
      .filter((item) => !item.codigo);

    if (emptyCode.length) {
      const linhas = emptyCode.map((a) => a.index + 2);

      const preview = linhas.slice(0, 20).join(", ");
      const restante = linhas.length - 20;

      Alert.alert(
        "Erro na importação",
        restante > 0
          ? `Código não informado nas linhas: ${preview} e mais ${restante} linhas(s)`
          : `Código não informado nas linhas ${preview}`,
        [{ text: "OK", onPress: () => console.log("Fechou") }],
      );
      return;
    }

    // CÓDIGOS DUPLICADOS

    const duplicados = rawData.filter(
      (item, index, arr) =>
        arr.findIndex((a) => a.codigo_ativo === item.codigo_ativo) !== index,
    );

    if (duplicados.length) {
      Toast.show({
        type: "error",
        text1: "Remova os código duplicados da planilha.",
        position: "top",
        topOffset: 60,
      });
      return;
    }


const validations = [
  {
    field: "codigo_ativo",
    label: "Código",
    regex: /^[a-zA-Z0-9]+$/,
  },
  {
    field: "centroDeCustos",
    label: "Centro de custos",
    regex: /^[a-zA-Z0-9]*$/,
  },
  {
    field: "subdivisao",
    label: "Subdivisão",
    regex: /^[a-zA-Z0-9]*$/,
  },
  {
    field: "comentarios",
    label: "Comentários",
    regex: /^[a-zA-Z0-9]*$/,
  },
  {
    field: "categoria",
    label: "Categoria",
    regex: /^[a-zA-Z0-9]*$/,
  },
  {
    field: "localizacao",
    label: "Localização",
    regex: /^[a-zA-Z0-9]*$/,
  },
];



for (const validation of validations) {
  const invalidos = rawData
    .map((item, index) => ({ item, index }))
    .filter(
      ({ item }) =>
        !validation.regex.test(item[validation.field as keyof typeof item]),
    );

  if (invalidos.length) {
    const linhas = invalidos.map((l) => l.index + 2);

    const preview = linhas.slice(0, 20).join(", ");
    const restante = linhas.length - 20;

    Alert.alert(
      "Erro na importação",
      restante > 0
        ? `${validation.label} com valor inválido nas linhas: ${preview} e mais ${restante} linha(s).`
        : `${validation.label} com valor inválido nas linhas: ${preview}`,
      [{ text: "OK", onPress: () => console.log("Fechou") }],
    );

    return;
  }
}

    await inserirAtivos({ db, inventarioAtual, data: rawData });

    const res: Ativo[] = await buscarTodosAtivos(inventarioAtual.id, db);

    return res;
  } catch (error) {
    console.error("ERRO GERAL:", error);
  } finally {
    setLoading(false);
  }
};
