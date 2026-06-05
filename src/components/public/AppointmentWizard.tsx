'use client'

import { useState, useEffect } from 'react'
import { Servico, SlotDisponivel } from '@/types'
import { formatarMoeda, formatarDataCurta } from '@/lib/utils/formatters'
import { gerarLinkWhatsApp } from '@/lib/whatsapp'
import { addMonths, format, startOfMonth, getDaysInMonth, getDay, addDays, isBefore, startOfDay, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Check, Calendar, Clock, User, MessageCircle } from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5

const STEPS = ['Serviço', 'Data', 'Horário', 'Seus dados', 'Confirmação']

export function AppointmentWizard({ servicoInicial }: { servicoInicial?: string }) {
  const [step, setStep] = useState<Step>(1)
  const [servicos, setServicos] = useState<Servico[]>([])
  const [servico, setServico] = useState<Servico | null>(null)
  const [data, setData] = useState<string>('')
  const [hora, setHora] = useState<string>('')
  const [slots, setSlots] = useState<SlotDisponivel[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [mesAtual, setMesAtual] = useState(new Date())
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [observacao, setObservacao] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [agendamento, setAgendamento] = useState<{ id: string } | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    fetch('/api/servicos')
      .then((r) => r.json())
      .then((data) => {
        setServicos(data)
        if (servicoInicial) {
          const found = data.find((s: Servico) => s.id === servicoInicial)
          if (found) {
            setServico(found)
            setStep(2)
          }
        }
      })
  }, [servicoInicial])

  useEffect(() => {
    if (servico && data) {
      setLoadingSlots(true)
      fetch(`/api/disponibilidade?servico_id=${servico.id}&data=${data}`)
        .then((r) => r.json())
        .then((d) => { setSlots(d); setLoadingSlots(false) })
        .catch(() => setLoadingSlots(false))
    }
  }, [servico, data])

  const hoje = startOfDay(new Date())
  const diasNoMes = getDaysInMonth(mesAtual)
  const primeiroDiaMes = getDay(startOfMonth(mesAtual))
  const diasArray = Array.from({ length: diasNoMes }, (_, i) => i + 1)

  async function handleSubmit() {
    setSubmitting(true)
    setErro('')
    try {
      const [h, m] = hora.split(':').map(Number)
      const dataHora = parseISO(data)
      dataHora.setHours(h, m, 0, 0)

      const res = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servico_id: servico!.id,
          data_inicio: dataHora.toISOString(),
          cliente: { nome, telefone, observacao },
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setErro(json.error ?? 'Erro ao criar agendamento')
        setSubmitting(false)
        return
      }

      setAgendamento(json)
      setStep(5)
    } catch {
      setErro('Erro de conexão. Tente novamente.')
    }
    setSubmitting(false)
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
              ${i + 1 < step ? 'bg-rose-700 text-white' : i + 1 === step ? 'bg-rose-700 text-white ring-4 ring-rose-100' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1 < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-1 w-8 sm:w-12 mx-1 rounded transition-colors ${i + 1 < step ? 'bg-rose-700' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" /> Escolha o serviço
          </h2>
          <div className="space-y-3">
            {servicos.map((s) => (
              <button
                key={s.id}
                onClick={() => { setServico(s); setStep(2) }}
                className="w-full text-left bg-white border-2 border-rose-100 hover:border-rose-400 rounded-xl p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{s.nome}</p>
                    {s.descricao && <p className="text-sm text-gray-500 mt-0.5">{s.descricao}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-rose-700">{formatarMoeda(s.preco)}</p>
                    <p className="text-xs text-gray-400">{s.duracao_minutos} min</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setStep(1)} className="text-sm text-rose-600 font-medium flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-xl font-bold text-gray-900">Escolha a data</h2>
            <div />
          </div>

          <div className="bg-white rounded-2xl border border-rose-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setMesAtual(addMonths(mesAtual, -1))} className="p-2 rounded-lg hover:bg-gray-100">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-semibold text-gray-900 capitalize">
                {format(mesAtual, 'MMMM yyyy', { locale: ptBR })}
              </span>
              <button onClick={() => setMesAtual(addMonths(mesAtual, 1))} className="p-2 rounded-lg hover:bg-gray-100">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: primeiroDiaMes }).map((_, i) => <div key={`e${i}`} />)}
              {diasArray.map((dia) => {
                const d = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia)
                const dStr = format(d, 'yyyy-MM-dd')
                const passado = isBefore(d, hoje)
                const domingo = getDay(d) === 0
                const sel = dStr === data

                return (
                  <button
                    key={dia}
                    disabled={passado || domingo}
                    onClick={() => { setData(dStr); setHora(''); setStep(3) }}
                    className={`aspect-square rounded-lg text-sm font-medium transition-colors
                      ${sel ? 'bg-rose-700 text-white' : ''}
                      ${!sel && !passado && !domingo ? 'hover:bg-rose-100 text-gray-800' : ''}
                      ${passado || domingo ? 'text-gray-300 cursor-not-allowed' : ''}`}
                  >
                    {dia}
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">Domingos sem atendimento</p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setStep(2)} className="text-sm text-rose-600 font-medium flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-xl font-bold text-gray-900">Escolha o horário</h2>
            <div />
          </div>

          <p className="text-sm text-gray-500 mb-4 text-center">
            <span className="font-medium text-gray-700">{formatarDataCurta(data)}</span> · {servico?.nome}
          </p>

          {loadingSlots ? (
            <div className="text-center py-8 text-gray-400">Carregando horários...</div>
          ) : slots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Nenhum horário disponível nesta data.</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.hora}
                  disabled={!slot.disponivel}
                  onClick={() => { setHora(slot.hora); setStep(4) }}
                  className={`py-3 rounded-xl font-medium text-sm transition-colors
                    ${slot.hora === hora ? 'bg-rose-700 text-white' : ''}
                    ${slot.disponivel && slot.hora !== hora ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200' : ''}
                    ${!slot.disponivel ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through' : ''}`}
                >
                  {slot.hora}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setStep(3)} className="text-sm text-rose-600 font-medium flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
            <h2 className="text-xl font-bold text-gray-900">Seus dados</h2>
            <div />
          </div>

          <div className="bg-rose-50 rounded-xl p-3 mb-5 text-sm text-rose-800">
            <p><strong>{servico?.nome}</strong> · {formatarDataCurta(data)} às {hora}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(41) 99999-9999"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observação (opcional)</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Alguma informação adicional..."
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
              />
            </div>
          </div>

          {erro && <p className="text-red-600 text-sm mt-2">{erro}</p>}

          <button
            onClick={handleSubmit}
            disabled={!nome.trim() || !telefone.trim() || submitting}
            className="mt-6 w-full bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? 'Confirmando...' : 'Confirmar agendamento'}
          </button>
        </div>
      )}

      {step === 5 && agendamento && (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agendamento confirmado!</h2>
          <p className="text-gray-600 mb-2">
            <strong>{servico?.nome}</strong><br />
            {formatarDataCurta(data)} às {hora}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Em breve a Rosana entrará em contato para confirmar.
          </p>
          <a
            href={gerarLinkWhatsApp('5541999417269', `Olá Rosana! Acabei de agendar ${servico?.nome} para ${formatarDataCurta(data)} às ${hora}. Meu nome é ${nome}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chamar no WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
