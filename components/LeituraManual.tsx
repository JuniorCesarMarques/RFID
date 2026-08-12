import { View } from "react-native";
import LeituraManualForm from "./LeituraManualForm";
import { SetStateAction } from "react";

export default function LeituraManual({
  onSubmit,
  setChecked,
  checked
}: {
  onSubmit: (data: any) => Promise<boolean>;
    setChecked: React.Dispatch<SetStateAction<boolean>>;
    checked: boolean;
}) {

  return (
    <View>
      <LeituraManualForm checked={checked} setChecked={setChecked} onSubmit={onSubmit} />
    </View>
  );
}

