'use client'

import { useEffect, useState } from 'react'
import { Agendamento } from '@/types'
import { AppointmentCard } from '@/components/admin/AppointmentCard'
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Filtro = 'hoje' | 'amanha' | 'semana' | 'mes' | 'cancelados' | 'concluidos'

function getFiltroParams(filtro: Filtro): Record<string, string> {
  const hoje = new Date()
  switch (filtro) {
    case 'hoje': return { data: format(hoje, 'yyyy-MM-dd') }
    case 'amanha': return { data: format(addDays(hoje, 1), 'yyyy-MM-dd') }
    case 'semana': return {
      de: format(startOfWeek(hoje, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      ate: format(endOfWeek(hoje, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    }
    case 'mes': return {
      de: format(startOfMonth(hoje), 'yyyy-MM-dd'),
      ate: format(endOfMonth(hoje), 'yyyy-MM-dd'),
    }
    case 'cancelados': return { status: 'CANCELADO' }
    case 'concluidos': return { status: 'CONCLUIDO' }
  }
}

export default function AgendaPage() {
  const [filtro, setFiltro] = useState<Filtro>('hoje')
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = getFiltroParams(filtro)
    const qs = new URLSearchParams(params).toString()
    fetch(`/api/agendamentos?${qs}`)
      .then((r) => r.json())
      .then((d) => { setAgendamentos(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filtro])

  function handleUpdate(updated: Agendamento) {
    setAgendamentos((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  const filtros: { key: Filtro; label: string }[] = [
    { key: 'hoje', label: 'Hoje' },
    { key: 'amanha', label: 'Amanhã' },
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mês' },
    { key: 'cancelados', label: 'Cancelados' },
    { key: 'concluidos', label: 'Concluídos' },
  ]

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Agenda</h1>
        <p className="text-sm text-gray-500 capitalize">
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filtros.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${filtro === key ? 'bg-rose-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-rose-50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Carregando...</p>
      ) : agendamentos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          Nenhum agendamento encontrado.
        </div>
      ) : (
        <div className="space-y-3">
          {agendamentos.map((ag) => (
            <AppointmentCard key={ag.id} agendamento={ag} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
