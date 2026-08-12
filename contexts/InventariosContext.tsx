import { Inventario } from "@/types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import { useDataBase } from "@/database/DatabaseContext";
import { getInventariosEmAberto } from "@/database/inventariosRepository";

type InventariosContextType = {
  inventarioAtual: Inventario | null;
  setInventarioAtual: React.Dispatch<SetStateAction<Inventario | null>>;
  inventarios: Inventario[];
  setInventarios: Dispatch<React.SetStateAction<Inventario[]>>;
};

const InventariosContext = createContext<InventariosContextType | null>(null);

export default function InventariosProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = useDataBase();

  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [inventarioAtual, setInventarioAtual] = useState<Inventario | null>(
    null,
  );

  useEffect(() => {
    const getInventarios = async () => {
      const res = await getInventariosEmAberto(db);
      setInventarios(res);
    };
    getInventarios();
  }, []);

  return (
    <InventariosContext.Provider
      value={{
        inventarios,
        setInventarios,
        inventarioAtual,
        setInventarioAtual,
      }}
    >
      {children}
    </InventariosContext.Provider>
  );
}

export const useInventarios = () => {
  const context = useContext(InventariosContext);
  if (!context) {
    throw new Error(
      "useInventarios deve ser usado dentro de IventariosProvider",
    );
  }
  return context;
};
