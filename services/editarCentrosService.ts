import { SQLiteDatabase } from "expo-sqlite";

type Data = {
  novoCentroDeCustos: string;
  novaSubdivisao: string;
  ids: number[];
};

export default async function editarCentrosService(
  db: SQLiteDatabase,
  data: Data,
) {
  const placeholders = data.ids.map(() => "?").join(",");

  try {
    const res = await db.runAsync(
      `UPDATE tbAtivosInventario SET novoCentroDeCustos = ?, novaSubdivisao = ? WHERE id IN (${placeholders})`,
      [data.novoCentroDeCustos, data.novaSubdivisao, ...data.ids],
    );

    return res;
  } catch (err) {
    console.log(err);
  }
}
