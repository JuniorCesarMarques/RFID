import { useState } from "react";

export const useEditModal = () => {
  const [editModalState, setEditModalState] = useState<boolean>(false);

  const openEditModal = () => {
    setEditModalState(true);
  };

  const closeEditModal = () => {
    setEditModalState(false);
  };

  return {
    openEditModal,
    closeEditModal,
    editModalState
  };
};
