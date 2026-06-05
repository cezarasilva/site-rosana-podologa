import { Header } from '@/components/public/Header'
import { Footer } from '@/components/public/Footer'
import { MapPin, Phone, MessageCircle } from 'lucide-react'
import { LINK_WA_PADRAO } from '@/lib/whatsapp'

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-rose-700 text-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-extrabold mb-2">Contato</h1>
            <p className="text-rose-100">Entre em contato ou venha nos visitar</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">(41) 99941-7269</p>
                </div>
              </div>
              <a
                href={LINK_WA_PADRAO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                <Phone className="w-4 h-4" /> Chamar agora
              </a>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Endereço</p>
                  <p className="text-sm text-gray-500">R. Etelvina Pímentel Rodrigues, 143</p>
                  <p className="text-sm text-gray-500">Ipê — São José dos Pinhais - PR</p>
                </div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=R.%20Etelvina%20P%C3%ADmentel%20Rodrigues%2C%20143%20-%20Ip%C3%AA%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais%20-%20PR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                <MapPin className="w-4 h-4" /> Ver no Maps
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden border border-rose-100 shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=R.%20Etelvina%20P%C3%ADmentel%20Rodrigues%2C%20143%20-%20Ip%C3%AA%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Pinhais&output=embed"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
