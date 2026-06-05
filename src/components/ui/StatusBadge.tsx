import { StatusAgendamento } from '@/types'

const config: Record<StatusAgendamento, { label: string; className: string }> = {
  AGENDADO: { label: 'Agendado', className: 'bg-blue-100 text-blue-800' },
  CONFIRMADO: { label: 'Confirmado', className: 'bg-green-100 text-green-800' },
  REMARCADO: { label: 'Remarcado', className: 'bg-yellow-100 text-yellow-800' },
  CANCELADO: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
  CONCLUIDO: { label: 'Concluído', className: 'bg-gray-100 text-gray-700' },
  NAO_COMPARECEU: { label: 'Não compareceu', className: 'bg-orange-100 text-orange-800' },
}

export function StatusBadge({ status }: { status: StatusAgendamento }) {
  const { label, className } = config[status] ?? config.AGENDADO
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
