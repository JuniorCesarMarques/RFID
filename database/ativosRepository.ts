import { Realizado } from "@/app/(tabs)/dashboard";
import { AtivoComEncontrado } from "@/app/(tabs)/inventario";
import { AtivosMapa } from "@/app/(tabs)/mapa";
import { CentroDivisao } from "@/components/CentrosDeCustosSelect";
import { CentrosAplica } from "@/components/EditModal";
import { Ativo, AtivosInventario, AtivoToInsert, Inventario } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";

type InserirAtivosParams = {
  db: SQLiteDatabase;
  inventarioAtual: Inventario | null;
  data: any[];
};

export async function inserirAtivos({
  db,
  inventarioAtual,
  data,
}: InserirAtivosParams) {
  if (!inventarioAtual) return;

  await db.runAsync(`DELETE FROM tbAtivos WHERE inventario_id = ?`, [
    inventarioAtual.id,
  ]);

  const BATCH_SIZE = 200;

  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);

    try {
      await db.execAsync("BEGIN TRANSACTION");
      for (const row of batch) {
        const a: Ativo = {
          inventario_id: inventarioAtual.id,
          codigo_ativo: String(row.codigo_ativo ?? ""),
          valor: Number(row.valor),
          descricao: String(row.descricao ?? ""),
          comentarios: String(row.comentarios ?? ""),
          categoria: String(row.categoria ?? ""),
          localizacao: String(row.localizacao ?? ""),
          centroDeCustos: String(row.centrodecustos ?? ""),
          subdivisao: String(row.subdivisao ?? ""),
          dataHoraInventariado: String(row.datahorainventariado ?? ""),
          status: Number(row.status ?? 0),
          dataHoraCriacao: String(row.dataHoraCriacao ?? ""),
          dataHoraAtualizacao: String(row.datahoraatualizacao ?? ""),
        };
        await db.runAsync(
          `INSERT INTO tbAtivos
            (inventario_id, codigo_ativo, valor, descricao, comentarios, categoria, localizacao, centroDeCustos, subdivisao, dataHoraInventariado, status, dataHoraCriacao, dataHoraAtualizacao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            a.inventario_id,
            a.codigo_ativo,
            a.valor,
            a.descricao,
            a.comentarios,
            a.categoria,
            a.localizacao,
            a.centroDeCustos,
            a.subdivisao,
            a.dataHoraInventariado,
            a.status,
            a.dataHoraCriacao,
            a.dataHoraAtualizacao,
          ],
        );
      }
      await db.execAsync("COMMIT");
    } catch (err) {
      console.error("Erro no batch:", err);
      await db.execAsync("ROLLBACK");
      console.log("rowback");
      throw err;
    }
  }
}

export async function buscarTodosAtivos(
  inventario_id: number | undefined,
  db: SQLiteDatabase,
) {
  if (!inventario_id) return [];

  try {
    const ativos: Ativo[] = await db.getAllAsync(
      `
      SELECT
        inventario_id,
        codigo_ativo, 
        valor, 
        descricao, 
        comentarios, 
        categoria, 
        localizacao, 
        centroDeCustos, 
        subdivisao, 
        dataHoraInventariado, 
        status, 
        dataHoraCriacao, 
        dataHoraAtualizacao 
      FROM tbAtivos 
        WHERE inventario_id = ?
      ORDER BY
        valor
      DESC;
    `,
      [inventario_id],
    );

    return ativos;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function buscarAtivoPeloCodigo(db: SQLiteDatabase, codigo: string){

  const res = await db.getFirstAsync(`SELECT codigo_ativo FROM tbAtivos WHERE codigo_ativo = ?`, [codigo]);

  return res;

}

export async function buscarAtivosInventario(
  inventarioId: number,
  db: SQLiteDatabase,
) {
  try {

  }catch(err){
    console.log("Erro ao buscar AtivosInventario")
  }
  const centroInventarios = await db.getAllAsync<AtivoComEncontrado>(`
      SELECT
        A.Encontrado,
        A.id,
        A.inventario_id,
        A.codigo_ativo,
        A.valor,
        A.descricao,
        A.comentarios,
        A.categoria,
        A.centroDeCustos,
        A.subdivisao,
        A.novoCentroDeCustos,
        A.novaSubdivisao,
        A.dataHoraInventariado
    FROM
    (
      SELECT
        IIF(C.id IS NULL, 0, 1) AS Encontrado,
        A.id,
        C.inventario_id,
        A.codigo_ativo,
        A.valor,
        A.descricao,
        A.comentarios,
        A.categoria,
        A.centroDeCustos,
        A.subdivisao,
        C.novoCentroDeCustos,
        C.novaSubdivisao,
        A.dataHoraInventariado
    FROM
        tbAtivos AS A
    LEFT JOIN
        tbAtivosInventario AS C
      ON
    (
      A.inventario_id = C.inventario_id AND 
      A.codigo_ativo = C.codigo_ativo 
    )
      INNER JOIN
        tbCentrosInventarios B
      ON
        B.inventario_id = A.inventario_id AND
        IIF(C.novoCentroDeCustos IS NULL, A.centroDeCustos, C.novoCentroDeCustos) = B.centroDeCustos AND
        IIF(C.novaSubdivisao IS NULL, A.subdivisao, C.novaSubdivisao) = B.subdivisao
    WHERE
      A.inventario_id = '${inventarioId}'
  ) AS A  
    UNION ALL
      SELECT
        IIF(A.nao_cadastrado = 0, 2, 3) AS Encontrado,
        A.id,
        A.inventario_id,
        A.codigo_ativo,
        B.valor,
        A.descricao,
        A.comentarios,
        A.categoria,
        A.centroDeCustos,
        A.subdivisao,
        A.novoCentroDeCustos,
        A.novaSubdivisao,
        A.dataHoraInventariado
      FROM
        tbAtivosInventario AS A
      LEFT JOIN
        tbAtivos AS B
      ON
        A.inventario_id = B.inventario_id AND
        A.codigo_ativo = B.codigo_ativo
      LEFT JOIN
        tbCentrosInventarios AS C
      ON
      (
        C.inventario_id = A.inventario_id
        AND C.centroDeCustos = IIF(A.novoCentroDeCustos IS NULL, A.centroDeCustos, A.novoCentroDeCustos) 
      AND
        C.subdivisao = IIF(A.novaSubdivisao IS NULL, A.subdivisao, A.novaSubdivisao)
      )
    WHERE
        A.inventario_id = '${inventarioId}'
        AND C.inventario_id IS NULL
    ORDER BY
      B.valor
    DESC;
    `);

  return centroInventarios;
}



export async function buscarTodosOsCentros(db: SQLiteDatabase) {
  const centros = await db.getAllAsync<CentroDivisao>(`
    SELECT DISTINCT centroDeCustos, subdivisao
      FROM tbAtivos
    ORDER BY centroDeCustos, subdivisao;
     `);

  return centros;
}

export async function buscarCentrosAplicaveis(
  inventarioAtual: number,
  db: SQLiteDatabase,
) {
  const result: CentrosAplica[] = await db.getAllAsync(`
      SELECT DISTINCT
        IIF(B.inventario_id IS NULL, 0, 1) AS aplica,
        C.centroDeCustos,
        C.subdivisao
      FROM
      (
      SELECT
        centroDeCustos,
        subdivisao
      FROM tbAtivos
      WHERE inventario_id = '${inventarioAtual}'
        UNION
      SELECT
        novoCentroDeCustos AS centroDeCustos,
        novaSubdivisao AS subdivisao
      FROM tbAtivosInventario
      WHERE inventario_id = '${inventarioAtual}' AND
      novoCentroDeCustos IS NOT NULL
        ) AS C
        LEFT JOIN
        (
      SELECT
        inventario_id,
        centroDeCustos,
        subdivisao
      FROM tbCentrosInventarios
      WHERE inventario_id = '${inventarioAtual}'
    ) AS B
    ON
      B.centroDeCustos = C.centroDeCustos AND
      B.subdivisao = C.subdivisao
    ORDER BY
      C.centroDeCustos,
      C.subdivisao;
    `);

  return result;
}

export async function getAtivosInventariosHistorico(
  db: SQLiteDatabase,
  inventarioId: number,
) {

  return await db.getAllAsync<AtivosInventario>(`
    SELECT 
        A.usuario_responsavel,
        C.codigo_inventario,
        A.codigo_ativo,
        A.descricao,
        A.categoria,
        A.centroDeCustos,
        A.subdivisao,
        A.novoCentroDeCustos,
        A.novaSubdivisao,
        A.latitude,
        A.longitude,
        A.accuracy,
        A.comentarios,
        IIF(A.inputType=1,'X','') AS RFID,
        A.dataHoraInventariado,
        A.Extra,
        IIF(A.nao_cadastrado = 1, 'X', '') AS NaoCadastrados
      FROM 
      (
        SELECT *, 
        IIF(B.id IS NULL AND A.nao_cadastrado = 0, 'X', '') AS Extra FROM tbAtivosInventario AS A
          LEFT JOIN
        tbCentrosInventarios AS B
          ON
        A.inventario_id = B.inventario_id AND
        IIF(A.novoCentroDeCustos IS NULL, A.centroDeCustos, A.novoCentroDeCustos) = B.centroDeCustos AND
        IIF(A.novaSubdivisao IS NULL, A.subdivisao, A.novaSubdivisao) = B.subdivisao
      ) AS A
      INNER JOIN
    tbInventarios AS C
      ON
    A.inventario_id = C.id
      WHERE
    A.inventario_id = ${inventarioId};
      ORDER BY A.codigo_ativo`);
}

export async function buscarAtivosInventarioDashboard(
  db: SQLiteDatabase,
  id: number | undefined,
) {
  if (!id) return [];

  const res = await db.getAllAsync<Realizado>(`
            SELECT
              centroDeCustos,
              subdivisao,
              SUM(Total) AS Total,
              SUM(Realizado) AS Realizado
            FROM
            (
              SELECT DISTINCT
                IIF(C.novoCentroDeCustos IS NULL,A.centroDeCustos,C.novoCentroDeCustos) AS centroDeCustos,
				        IIF(C.novaSubdivisao IS NULL,A.subdivisao,C.novaSubdivisao) AS subdivisao,
                A.codigo_ativo,
                1 AS Total,
                IIF(C.codigo_ativo IS NULL,0,1) AS Realizado
              FROM
                tbAtivos AS A
              LEFT JOIN
                tbAtivosInventario AS C
              ON
              (
                C.inventario_id = A.inventario_id AND
                C.codigo_ativo = A.codigo_ativo 
              )
              INNER JOIN
              (
                SELECT
                  inventario_id,
                  centroDeCustos,
                  subdivisao
                FROM
                  tbCentrosInventarios
              ) AS B
              ON
              (
                B.inventario_id = A.inventario_id AND
                B.centroDeCustos = IIF(C.novoCentroDeCustos IS NULL, A.centroDeCustos, C.novoCentroDeCustos) AND
                B.subdivisao = IIF(C.novaSubdivisao IS NULL, A.subdivisao, C.novaSubdivisao)
              )
              WHERE A.inventario_id = ${id}
            ) AS A 
            GROUP BY
              centroDeCustos,
              subdivisao
            ORDER BY
              centroDeCustos,
              subdivisao;
          `);

  return res;
}

export async function inserirAtivo(
  db: SQLiteDatabase,
  ativoInventario: AtivosInventario,
) {
  try {
    await db.runAsync(`
    INSERT INTO tbAtivosInventario (
      inventario_id,
      usuario_responsavel,
      codigo_ativo,
      nao_cadastrado,
      descricao,
      comentarios, 
      categoria, 
      inputType, 
      latitude, 
      longitude, 
      accuracy,  
      centroDeCustos, 
      subdivisao,
      novoCentroDeCustos,
      novaSubdivisao, 
      dataHoraInventariado
    )
    VALUES (
      ${ativoInventario.inventario_id}, 
      '${ativoInventario.usuario_responsavel}',
      '${ativoInventario.codigo_ativo}',
        ${ativoInventario.nao_cadastrado}, 
      '${ativoInventario.descricao}', 
      '${ativoInventario.comentarios}', 
      '${ativoInventario.categoria}', 
      ${ativoInventario.inputType}, 
      '${ativoInventario.latitude}', 
      '${ativoInventario.longitude}', 
      '${ativoInventario.accuracy}',  
      '${ativoInventario.centroDeCustos}', 
      '${ativoInventario.subdivisao}', 
      ${
        ativoInventario.novoCentroDeCustos == null
          ? "NULL"
          : `'${ativoInventario.novoCentroDeCustos}'`
      }, 
      ${
        ativoInventario.novaSubdivisao == null
          ? "NULL"
          : `'${ativoInventario.novaSubdivisao}'`
      }, 
      '${ativoInventario.dataHoraInventariado}'
    )
    ON CONFLICT(inventario_id, codigo_ativo, centroDeCustos, subdivisao)
    DO UPDATE SET
      latitude = IIF(excluded.accuracy < accuracy, excluded.latitude, latitude),
      longitude = IIF(excluded.accuracy < accuracy, excluded.longitude, longitude),
      accuracy = IIF(excluded.accuracy < accuracy, excluded.accuracy, accuracy),
      centroDeCustos = excluded.centroDeCustos,
      subdivisao = excluded.subdivisao,
      novoCentroDeCustos = excluded.novoCentroDeCustos,
      novaSubdivisao = excluded.novaSubdivisao,
      comentarios = excluded.comentarios,
      dataHoraInventariado = excluded.dataHoraInventariado;
`);
  } catch (err) {
    console.log(err);
  }
}

export async function inserirAtivoLista(db: SQLiteDatabase, ativo: AtivoToInsert){

  const ativoFormatado: AtivoToInsert = {
    inventario_id: ativo.inventario_id,
    codigo_ativo: ativo.codigo_ativo,
    descricao: ativo.descricao,
    comentarios: ativo.comentarios,
    categoria: ativo.categoria,
    centroDeCustos: ativo.centroDeCustos,
    subdivisao: ativo.subdivisao,
    dataHoraInventariado: ativo.dataHoraInventariado,
    status: ativo.status,
    dataHoraCriacao: ativo.dataHoraCriacao,
    dataHoraAtualizacao: ativo.dataHoraAtualizacao
  }

  const values = Object.values(ativoFormatado).map(v => typeof v === "string" ? v.trim() : v);

  const res = await db.runAsync(`INSERT INTO tbAtivos (
      inventario_id,
      codigo_ativo,
      descricao,
      comentarios,
      categoria,
      centroDeCustos,
      subdivisao,
      dataHoraInventariado,
      status,
      dataHoraCriacao,
      dataHoraAtualizacao 
    )
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [...values]);

      return res.lastInsertRowId;
}

export async function contarAtivos(db: SQLiteDatabase, id: number) {
  const res = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(DISTINCT A.codigo_ativo) AS total
        FROM tbAtivosInventario AS A
      INNER JOIN 
        tbCentrosInventarios AS B
      ON
        B.inventario_id = A.inventario_id AND
        B.centroDeCustos = IIF(A.novoCentroDeCustos IS NULL, A.centroDeCustos, A.novoCentroDeCustos) AND
        B.subdivisao = IIF(A.novaSubdivisao IS NULL, A.subdivisao, A.novaSubdivisao)
      WHERE B.inventario_id = '${id}';`,
  );

  return res;
}

export async function buscarAtivosMapa(
  db: SQLiteDatabase,
  inventarioId: number,
) {
  const res: AtivosMapa[] = await db.getAllAsync(
    `SELECT 
        A.latitude, 
        A.longitude, 
        A.descricao,
        A.categoria,
        A.codigo_ativo,
        1 AS Aplica
      FROM 
          tbAtivosInventario AS A
      INNER JOIN
          tbCentrosInventarios AS B
      ON
    (
    B.inventario_id = A.inventario_id
    AND B.centroDeCustos = IIF(
        A.novoCentroDeCustos IS NULL,
        A.centroDeCustos,
        A.novoCentroDeCustos
    )
    AND B.subdivisao = IIF(
        A.novaSubdivisao IS NULL,
        A.subdivisao,
        A.novaSubdivisao
      )
      )
    WHERE
    A.inventario_id = '${inventarioId}';`,
  );

  return res;
}
