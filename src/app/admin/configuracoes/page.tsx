'use client'

import { useEffect, useState } from 'react'
import { ConfiguracaoClinica } from '@/types'
import { Button } from '@/components/ui/Button'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfiguracoesCLiente() {
  const searchParams = useSearchParams()
  const googleStatus = searchParams.get('google')

  const [config, setConfig] = useState<ConfiguracaoClinica | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [googleConectado, setGoogleConectado] = useState(false)

  useEffect(() => {
    fetch('/api/configuracoes')
      .then((r) => r.json())
      .then((d) => { setConfig(d); setLoading(false) })
      .catch(() => setLoading(false))

    fetch('/api/google/status')
      .then((r) => r.json())
      .then((d) => setGoogleConectado(d.conectado))
      .catch(() => {})
  }, [])

  async function salvar() {
    if (!config) return
    setSaving(true)
    await fetch('/api/configuracoes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    setSaving(false)
  }

  async function desconectarGoogle() {
    await fetch('/api/google/desconectar', { method: 'POST' })
    setGoogleConectado(false)
  }

  if (loading) return <p className="text-gray-400 text-sm p-6">Carregando...</p>
  if (!config) return <p className="text-gray-400 text-sm p-6">Sem dados de configuração.</p>

  return (
    <div className="p-4 sm:p-6 max-w-2xl">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Configurações</h1>

      {googleStatus === 'conectado' && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" /> Google Calendar conectado com sucesso!
        </div>
      )}
      {googleStatus === 'erro' && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
          <XCircle className="w-5 h-5" /> Erro ao conectar Google Calendar.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Dados da clínica</h2>
        <div className="space-y-4">
          {[
            { label: 'Nome comercial', key: 'nome_comercial' as const },
            { label: 'Telefone', key: 'telefone' as const },
            { label: 'WhatsApp (com DDI)', key: 'whatsapp' as const },
            { label: 'Endereço', key: 'endereco' as const },
            { label: 'Link Google Maps', key: 'google_maps_url' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                value={(config[key] as string) ?? ''}
                onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          ))}
        </div>
        <Button className="mt-4" onClick={salvar} loading={saving}>Salvar configurações</Button>
      </div>

      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-2">Google Calendar</h2>
        <p className="text-sm text-gray-500 mb-4">
          Conecte o Google Calendar para sincronizar automaticamente os agendamentos.
        </p>
        {googleConectado ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Conectado
            </div>
            <Button variant="danger" size="sm" onClick={desconectarGoogle}>Desconectar</Button>
          </div>
        ) : (
          <a
            href="/api/google/conectar"
            className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Conectar Google Calendar
          </a>
        )}
      </div>
    </div>
  )
}

export default function ConfiguracoesPage() {
  return (
    <Suspense fallback={<p className="p-6 text-gray-400">Carregando...</p>}>
      <ConfiguracoesCLiente />
    </Suspense>
  )
}
