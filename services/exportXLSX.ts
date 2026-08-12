import { Inventario } from "@/types";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import * as XLSX from "xlsx";

type ExportXLSXParams = {
  rows: any[];
  inventario?: Inventario;
  nome?: string;
};

export const exportXLSX = async ({
  rows,
  inventario,
  nome,
}: ExportXLSXParams) => {

  // transforma dados (rows) em uma “folha” da planilha.
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);

  // cria o arquivo Excel
  const workbook: XLSX.WorkBook = XLSX.utils.book_new();

  // Arquivo Excel, aba criada e nome da aba
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

  const base64: string = XLSX.write(workbook, {
    type: "base64",
    bookType: "xlsx",
  });

  const fileUri: string = FileSystem.documentDirectory + "historico.xlsx";

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (Platform.OS === "android") {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) return;

    const base64: string = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const agora = new Date();

    const data = agora.toISOString().split("T")[0];
    const hora = agora.toTimeString().split(" ")[0].replace(/:/g, "-");

    const uri: string = await FileSystem.StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      nome
        ? nome
        : `inventario-${inventario?.codigo_inventario}${data}H${hora}.xlsx`,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    await FileSystem.writeAsStringAsync(uri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } else {
    await Sharing.shareAsync(fileUri);
  }
};
