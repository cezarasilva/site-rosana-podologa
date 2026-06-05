'use client'

import { useState } from 'react'
import { Agendamento } from '@/types'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { formatarHora, formatarDataCurta, formatarMoeda, formatarTelefone } from '@/lib/utils/formatters'
import { MessageCircle, Check, X, Clock, RefreshCw, Phone } from 'lucide-react'
import { MessageModal } from './MessageModal'

interface Props {
  agendamento: Agendamento
  onUpdate: (a: Agendamento) => void
}

export function AppointmentCard({ agendamento, onUpdate }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [showMsg, setShowMsg] = useState(false)
  const [showRemarcar, setShowRemarcar] = useState(false)
  const [novaData, setNovaData] = useState('')
  const [novaHora, setNovaHora] = useState('')

  const ag = agendamento
  const isFinalizado = ['CANCELADO', 'CONCLUIDO', 'NAO_COMPARECEU'].includes(ag.status)

  async function action(tipo: string) {
    setLoading(tipo)
    let url = `/api/agendamentos/${ag.id}/${tipo}`
    let body: Record<string, unknown> = {}

    if (tipo === 'remarcar') {
      if (!novaData || !novaHora) return setLoading(null)
      const d = new Date(`${novaData}T${novaHora}:00`)
      body = { data_inicio: d.toISOString() }
    }
    if (tipo === 'confirmar') {
      url = `/api/agendamentos/${ag.id}`
      body = { status: 'CONFIRMADO' }
    }

    try {
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (res.ok) onUpdate(json)
    } finally {
      setLoading(null)
      setShowRemarcar(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-4 ${isFinalizado ? 'opacity-70' : 'border-rose-100'}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-base">{ag.cliente?.nome}</span>
            <StatusBadge status={ag.status} />
          </div>
          <p className="text-sm text-gray-500">{ag.servico?.nome}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-rose-700">{formatarMoeda(ag.valor)}</p>
          <p className="text-xs text-gray-400">{formatarDataCurta(ag.data_inicio)}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-rose-400" />
          {formatarHora(ag.data_inicio)} – {formatarHora(ag.data_fim)}
        </span>
        {ag.cliente?.telefone && (
          <span className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-rose-400" />
            {formatarTelefone(ag.cliente.telefone)}
          </span>
        )}
      </div>

      {ag.observacao_cliente && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3">
          {ag.observacao_cliente}
        </p>
      )}

      {!isFinalizado && (
        <div className="flex flex-wrap gap-2 mt-2">
          {ag.status === 'AGENDADO' && (
            <Button size="sm" onClick={() => action('confirmar')} loading={loading === 'confirmar'}>
              <Check className="w-4 h-4" /> Confirmar
            </Button>
          )}
          <Button size="sm" variant="whatsapp" onClick={() => setShowMsg(true)}>
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setShowRemarcar(!showRemarcar)}>
            <RefreshCw className="w-4 h-4" /> Remarcar
          </Button>
          <Button size="sm" variant="danger" onClick={() => action('cancelar')} loading={loading === 'cancelar'}>
            <X className="w-4 h-4" /> Cancelar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => action('concluir')} loading={loading === 'concluir'}>
            <Check className="w-4 h-4" /> Concluir
          </Button>
        </div>
      )}

      {showRemarcar && (
        <div className="mt-3 bg-rose-50 rounded-xl p-3 flex flex-wrap gap-2 items-end">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Nova data</label>
            <input type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)}
              className="border rounded-lg px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Horário</label>
            <input type="time" value={novaHora} onChange={(e) => setNovaHora(e.target.value)}
              className="border rounded-lg px-2 py-1.5 text-sm" />
          </div>
          <Button size="sm" onClick={() => action('remarcar')} loading={loading === 'remarcar'}>
            Confirmar
          </Button>
        </div>
      )}

      {showMsg && ag.cliente && (
        <MessageModal
          cliente={ag.cliente}
          agendamento={ag}
          onClose={() => setShowMsg(false)}
        />
      )}
    </div>
  )
}
