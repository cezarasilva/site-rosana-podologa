'use client'

import { useState } from 'react'
import { Cliente } from '@/types'
import { Button } from '@/components/ui/Button'

interface Props {
  cliente?: Cliente
  onSuccess: (c: Cliente) => void
  onCancel: () => void
}

export function ClientForm({ cliente, onSuccess, onCancel }: Props) {
  const [nome, setNome] = useState(cliente?.nome ?? '')
  const [telefone, setTelefone] = useState(cliente?.telefone ?? '')
  const [email, setEmail] = useState(cliente?.email ?? '')
  const [observacoes, setObservacoes] = useState(cliente?.observacoes ?? '')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const body = { nome, telefone, email: email || null, observacoes: observacoes || null }
    const url = cliente ? `/api/clientes/${cliente.id}` : '/api/clientes'
    const method = cliente ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const json = await res.json()
    if (res.ok) {
      onSuccess(json)
    } else {
      setErro(json.error ?? 'Erro ao salvar')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
        <input required value={nome} onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp *</label>
        <input required type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={2}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none" />
      </div>
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>Salvar</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
