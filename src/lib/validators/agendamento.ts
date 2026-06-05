import { z } from 'zod'

export const clienteSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  telefone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^[\d\s\-\(\)]+$/, 'Telefone inválido'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  observacao: z.string().optional(),
})

export const novoAgendamentoSchema = z.object({
  servico_id: z.string().uuid('Serviço inválido'),
  data_inicio: z.string().min(1, 'Data obrigatória'),
  cliente: clienteSchema,
})

export const remarcarSchema = z.object({
  data_inicio: z.string().min(1, 'Nova data obrigatória'),
})

export type ClienteInput = z.infer<typeof clienteSchema>
export type NovoAgendamentoInput = z.infer<typeof novoAgendamentoSchema>
export type RemarcarInput = z.infer<typeof remarcarSchema>
