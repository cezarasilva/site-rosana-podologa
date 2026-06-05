'use client'

import { useEffect, useState } from 'react'
import { Cliente } from '@/types'
import { ClientForm } from '@/components/admin/ClientForm'
import { formatarTelefone } from '@/lib/utils/formatters'
import { gerarLinkWhatsApp } from '@/lib/whatsapp'
import { Search, Plus, MessageCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState<Cliente | null>(null)

  function carregar(q = '') {
    setLoading(true)
    fetch(`/api/clientes?busca=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => { setClientes(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  function handleBusca(v: string) {
    setBusca(v)
    const timeout = setTimeout(() => carregar(v), 400)
    return () => clearTimeout(timeout)
  }

  function handleSuccess(c: Cliente) {
    setShowForm(false)
    setEditando(null)
    carregar(busca)
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">{clientes.length} cadastrados</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditando(null) }} size="md">
          <Plus className="w-4 h-4" /> Novo
        </Button>
      </div>

      {(showForm || editando) && (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">{editando ? 'Editar cliente' : 'Novo cliente'}</h2>
          <ClientForm
            cliente={editando ?? undefined}
            onSuccess={handleSuccess}
            onCancel={() => { setShowForm(false); setEditando(null) }}
          />
        </div>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={busca}
          onChange={(e) => handleBusca(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Carregando...</p>
      ) : clientes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
          Nenhum cliente encontrado.
        </div>
      ) : (
        <div className="space-y-2">
          {clientes.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{c.nome}</p>
                <p className="text-sm text-gray-500">{formatarTelefone(c.telefone)}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={gerarLinkWhatsApp(c.telefone, `Olá ${c.nome}!`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center bg-green-50 rounded-xl text-green-600 hover:bg-green-100"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setEditando(c)}
                  className="w-9 h-9 flex items-center justify-center bg-rose-50 rounded-xl text-rose-600 hover:bg-rose-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
