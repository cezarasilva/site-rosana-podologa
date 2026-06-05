export type StatusAgendamento =
  | 'AGENDADO'
  | 'CONFIRMADO'
  | 'REMARCADO'
  | 'CANCELADO'
  | 'CONCLUIDO'
  | 'NAO_COMPARECEU'

export interface Servico {
  id: string
  nome: string
  descricao: string | null
  preco: number
  duracao_minutos: number
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface Cliente {
  id: string
  nome: string
  telefone: string
  email: string | null
  data_nascimento: string | null
  observacoes: string | null
  criado_em: string
  atualizado_em: string
}

export interface Agendamento {
  id: string
  cliente_id: string
  servico_id: string
  data_inicio: string
  data_fim: string
  status: StatusAgendamento
  valor: number
  observacao_cliente: string | null
  observacao_interna: string | null
  google_event_id: string | null
  criado_por: string
  criado_em: string
  atualizado_em: string
  cliente?: Cliente
  servico?: Servico
}

export interface HorarioAtendimento {
  id: string
  dia_semana: number
  hora_inicio: string
  hora_fim: string
  intervalo_minutos: number
  ativo: boolean
}

export interface BloqueioAgenda {
  id: string
  titulo: string
  data_inicio: string
  data_fim: string
  motivo: string | null
  criado_em: string
}

export interface MensagemModelo {
  id: string
  titulo: string
  mensagem: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface GoogleIntegracao {
  id: string
  usuario_id: string
  google_email: string | null
  calendar_id: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

export interface ConfiguracaoClinica {
  id: string
  nome_comercial: string
  telefone: string
  whatsapp: string
  endereco: string
  google_maps_url: string | null
  avaliacao_google: number
  total_avaliacoes: number
  atualizado_em: string
}

export interface SlotDisponivel {
  hora: string
  disponivel: boolean
}

export interface NovoAgendamento {
  servico_id: string
  data_inicio: string
  cliente: {
    nome: string
    telefone: string
    email?: string
    observacao?: string
  }
}

export interface ApiError {
  error: string
  details?: string
}
