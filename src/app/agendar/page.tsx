import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { AppointmentWizard } from '@/components/public/AppointmentWizard'

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ servico?: string }>
}) {
  const { servico } = await searchParams

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-rose-700 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-extrabold mb-2">Agendar Horário</h1>
            <p className="text-rose-100">Preencha as etapas para confirmar seu agendamento</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <AppointmentWizard servicoInicial={servico} />
        </div>
      </main>
      <Footer />
    </>
  )
}
