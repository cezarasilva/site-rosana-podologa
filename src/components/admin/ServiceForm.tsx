'use client'

import { useState } from 'react'
import { Servico } from '@/types'
import { Button } from '@/components/ui/Button'

interface Props {
  servico?: Servico
  onSuccess: (s: Servico) => void
  onCancel: () => void
}

export function ServiceForm({ servico, onSuccess, onCancel }: Props) {
  const [nome, setNome] = useState(servico?.nome ?? '')
  const [descricao, setDescricao] = useState(servico?.descricao ?? '')
  const [preco, setPreco] = useState(String(servico?.preco ?? ''))
  const [duracao, setDuracao] = useState(String(servico?.duracao_minutos ?? '60'))
  const [ativo, setAtivo] = useState(servico?.ativo ?? true)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')

    const body = { nome, descricao, preco: parseFloat(preco), duracao_minutos: parseInt(duracao), ativo }
    const url = servico ? `/api/servicos/${servico.id}` : '/api/servicos'
    const method = servico ? 'PATCH' : 'POST'

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
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
        <input
          required
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duração (min) *</label>
          <input
            required
            type="number"
            min="15"
            step="15"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="ativo" checked={ativo} onChange={(e) => setAtivo(e.target.checked)}
          className="w-4 h-4 accent-rose-700" />
        <label htmlFor="ativo" className="text-sm text-gray-700">Serviço ativo</label>
      </div>
      {erro && <p className="text-red-600 text-sm">{erro}</p>}
      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading}>Salvar</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
