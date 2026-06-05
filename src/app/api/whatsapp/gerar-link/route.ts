import { NextRequest, NextResponse } from 'next/server'
import { gerarLinkWhatsApp } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  const { telefone, mensagem } = await request.json()

  if (!telefone || !mensagem) {
    return NextResponse.json({ error: 'telefone e mensagem são obrigatórios' }, { status: 400 })
  }

  const url = gerarLinkWhatsApp(telefone, mensagem)
  return NextResponse.json({ url })
}
