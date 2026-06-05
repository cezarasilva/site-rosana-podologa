import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Podóloga Rosana Oliveira | São José dos Pinhais',
  description:
    'Atendimento especializado em podologia em São José dos Pinhais. Agende seu horário online. ★★★★★ 5,0 no Google.',
  keywords: 'podóloga, podologia, São José dos Pinhais, Rosana Oliveira, cuidados com os pés',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
