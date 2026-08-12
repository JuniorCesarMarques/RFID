import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import * as XLSX from "xlsx";

export const exportTemplate = async (): Promise<void> => {
  try {

    const modelo = [
      {
        codigo_ativo: "",
        descricao: "",
        comentarios: "",
        centroDeCustos: "",
        subdivisao: "",
        categoria: "",
        localizacao: "",
        dataHoraInventariado: "",
        status: "",
        dataHoraCriacao: "",
        dataHoraAtualizacao: "",
      },
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modelo);

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo");

    const base64: string = XLSX.write(workbook, {
      type: "base64",
      bookType: "xlsx",
    });

    const fileUri: string =
      FileSystem.documentDirectory + "modelo_ativos.xlsx";

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

      const uri: string =
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          "modelo_ativos.xlsx",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );

      await FileSystem.writeAsStringAsync(uri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } else {
      await Sharing.shareAsync(fileUri);
    }
  } catch (error) {
    console.error("Erro ao gerar modelo:", error);

    Toast.show({
      type: "error",
      text1: "Erro ao baixar modelo",
    });
  }
};