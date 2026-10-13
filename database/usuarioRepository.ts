import { SQLiteDatabase } from "expo-sqlite";

export async function changeUser(
  db: SQLiteDatabase,
  usuario: string,
  inventario_id: number,
) {
  const res = await db.runAsync(
    "UPDATE tbInventarios SET usuario_responsavel = ? WHERE id = ?",
    [usuario, inventario_id],
  );

  return res;
}
