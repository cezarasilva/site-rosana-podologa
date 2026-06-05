import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { Star } from 'lucide-react'

export default function QuemSomosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-rose-700 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-extrabold mb-2">Quem Somos</h1>
            <p className="text-rose-100">Conheça a história da Podóloga Rosana Oliveira</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="prose prose-gray max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              A Podóloga Rosana Oliveira oferece atendimento especializado em cuidados com os pés,
              unindo técnica, atenção e carinho em cada procedimento.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Localizada no bairro Ipê, em São José dos Pinhais, atende clientes que buscam conforto,
              bem-estar e um serviço feito com dedicação.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Com avaliação 5,0 no Google, a Rosana é reconhecida pelos clientes pelo atendimento de
              qualidade, profissionalismo e cuidado em cada detalhe.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              O objetivo é proporcionar uma experiência segura, acolhedora e eficiente, ajudando cada
              cliente a cuidar melhor da saúde dos seus pés.
            </p>

            <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100 flex items-center gap-4">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />)}
                </div>
                <p className="font-bold text-gray-900">5,0 no Google</p>
                <p className="text-sm text-gray-500">Com base em 12 avaliações</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
