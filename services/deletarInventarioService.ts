import { SQLiteDatabase } from "expo-sqlite";

export async function deletarInventario(id: number, db: SQLiteDatabase){
    await db.runAsync(`DELETE FROM tbInventarios WHERE id = ${id}`);
}