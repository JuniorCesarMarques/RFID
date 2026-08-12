import * as SQLite from "expo-sqlite";

export const initDb = async () => {

  const db = await SQLite.openDatabaseAsync("db_inventario_ativos");

  // UNIQUE (codigo_ativo, centroDeCustos, subdivisao)

  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tbAtivos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inventario_id INTEGER,
      codigo_ativo TEXT NOT NULL,
      descricao TEXT,
      comentarios TEXT,
      categoria TEXT,
      localizacao TEXT,
      centroDeCustos TEXT,
      subdivisao TEXT,
      dataHoraInventariado TEXT,
      status INTEGER,
      dataHoraCriacao TEXT,
      dataHoraAtualizacao TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_fk_ativos
    ON tbAtivos(codigo_ativo);
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tbInventarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo_inventario TEXT NOT NULL,
      descricao TEXT,
      status INTEGER,
      dataHoraCriacao TEXT,
      dataHoraAtualizacao TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tbCentrosInventarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inventario_id INTEGER,
      centroDeCustos TEXT,
      subdivisao TEXT,
      UNIQUE (inventario_id, centroDeCustos, subdivisao),
      FOREIGN KEY (inventario_id)
      REFERENCES tbInventarios(id)
      ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_fk_centro_inventarios
    ON tbCentrosInventarios(inventario_id, centroDeCustos, subdivisao);
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tbAtivosInventario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inventario_id INTEGER,
    codigo_ativo TEXT NOT NULL,
    descricao_ativo TEXT,
    comentarios_ativo TEXT,
    categoria_ativo TEXT,
    inputType INTEGER,
    latitude TEXT,
    longitude TEXT,
    accuracy TEXT,
    centroDeCustos TEXT,
    subdivisao TEXT,
    novoCentroDeCustos TEXT,
    novaSubdivisao TEXT,
    dataHoraInventariado TEXT,
    UNIQUE (inventario_id, codigo_ativo, centroDeCustos, subdivisao),
    FOREIGN KEY (inventario_id)
    REFERENCES tbInventarios(id)
    ON DELETE CASCADE
    );
    
    CREATE INDEX IF NOT EXISTS idx_fk_ativos_inventarios
    ON tbAtivosInventario(inventario_id, codigo_ativo, centroDeCustos, subdivisao);

    CREATE INDEX IF NOT EXISTS idx_fk_ativos_inventarios2
    ON tbAtivosInventario(inventario_id, codigo_ativo);
    `);

  return db;
};



