import { Alert } from "react-native";

// Padroniza o alert, util quando for usado em muitos componentes
export default function confirmAction(
  title: string,
  message: string,
  confirmText: string,
  onConfirm: () => Promise<void>,
) {
  Alert.alert(title, message, [
    { text: "Cancelar", style: "cancel" },
    {   text: confirmText, 
        style: "destructive",
        onPress: async () => {
            try {
                await onConfirm()
            }catch(err){
                console.log(err)
            }
        }
 }
  ]);
}
