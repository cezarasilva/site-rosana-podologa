import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { ServiceCard } from '@/components/public/ServiceCard'
import { createServiceClient } from '@/lib/supabase/server'
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

export default async function ServicosPage() {
  const servicos = await getServicos()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-rose-700 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-extrabold mb-2">Serviços</h1>
            <p className="text-rose-100">Conheça todos os serviços disponíveis</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {servicos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {servicos.map((s) => <ServiceCard key={s.id} servico={s} />)}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-16">Nenhum serviço disponível.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
