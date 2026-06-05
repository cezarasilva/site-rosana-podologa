'use client'

import { useEffect, useState } from 'react'
import { Servico } from '@/types'
import { ServiceForm } from '@/components/admin/ServiceForm'
import { formatarMoeda } from '@/lib/utils/formatters'
import { Plus, Pencil, ToggleLeft, ToggleRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ServicosAdminPage() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Servico | null>(null)

  function carregar() {
    setLoading(true)
    fetch('/api/servicos/all')
      .then((r) => r.json())
      .then((d) => { setServicos(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => {
        fetch('/api/servicos')
          .then((r) => r.json())
          .then((d) => { setServicos(Array.isArray(d) ? d : []); setLoading(false) })
      })
  }

  useEffect(() => { carregar() }, [])

  async function toggleAtivo(s: Servico) {
    await fetch(`/api/servicos/${s.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ativo: !s.ativo }),
    })
    carregar()
  }

  function handleSuccess(s: Servico) {
    setShowForm(false)
    setEditando(null)
    carregar()
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Serviços</h1>
        <Button onClick={() => { setShowForm(true); setEditando(null) }}>
          <Plus className="w-4 h-4" /> Novo serviço
        </Button>
      </div>

      {(showForm || editando) && (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">{editando ? 'Editar serviço' : 'Novo serviço'}</h2>
          <ServiceForm
            servico={editando ?? undefined}
            onSuccess={handleSuccess}
            onCancel={() => { setShowForm(false); setEditando(null) }}
          />
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {servicos.map((s) => (
            <div key={s.id} className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-3 ${!s.ativo ? 'opacity-60' : 'border-rose-100'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{s.nome}</p>
                  {!s.ativo && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inativo</span>}
                </div>
                {s.descricao && <p className="text-sm text-gray-500 truncate">{s.descricao}</p>}
                <p className="text-sm font-bold text-rose-700 mt-1">
                  {formatarMoeda(s.preco)} · {s.duracao_minutos} min
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditando(s)} className="w-9 h-9 flex items-center justify-center bg-rose-50 rounded-xl text-rose-600 hover:bg-rose-100">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => toggleAtivo(s)} className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100">
                  {s.ativo ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
