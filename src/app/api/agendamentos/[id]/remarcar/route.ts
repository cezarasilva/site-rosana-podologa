import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { updateCalendarEvent } from '@/lib/google/calendar'
import { addMinutes, parseISO } from 'date-fns'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { id } = await params
  const { data_inicio } = await request.json()
  const db = createServiceClient()

  const { data: agendamento } = await db
    .from('agendamentos')
    .select('*, servico:servicos(duracao_minutos)')
    .eq('id', id)
    .single()

  if (!agendamento) return NextResponse.json({ error: 'Agendamento não encontrado' }, { status: 404 })

  const inicio = parseISO(data_inicio)
  const fim = addMinutes(inicio, agendamento.servico.duracao_minutos)

  const { count } = await db
    .from('agendamentos')
    .select('id', { count: 'exact', head: true })
    .neq('id', id)
    .not('status', 'in', '("CANCELADO","CONCLUIDO","NAO_COMPARECEU")')
    .or(`and(data_inicio.lte.${fim.toISOString()},data_fim.gt.${inicio.toISOString()})`)

  if (count && count > 0) {
    return NextResponse.json({ error: 'Horário indisponível' }, { status: 409 })
  }

  const { data, error } = await db
    .from('agendamentos')
    .update({
      data_inicio: inicio.toISOString(),
      data_fim: fim.toISOString(),
      status: 'REMARCADO',
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, cliente:clientes(*), servico:servicos(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (agendamento.google_event_id) {
    try {
      await updateCalendarEvent(agendamento.google_event_id, {
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
      })
    } catch {}
  }

  return NextResponse.json(data)
}
