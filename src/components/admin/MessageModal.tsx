'use client'

import { useState, useEffect } from 'react'
import { Agendamento, Cliente, MensagemModelo } from '@/types'
import { aplicarVariaveis, gerarLinkWhatsApp } from '@/lib/whatsapp'
import { formatarDataCurta, formatarHora, formatarMoeda } from '@/lib/utils/formatters'
import { X, MessageCircle } from 'lucide-react'

interface Props {
  cliente: Cliente
  agendamento: Agendamento
  onClose: () => void
}

export function MessageModal({ cliente, agendamento, onClose }: Props) {
  const [modelos, setModelos] = useState<MensagemModelo[]>([])
  const [texto, setTexto] = useState('')

  const vars = {
    nome: cliente.nome,
    servico: agendamento.servico?.nome ?? '',
    data: formatarDataCurta(agendamento.data_inicio),
    hora: formatarHora(agendamento.data_inicio),
    valor: formatarMoeda(agendamento.valor),
  }

  useEffect(() => {
    fetch('/api/mensagens')
      .then((r) => r.json())
      .then(setModelos)
      .catch(() => {})

    setTexto(aplicarVariaveis(
      'Olá {nome}, tudo bem? Seu atendimento de {servico} está agendado para {data} às {hora}.',
      vars
    ))
  }, [])

  function aplicarModelo(modelo: MensagemModelo) {
    setTexto(aplicarVariaveis(modelo.mensagem, vars))
  }

  const link = gerarLinkWhatsApp(cliente.telefone, texto)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Enviar WhatsApp</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Para: <strong className="text-gray-800">{cliente.nome}</strong></p>
            <p className="text-xs text-gray-400">{cliente.telefone}</p>
          </div>

          {modelos.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Modelos rápidos:</p>
              <div className="flex flex-wrap gap-1.5">
                {modelos.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => aplicarModelo(m)}
                    className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {m.titulo}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Mensagem</label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
            />
          </div>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors w-full"
          >
            <MessageCircle className="w-5 h-5" />
            Abrir WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
