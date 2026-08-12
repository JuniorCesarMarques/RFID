import { SQLiteDatabase } from "expo-sqlite";

export async function codigoInventarioExiste(
  cod: string,
  db: SQLiteDatabase,
) {

  const inventario = await db.getAllAsync(
    `SELECT codigo_inventario FROM tbInventarios WHERE codigo_inventario = ?`,
    [cod]
  );


  return inventario.length;
}

