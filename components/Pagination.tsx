import * as React from "react";
import { DataTable } from "react-native-paper";

type Props = {
  totalItems: number;
  onPageChange: (n: number) => void;
  page: number;
  numberOfItemsPerPage: number;
  onItemsPerPageChange: (n: number) => void;
};

const numberOfItemsPerPageList = [20, 50, 100];

const MyComponent = ({
  onItemsPerPageChange,
  numberOfItemsPerPage,
  totalItems,
  onPageChange,
  page,
}: Props) => {
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, totalItems);

  React.useEffect(() => {
    onPageChange(0);
  }, [numberOfItemsPerPage]);

  return (
    <DataTable>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(totalItems / numberOfItemsPerPage)}
        onPageChange={onPageChange}
        label={`${from + 1}-${to} de ${totalItems}`}
        showFastPaginationControls
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={numberOfItemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel={"Itens por pagina"}
      />
    </DataTable>
  );
};

export default MyComponent;
