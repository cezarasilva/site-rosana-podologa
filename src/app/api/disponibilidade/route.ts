import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { addMinutes, format, parse, isAfter, isBefore, parseISO } from 'date-fns'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const servicoId = searchParams.get('servico_id')
  const data = searchParams.get('data')

  if (!servicoId || !data) {
    return NextResponse.json({ error: 'Parâmetros obrigatórios: servico_id, data' }, { status: 400 })
  }

  const db = createServiceClient()

  const { data: servico } = await db
    .from('servicos')
    .select('duracao_minutos')
    .eq('id', servicoId)
    .single()

  if (!servico) return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 })

  const dataObj = parseISO(data)
  const diaSemana = dataObj.getDay()

  const { data: horarios } = await db
    .from('horarios_atendimento')
    .select('*')
    .eq('dia_semana', diaSemana)
    .eq('ativo', true)

  if (!horarios || horarios.length === 0) {
    return NextResponse.json([])
  }

  const { data: bloqueios } = await db
    .from('bloqueios_agenda')
    .select('*')
    .lte('data_inicio', `${data}T23:59:59`)
    .gte('data_fim', `${data}T00:00:00`)

  const { data: agendamentosExistentes } = await db
    .from('agendamentos')
    .select('data_inicio, data_fim')
    .gte('data_inicio', `${data}T00:00:00`)
    .lte('data_inicio', `${data}T23:59:59`)
    .not('status', 'in', '("CANCELADO","CONCLUIDO","NAO_COMPARECEU")')

  const slots: { hora: string; disponivel: boolean }[] = []
  const duracao = servico.duracao_minutos
  const agora = new Date()

  for (const horario of horarios) {
    const [hI, mI] = horario.hora_inicio.split(':').map(Number)
    const [hF, mF] = horario.hora_fim.split(':').map(Number)

    let slotInicio = new Date(dataObj)
    slotInicio.setHours(hI, mI, 0, 0)
    const fimExpediente = new Date(dataObj)
    fimExpediente.setHours(hF, mF, 0, 0)

    while (true) {
      const slotFim = addMinutes(slotInicio, duracao)
      if (isAfter(slotFim, fimExpediente)) break

      const horaFormatada = format(slotInicio, 'HH:mm')
      let disponivel = true

      if (isBefore(slotInicio, agora)) {
        disponivel = false
      }

      if (disponivel && bloqueios) {
        for (const b of bloqueios) {
          const bInicio = parseISO(b.data_inicio)
          const bFim = parseISO(b.data_fim)
          if (isBefore(slotInicio, bFim) && isAfter(slotFim, bInicio)) {
            disponivel = false
            break
          }
        }
      }

      if (disponivel && agendamentosExistentes) {
        for (const ag of agendamentosExistentes) {
          const agInicio = parseISO(ag.data_inicio)
          const agFim = parseISO(ag.data_fim)
          if (isBefore(slotInicio, agFim) && isAfter(slotFim, agInicio)) {
            disponivel = false
            break
          }
        }
      }

      slots.push({ hora: horaFormatada, disponivel })
      slotInicio = addMinutes(slotInicio, duracao)
    }
  }

  return NextResponse.json(slots)
}
