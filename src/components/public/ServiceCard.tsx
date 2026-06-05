import Link from 'next/link'
import { Clock, Calendar } from 'lucide-react'
import { Servico } from '@/types'
import { formatarMoeda } from '@/lib/utils/formatters'

export function ServiceCard({ servico }: { servico: Servico }) {
  return (
    <div className="bg-white rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{servico.nome}</h3>
        {servico.descricao && (
          <p className="text-sm text-gray-500 leading-relaxed">{servico.descricao}</p>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-rose-400" />
          {servico.duracao_minutos} min
        </span>
        <span className="text-lg font-bold text-rose-700">{formatarMoeda(servico.preco)}</span>
      </div>

      <Link
        href={`/agendar?servico=${servico.id}`}
        className="mt-auto inline-flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
      >
        <Calendar className="w-4 h-4" />
        Agendar este serviço
      </Link>
    </div>
  )
}
