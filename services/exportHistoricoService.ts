import { getAtivosInventariosHistorico } from "@/database/ativosRepository";
import { AtivosInventario, Inventario } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";
import { exportXLSX } from "./exportXLSX";

export const exportHistorico= async (
  inventario: Inventario,
  db: SQLiteDatabase,
): Promise<void> => {

  let historico: AtivosInventario[] = await getAtivosInventariosHistorico(
    db,
    inventario.id,
  );

  exportXLSX({rows: historico, inventario});

};
