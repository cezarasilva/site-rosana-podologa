import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const db = createServiceClient()

  const { data: usuario } = await db
    .from('usuarios')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (usuario) {
    await db
      .from('google_integracoes')
      .update({ ativo: false, atualizado_em: new Date().toISOString() })
      .eq('usuario_id', usuario.id)
  }

  return NextResponse.json({ ok: true })
}
