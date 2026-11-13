import { useState } from "react";

export function useFilter() {

  const [valorFiltro, setValorFiltro] = useState("");
  const [campoFiltro, setCampoFiltro] = useState("codigo_ativo");

  const updateFilterField = (field: string) => {
    setCampoFiltro(field);
  }

    const updateFilterValue = (value: string) => {
    setValorFiltro(value);
  }

  return { valorFiltro, campoFiltro, updateFilterValue, updateFilterField };
}
