import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { createCalendarEvent } from '@/lib/google/calendar'
import { addMinutes, parseISO } from 'date-fns'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const data = searchParams.get('data')
  const db = createServiceClient()

  let query = db
    .from('agendamentos')
    .select('*, cliente:clientes(*), servico:servicos(*)')
    .order('data_inicio')

  if (status) query = query.eq('status', status)
  if (data) {
    query = query
      .gte('data_inicio', `${data}T00:00:00`)
      .lte('data_inicio', `${data}T23:59:59`)
  }

  const { data: agendamentos, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(agendamentos)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const db = createServiceClient()

  const { servico_id, data_inicio, cliente: clienteData } = body

  const { data: servico, error: servicoError } = await db
    .from('servicos')
    .select('duracao_minutos, preco, nome')
    .eq('id', servico_id)
    .single()

  if (servicoError || !servico) {
    return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 })
  }

  const inicio = parseISO(data_inicio)
  const fim = addMinutes(inicio, servico.duracao_minutos)

  if (inicio < new Date()) {
    return NextResponse.json({ error: 'Não é possível agendar no passado' }, { status: 400 })
  }

  const { count } = await db
    .from('agendamentos')
    .select('id', { count: 'exact', head: true })
    .not('status', 'in', '("CANCELADO","CONCLUIDO","NAO_COMPARECEU")')
    .or(
      `and(data_inicio.lte.${fim.toISOString()},data_fim.gt.${inicio.toISOString()})`
    )

  if (count && count > 0) {
    return NextResponse.json({ error: 'Horário indisponível' }, { status: 409 })
  }

  const telefoneNormalizado = clienteData.telefone?.replace(/\D/g, '')

  let clienteId: string

  const { data: existente } = await db
    .from('clientes')
    .select('id')
    .eq('telefone', telefoneNormalizado)
    .single()

  if (existente) {
    clienteId = existente.id
    await db.from('clientes').update({ nome: clienteData.nome }).eq('id', clienteId)
  } else {
    const { data: novoCliente, error: clienteError } = await db
      .from('clientes')
      .insert({ nome: clienteData.nome, telefone: telefoneNormalizado, email: clienteData.email })
      .select('id')
      .single()

    if (clienteError || !novoCliente) {
      return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
    }
    clienteId = novoCliente.id
  }

  const { data: agendamento, error: agendamentoError } = await db
    .from('agendamentos')
    .insert({
      cliente_id: clienteId,
      servico_id,
      data_inicio: inicio.toISOString(),
      data_fim: fim.toISOString(),
      valor: servico.preco,
      observacao_cliente: clienteData.observacao || null,
      status: 'AGENDADO',
      criado_por: 'CLIENTE',
    })
    .select('*, cliente:clientes(*), servico:servicos(*)')
    .single()

  if (agendamentoError || !agendamento) {
    return NextResponse.json({ error: 'Erro ao criar agendamento' }, { status: 500 })
  }

  try {
    const eventId = await createCalendarEvent({
      titulo: servico.nome,
      descricao: clienteData.observacao || '',
      inicio: inicio.toISOString(),
      fim: fim.toISOString(),
      nomeCliente: clienteData.nome,
      telefoneCliente: telefoneNormalizado,
    })
    if (eventId) {
      await db
        .from('agendamentos')
        .update({ google_event_id: eventId })
        .eq('id', agendamento.id)
    }
  } catch {}

  return NextResponse.json(agendamento, { status: 201 })
}
