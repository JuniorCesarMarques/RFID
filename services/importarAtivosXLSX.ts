import { buscarTodosAtivos, inserirAtivos } from "@/database/ativosRepository";
import { Ativo, Inventario } from "@/types";
import * as DocumentPicker from "expo-document-picker";
import { SQLiteDatabase } from "expo-sqlite";
import * as XLSX from "xlsx";

const requiredColumns = [
  "codigo_ativo",
  "descricao",
  "comentarios",
  "centrodecustos",
  "subdivisao",
  "categoria",
  "localizacao",
  "datahorainventariado",
  "status",
  "datahoracriacao",
  "datahoraatualizacao",
];

type importarAtivosXLSXParams = {
  inventarioAtual: Inventario | null;
  result: DocumentPicker.DocumentPickerSuccessResult;
  db: SQLiteDatabase;
};

type importarAtivosXLSXResponse =
  | {
      ok: true;
      ativos: Ativo[];
      message: string;
    }
  | {
      ok: false;
      motivo: "inventario_nao_selecionado" | "erro inesperado";
    }
  | {
      ok: false;
      motivo: "validacao";
      message: string;
    }
  | {
      ok: false;
      motivo: "erros";
      erros: Erro[];
    };

export type Erro = {
  linha: number;
  erro: string;
};

export const importarAtivosXLSX = async ({
  inventarioAtual,
  result,
  db,
}: importarAtivosXLSXParams): Promise<importarAtivosXLSXResponse> => {
  if (!inventarioAtual)
    return { ok: false, motivo: "inventario_nao_selecionado" };

  try {

    const file = result.assets[0];

    const response = await fetch(file.uri);
    const arrayBuffer = await response.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json<any>(sheet, { defval: null });

    const normalizedData = rawData.map((row) => {
      const normalizedRow: Record<string, any> = {};

      for (const [key, value] of Object.entries(row)) {
        const normalizedKey = key.trim().toLowerCase().replace(/\s/g, "");
        normalizedRow[normalizedKey] = value;
      }

      return normalizedRow;
    });

    const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

    // VALIDAÇÕES

    // REQUIRED COLUNMS
    const columnsNormalized = (rows[0] ?? []).map((col) =>
      col?.toString().trim().toLowerCase().replace(/\s/g, ""),
    );

    const missing = requiredColumns.filter(
      (col) => !columnsNormalized.includes(col),
    );

    console.log("MISSING", missing)
    console.log("COLUNS NORMALIZED:", columnsNormalized)

    if (missing.length) {
      return {
        ok: false,
        motivo: "validacao",
        message: "A planilha possui colunas inválidas ou faltantes.",
      };
    }

    // PLANILHA SEM DADOS
    if (!rawData.length) {
      return {
        ok: false,
        motivo: "validacao",
        message: "Nenhum dado encontrado na planilha.",
      };
    }

    const validations = [
      {
        field: "codigo_ativo",
        label: "Código",
        regex: /^[a-zA-Z0-9]+$/,
      },
      {
        field: "descricao",
        label: "Descrição",
        regex: /^(?!\s*$).+/,
      },
      {
        field: "centrodecustos",
        label: "Centro de custos",
        regex: /^[a-zA-Z0-9]+$/,
      },
      {
        field: "subdivisao",
        label: "Subdivisão",
        regex: /^[a-zA-Z0-9]*$/,
      },
      {
        field: "comentarios",
        label: "Comentários",
        regex: /^[a-zA-Z0-9]*$/,
      },
      {
        field: "categoria",
        label: "Categoria",
        regex: /^[a-zA-Z0-9]*$/,
      },
      {
        field: "localizacao",
        label: "Localização",
        regex: /^[a-zA-Z0-9]*$/,
      },
    ];

    let erros: Erro[] = [];

    for (const validation of validations) {
      for (let i = 0; i < rawData.length; i++) {
        const value = normalizedData[i][validation.field] ?? "";


        if (!validation.regex.test(value)) {
          erros.push({
            linha: i + 2,
            erro: `${validation.label} com valor inválido.`,
          });
        }
      }
    }

    erros.sort((a, b) => a.linha - b.linha);

    if (erros.length) return { ok: false, motivo: "erros", erros: erros };

    console.log("NORMALIZED DATA1", normalizedData);

    await inserirAtivos({ db, inventarioAtual, data: normalizedData });

    const res: Ativo[] = await buscarTodosAtivos(inventarioAtual.id, db);

    return { ok: true, ativos: res, message: "Ativos importados com sucesso." };
  } catch (error) {
    console.error("ERRO GERAL:", error);

    return {
      ok: false,
      motivo: "erro inesperado",
    };
  }
};
