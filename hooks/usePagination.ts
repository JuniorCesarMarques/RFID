import { useState } from "react";

export default function usePagination() {
  const [paginaAtual, setPaginaAtual] = useState<number>(0);

  const numberOfItemsPerPageList = [20, 50, 100];
  const [numberOfItemsPerPage, setNumberOfItemsPerPage] = useState<number>(
    numberOfItemsPerPageList[0],
  );

  const inicio = paginaAtual * numberOfItemsPerPage;
  const fim = inicio + numberOfItemsPerPage;

  return {
    inicio,
    fim,
    paginaAtual,
    setPaginaAtual,
    numberOfItemsPerPage,
    setNumberOfItemsPerPage,
  };
}
