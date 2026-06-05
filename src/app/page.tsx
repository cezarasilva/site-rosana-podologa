import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { Hero } from '@/components/public/Hero'
import { ServiceCard } from '@/components/public/ServiceCard'
import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin, Clock, Star, MessageCircle, Calendar, CheckCircle } from 'lucide-react'
import { LINK_WA_PADRAO } from '@/lib/whatsapp'
import { Servico } from '@/types'

async function getServicos(): Promise<Servico[]> {
  try {
    const supabase = createServiceClient()
    const { data } = await supabase.from('servicos').select('*').eq('ativo', true).order('preco')
    return data ?? []
  } catch {
    return []
  }
}

const avaliacoes = [
  { nome: 'Maria Clara', texto: 'Atendimento maravilhoso! A Rosana é super atenciosa e profissional. Recomendo muito!', estrelas: 5 },
  { nome: 'Fernanda Lima', texto: 'Fui pela primeira vez e amei. Saí com os pés perfeitos e bem tratados.', estrelas: 5 },
  { nome: 'Juliana Souza', texto: 'Melhor podóloga da região! Ambiente limpo, atendimento top e resultado excelente.', estrelas: 5 },
]

export default async function Home() {
  const servicos = await getServicos()

  return (
    <>
      <Header />
      <main>
        <Hero />

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Serviços</h2>
              <p className="text-gray-500">Escolha o serviço ideal para você</p>
            </div>
            {servicos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {servicos.map((s) => <ServiceCard key={s.id} servico={s} />)}
              </div>
            ) : (
              <p className="text-center text-gray-400">Carregando serviços...</p>
            )}
          </div>
        </section>

        <section className="py-16 bg-rose-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Como funciona</h2>
              <p className="text-gray-500">Agendar é rápido e fácil</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: Calendar, title: 'Escolha a data', desc: 'Selecione o serviço, data e horário disponível.' },
                { icon: CheckCircle, title: 'Confirme seus dados', desc: 'Informe seu nome e WhatsApp para confirmar.' },
                { icon: Clock, title: 'Compareça no horário', desc: 'Apareça no local no horário marcado.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-rose-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/agendar" className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base shadow-md">
                <Calendar className="w-5 h-5" /> Agendar agora
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Avaliações</h2>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />)}
              </div>
              <p className="text-gray-500 text-sm">5,0 · 12 avaliações no Google</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {avaliacoes.map((a) => (
                <div key={a.nome} className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />)}
                  </div>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">"{a.texto}"</p>
                  <p className="text-sm font-semibold text-gray-900">— {a.nome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Quem somos</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  A Podóloga Rosana Oliveira oferece atendimento especializado em cuidados com os pés,
                  unindo técnica, atenção e carinho em cada procedimento.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Localizada no bairro Ipê, em São José dos Pinhais, atende clientes que buscam conforto,
                  bem-estar e um serviço feito com dedicação.
                </p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />)}
                  <span className="ml-1.5 text-sm font-medium text-gray-600">5,0 no Google</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">R. Etelvina Pímentel Rodrigues, 143 — Ipê, São José dos Pinhais - PR</p>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=R.%20Etelvina%20P%C3%ADmentel%20Rodrigues%2C%20143%20-%20Ip%C3%AA%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais%20-%20PR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-rose-600 hover:underline font-medium"
                >
                  Ver no Google Maps →
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 bg-rose-700 text-white">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-extrabold mb-3">Fale com a Rosana</h2>
            <p className="text-rose-100 mb-6">Tire suas dúvidas ou agende pelo WhatsApp agora mesmo.</p>
            <a
              href={LINK_WA_PADRAO}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-400 hover:bg-green-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base shadow-lg"
            >
              <MessageCircle className="w-5 h-5" /> Chamar no WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
