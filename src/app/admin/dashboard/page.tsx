'use client'

import { useEffect, useState } from 'react'
import { Agendamento } from '@/types'
import { formatarHora, formatarMoeda, formatarDataCurta } from '@/lib/utils/formatters'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Calendar, Users, TrendingUp, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function DashboardPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const hoje = format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    Promise.all([
      fetch(`/api/agendamentos?data=${hoje}`).then((r) => r.json()),
    ]).then(([deHoje]) => {
      setAgendamentos(Array.isArray(deHoje) ? deHoje : [])
      setLoading(false)
    })
  }, [hoje])

  const hojeAtivos = agendamentos.filter((a) => !['CANCELADO'].includes(a.status))
  const faturamentoHoje = hojeAtivos
    .filter((a) => a.status === 'CONCLUIDO')
    .reduce((s, a) => s + Number(a.valor), 0)
  const totalMes = hojeAtivos.length

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 capitalize">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Hoje', value: hojeAtivos.length, icon: Calendar, color: 'bg-blue-50 text-blue-700' },
          { label: 'Concluídos hoje', value: agendamentos.filter(a=>a.status==='CONCLUIDO').length, icon: Clock, color: 'bg-green-50 text-green-700' },
          { label: 'Faturamento hoje', value: formatarMoeda(faturamentoHoje), icon: TrendingUp, color: 'bg-rose-50 text-rose-700' },
          { label: 'Agendados', value: agendamentos.filter(a=>a.status==='AGENDADO').length, icon: Users, color: 'bg-amber-50 text-amber-700' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Agenda de hoje</h2>
        {loading ? (
          <p className="text-gray-400 text-sm">Carregando...</p>
        ) : hojeAtivos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            Nenhum agendamento para hoje.
          </div>
        ) : (
          <div className="space-y-3">
            {hojeAtivos.map((ag) => (
              <div key={ag.id} className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4 flex items-center gap-4">
                <div className="text-center w-12 flex-shrink-0">
                  <p className="text-lg font-bold text-rose-700">{formatarHora(ag.data_inicio)}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{ag.cliente?.nome}</p>
                  <p className="text-sm text-gray-500">{ag.servico?.nome}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-rose-700">{formatarMoeda(ag.valor)}</p>
                  <StatusBadge status={ag.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
