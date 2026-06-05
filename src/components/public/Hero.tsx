import Link from 'next/link'
import { Star, MessageCircle, Calendar } from 'lucide-react'
import { LINK_WA_PADRAO } from '@/lib/whatsapp'

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-rose-50 via-white to-pink-50 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Star className="w-4 h-4 fill-current" />
            5,0 no Google · 12 avaliações
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Cuidado profissional para seus pés em{' '}
            <span className="text-rose-700">São José dos Pinhais</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Atendimento especializado em podologia com carinho, dedicação e qualidade.
            Agende seu horário de forma rápida pelo WhatsApp ou pelo sistema online.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/agendar"
              className="inline-flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold px-6 py-4 rounded-xl text-base transition-colors shadow-md"
            >
              <Calendar className="w-5 h-5" />
              Agendar horário
            </Link>
            <a
              href={LINK_WA_PADRAO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl text-base transition-colors shadow-md"
            >
              <MessageCircle className="w-5 h-5" />
              Chamar no WhatsApp
            </a>
          </div>

          <div className="flex items-center gap-1 mt-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
            ))}
            <span className="ml-2 text-sm text-gray-600 font-medium">5,0 · 12 avaliações no Google</span>
          </div>
        </div>
      </div>
    </section>
  )
}
