import { useState } from "react";

export default function usePagination() {
  const [paginaAtual, setPaginaAtual] = useState<number>(0);

  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState<number>(20);

  const onPaginaAtualChange = (n: number) => {
    setPaginaAtual(n);
  }

  const onItemsPerPageChange = (n: number) => {
    setNumberOfItemsPerPage(n);
  }

  const inicio = paginaAtual * numberOfItemsPerPage;
  const fim = inicio + numberOfItemsPerPage;

  return {
    inicio,
    fim,
    paginaAtual,
    onPaginaAtualChange,
    numberOfItemsPerPage,
    onItemsPerPageChange,
  };
}
