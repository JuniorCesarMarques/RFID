import { SQLiteDatabase } from "expo-sqlite";

type Data = {
  novoCentroDeCustos: string;
  novaSubdivisao: string;
  codigos: string[];
};

export default async function editarCentrosService(
  db: SQLiteDatabase,
  data: Data,
) {
  const placeholders = data.codigos.map(() => "?").join(",");

  try {
    const res = await db.runAsync(
      `UPDATE tbAtivosInventario SET novoCentroDeCustos = ?, novaSubdivisao = ? WHERE codigo_ativo IN (${placeholders})`,
      [data.novoCentroDeCustos, data.novaSubdivisao, ...data.codigos],
    );


    return res;
  } catch (err) {
    console.log(err);
  }
}
