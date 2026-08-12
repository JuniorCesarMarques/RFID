import * as React from "react";
import { DataTable } from "react-native-paper";

type Props = {
  totalItems: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  numberOfItemsPerPage: number;
  onItemsPerPageChange: React.Dispatch<React.SetStateAction<number>>;
};

const numberOfItemsPerPageList = [20, 50, 100];

const MyComponent = ({
  onItemsPerPageChange,
  numberOfItemsPerPage,
  totalItems,
  setPage,
  page,
}: Props) => {
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, totalItems);

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  return (
    <DataTable>
      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(totalItems / numberOfItemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} de ${totalItems}`}
        showFastPaginationControls
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={numberOfItemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel={"Items por pagina"}
      />
    </DataTable>
  );
};

export default MyComponent;
