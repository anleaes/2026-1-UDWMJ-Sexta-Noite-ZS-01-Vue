export type UserTipo = 'cliente' | 'administrador' | 'guest'

export type AuthUser = {
  tipo: UserTipo
  nome?: string
  email?: string
  token?: string
}

export type Filme = {
  id: number
  titulo: string
  genero: number
  duracao: number
  classificacao: string
}

export type Genero = {
  id: number
  nome: string
  descricao: string
  icone: string
}

export type Assento = {
  id: number
  numero: number
  fila: string
  status: boolean
  id_sala: number
}

export type Sessao = {
  id: number
  horario: string
  sala: number
  ativa: boolean
  filme: number
}

export type Pedido = {
  id: number
  status: string
  dataHora?: string
}

export interface Sala {
  id: number;
  nome: string;
  capacidade: number;
}