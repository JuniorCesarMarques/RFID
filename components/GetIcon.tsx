import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function GetIcon({
  descricao,
}: {
  descricao: string;
}) {
  function normalizar(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const texto = normalizar(descricao);

 const mapaIcones = {
  notebook: () => <AntDesign name="laptop" size={24} color="black" />,
  computador: () => <FontAwesome6 name="computer" size={24} color="black" />,
  monitor: () => <AntDesign name="desktop" size={24} color="black" />,
  mesa: () => <MaterialIcons name="desk" size={24} color="black" />,
  cadeira: () => <MaterialIcons name="chair-alt" size={24} color="black" />,
  impressora: () => <MaterialCommunityIcons name="printer-settings" size={24} color="black" />
} as const;

for (const palavra of Object.keys(mapaIcones) as Array<keyof typeof mapaIcones>) {
  if (texto.includes(palavra)) {
    return mapaIcones[palavra]();
  }
}

return <MaterialIcons name="device-unknown" size={24} color="black" />;

}
