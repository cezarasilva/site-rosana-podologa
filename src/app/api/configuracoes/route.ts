import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const db = createServiceClient()
  const { data, error } = await db.from('configuracoes_clinica').select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await request.json()
  const db = createServiceClient()

  const { data: existing } = await db.from('configuracoes_clinica').select('id').single()

  let result
  if (existing) {
    result = await db
      .from('configuracoes_clinica')
      .update({ ...body, atualizado_em: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()
  } else {
    result = await db.from('configuracoes_clinica').insert(body).select().single()
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 })
  return NextResponse.json(result.data)
}
