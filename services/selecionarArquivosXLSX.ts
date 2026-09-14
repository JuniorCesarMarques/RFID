import * as DocumentPicker from "expo-document-picker";

export async function selecionarArquivosXLSX() {
    
  const result = await DocumentPicker.getDocumentAsync({
    type: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ],
    copyToCacheDirectory: true,
  });

  if (result.canceled) {
    return;
  }

  return result;
}
