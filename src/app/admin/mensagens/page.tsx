'use client'

import { useEffect, useState } from 'react'
import { MensagemModelo } from '@/types'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function MensagensPage() {
  const [modelos, setModelos] = useState<MensagemModelo[]>([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState<MensagemModelo | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [saving, setSaving] = useState(false)

  function carregar() {
    fetch('/api/mensagens')
      .then((r) => r.json())
      .then((d) => { setModelos(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { carregar() }, [])

  function abrirForm(m?: MensagemModelo) {
    setEditando(m ?? null)
    setTitulo(m?.titulo ?? '')
    setMensagem(m?.mensagem ?? '')
    setShowForm(true)
  }

  async function salvar() {
    setSaving(true)
    const url = editando ? `/api/mensagens/${editando.id}` : '/api/mensagens'
    const method = editando ? 'PATCH' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, mensagem, ativo: true }),
    })
    setSaving(false)
    setShowForm(false)
    carregar()
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este modelo?')) return
    await fetch(`/api/mensagens/${id}`, { method: 'DELETE' })
    carregar()
  }

  const variaveis = ['{nome}', '{servico}', '{data}', '{hora}', '{valor}']

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Mensagens WhatsApp</h1>
          <p className="text-sm text-gray-500">Modelos de mensagem para envio rápido</p>
        </div>
        <Button onClick={() => abrirForm()}>
          <Plus className="w-4 h-4" /> Novo modelo
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">{editando ? 'Editar modelo' : 'Novo modelo'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input value={titulo} onChange={(e) => setTitulo(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {variaveis.map((v) => (
                  <button key={v} onClick={() => setMensagem(m => m + v)}
                    className="text-xs bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full hover:bg-rose-100">
                    {v}
                  </button>
                ))}
              </div>
              <textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={4}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={salvar} loading={saving}>Salvar</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {modelos.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl border border-rose-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">{m.titulo}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{m.mensagem}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => abrirForm(m)} className="w-8 h-8 flex items-center justify-center bg-rose-50 rounded-lg text-rose-600 hover:bg-rose-100">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => excluir(m.id)} className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg text-red-500 hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
