import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const busca = searchParams.get('busca')
  const db = createServiceClient()

  let query = db.from('clientes').select('*').order('nome')

  if (busca) {
    query = query.or(`nome.ilike.%${busca}%,telefone.ilike.%${busca}%`)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const db = createServiceClient()

  const telefoneNormalizado = body.telefone?.replace(/\D/g, '')

  const { data: existente } = await db
    .from('clientes')
    .select('id')
    .eq('telefone', telefoneNormalizado)
    .single()

  if (existente) {
    const { data, error } = await db
      .from('clientes')
      .update({ nome: body.nome, atualizado_em: new Date().toISOString() })
      .eq('id', existente.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await db
    .from('clientes')
    .insert({ ...body, telefone: telefoneNormalizado })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
