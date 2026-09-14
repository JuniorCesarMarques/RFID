import { useAtivo } from "@/contexts/AtivosContext";
import { useInventarios } from "@/contexts/InventariosContext";
import { useDataBase } from "@/database/DatabaseContext";
import { Erro, importarAtivosXLSX } from "@/services/importarAtivosXLSX";
import { selecionarArquivosXLSX } from "@/services/selecionarArquivosXLSX";
import { useMemo, useState } from "react";
import Toast from "react-native-toast-message";

export default function useImportAtivos() {
  const db = useDataBase();

  const { inventarioAtual } = useInventarios();

  const { setAtivos } = useAtivo();
  const [erros, setErros] = useState<Erro[]>();
  const [errorsModalState, setErrorsModalState] = useState<boolean>(false);

  const [loading, setLoading] =
    useState<boolean>(false);

  const errosPreview = useMemo(() => {
    return erros?.slice(0, 100);
  }, [erros]);

  const closeErrorsModal = () => {
    setErrorsModalState(false);
  };

  const handleImportacao = async () => {

    const result = await selecionarArquivosXLSX();

    if(!result) return;

    setLoading(true);
    const res = await importarAtivosXLSX({ inventarioAtual, result, db });

    setLoading(false);

    if (!res.ok) {
      if (res.motivo === "erros") {
        setErros(res.erros);
        setErrorsModalState(true);
      }

      if (res.motivo === "validacao")
        Toast.show({
          type: "error",
          text1: res.message,
        });

      return;
    }

    setAtivos(res.ativos);

    Toast.show({
      type: "success",
      text1: res.message,
    });
  };

  return {
    handleImportacao,
    errorsModalState,
    closeErrorsModal,
    errosPreview,
    erros,
    importAtivosLoading: loading 
  };
}
