import Link from 'next/link'
import { MapPin, Phone, Scissors } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-rose-700 rounded-full flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-sm leading-none">Rosana Oliveira</p>
                <p className="text-xs text-rose-400 leading-none">Podóloga</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Atendimento especializado em podologia com carinho, dedicação e qualidade.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Início' },
                { href: '/servicos', label: 'Serviços' },
                { href: '/agendar', label: 'Agendar' },
                { href: '/quem-somos', label: 'Quem Somos' },
                { href: '/contato', label: 'Contato' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-rose-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contato</h4>
            <div className="space-y-3 text-sm">
              <a
                href="https://wa.me/5541999417269"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-rose-400 transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                (41) 99941-7269
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>R. Etelvina Pímentel Rodrigues, 143 — Ipê, São José dos Pinhais - PR</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Podóloga Rosana Oliveira. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
