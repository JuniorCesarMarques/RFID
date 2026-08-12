import { EditFormType } from "@/components/EditModal";
import { FormData } from "@/components/InventarioForm";
import { Inventario } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";

export async function getInventariosEmAberto(db: SQLiteDatabase) {
  return await db.getAllAsync<Inventario>(
    `SELECT * FROM tbInventarios WHERE status = 1;`,
  );
}

export async function getHistoricos(db: SQLiteDatabase) {
  return await db.getAllAsync<Inventario>(
    `SELECT * FROM tbInventarios WHERE status <> 1`,
  );
}

export async function getAllInventarios(db: SQLiteDatabase) {
  return await db.getAllAsync<Inventario>(`SELECT * FROM tbInventarios;`);
}

export async function criarInventario(
  db: SQLiteDatabase,
  data: FormData,
  dataHora: string,
) {
  return await db.runAsync(
    `INSERT INTO tbInventarios
          (codigo_inventario, descricao, status, dataHoraCriacao, dataHoraAtualizacao)
          VALUES (?, ?, ?, ?, ?)`,
    [data.codigo, data.descricao, 1, dataHora, dataHora],
  );
}

export async function editarInventario(
  db: SQLiteDatabase,
  data: EditFormType,
  id: number,
  dataHora: string,
) {
  return await db.runAsync(
      `UPDATE tbInventarios SET
       codigo_inventario = '${data.codigo}',
       status = '${data.status}',
       descricao = '${data.descricao}',
       dataHoraAtualizacao = '${dataHora}'
     WHERE id = ${id};`,
    );
}
