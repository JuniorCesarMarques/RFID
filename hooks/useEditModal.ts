import { useState } from "react";

export const useEditModal = () => {
  const [editModalState, setEditModalState] = useState<boolean>(false);

  const openModal = () => {
    setEditModalState(true);
  };

  const closeModal = () => {
    setEditModalState(false);
  };

  return {
    openModal,
    closeModal,
    editModalState
  };
};
