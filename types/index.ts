export type Ativo = {
  inventario_id: number;
  codigo_ativo: string;
  descricao: string;
  comentarios: string;
  categoria: string;
  localizacao: string;
  centroDeCustos: string;
  subdivisao: string;
  dataHoraInventariado: string;
  status: number;
  dataHoraCriacao: string;
  dataHoraAtualizacao: string;
};

export type Inventario = {
  id: number;
  codigo_inventario: string;
  descricao: string;
  status: number;
  dataHoraCriacao: string;
  dataHoraAtualizacao: string;
};

export type CentrosInventariosType = {
  id: number;
  aplica: number;
  codigo: number;
  centroDeCustos: string;
  subdivisao: string;
};

export type AtivosInventario = {
  inputType: number;
  inventario_id: number;
  codigo_ativo: string;
  descricao_ativo: string;
  categoria_ativo: string;
  comentarios_ativo: string;
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  centroDeCustos: string | null;
  subdivisao: string | null;
  novoCentroDeCustos: string | null;
  novaSubdivisao: string | null;
  dataHoraInventariado: Date;
};
