import { SQLiteDatabase } from "expo-sqlite";


export default async function restaurarHistorico(id: number, db: SQLiteDatabase){
    await db.execAsync(`UPDATE tbInventarios SET status = 1 WHERE id = ${id};`);
}