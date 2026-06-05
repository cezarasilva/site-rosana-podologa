import { google } from 'googleapis'
import { createOAuth2Client } from './auth'
import { createServiceClient } from '@/lib/supabase/server'

async function getCalendarClient() {
  const supabase = createServiceClient()

  const { data: integracao } = await supabase
    .from('google_integracoes')
    .select('*')
    .eq('ativo', true)
    .single()

  if (!integracao) return null

  const oauth2Client = createOAuth2Client()
  oauth2Client.setCredentials({
    access_token: integracao.access_token,
    refresh_token: integracao.refresh_token,
    expiry_date: integracao.token_expira_em
      ? new Date(integracao.token_expira_em).getTime()
      : undefined,
  })

  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.refresh_token || tokens.access_token) {
      await supabase
        .from('google_integracoes')
        .update({
          access_token: tokens.access_token ?? integracao.access_token,
          refresh_token: tokens.refresh_token ?? integracao.refresh_token,
          token_expira_em: tokens.expiry_date
            ? new Date(tokens.expiry_date).toISOString()
            : null,
        })
        .eq('id', integracao.id)
    }
  })

  return {
    calendar: google.calendar({ version: 'v3', auth: oauth2Client }),
    calendarId: integracao.calendar_id ?? 'primary',
  }
}

export async function createCalendarEvent(params: {
  titulo: string
  descricao: string
  inicio: string
  fim: string
  nomeCliente: string
  telefoneCliente: string
}) {
  const client = await getCalendarClient()
  if (!client) return null

  const { calendar, calendarId } = client

  const { data } = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: `${params.titulo} - ${params.nomeCliente}`,
      description: `Cliente: ${params.nomeCliente}\nTelefone: ${params.telefoneCliente}\n\n${params.descricao}`,
      start: { dateTime: params.inicio, timeZone: 'America/Sao_Paulo' },
      end: { dateTime: params.fim, timeZone: 'America/Sao_Paulo' },
    },
  })

  return data.id ?? null
}

export async function updateCalendarEvent(
  eventId: string,
  params: { inicio: string; fim: string; descricao?: string }
) {
  const client = await getCalendarClient()
  if (!client) return

  const { calendar, calendarId } = client

  await calendar.events.patch({
    calendarId,
    eventId,
    requestBody: {
      start: { dateTime: params.inicio, timeZone: 'America/Sao_Paulo' },
      end: { dateTime: params.fim, timeZone: 'America/Sao_Paulo' },
      ...(params.descricao && { description: params.descricao }),
    },
  })
}

export async function deleteCalendarEvent(eventId: string) {
  const client = await getCalendarClient()
  if (!client) return

  const { calendar, calendarId } = client

  await calendar.events.delete({ calendarId, eventId })
}

export async function getBusySlots(inicio: string, fim: string) {
  const client = await getCalendarClient()
  if (!client) return []

  const { calendar, calendarId } = client

  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin: inicio,
      timeMax: fim,
      items: [{ id: calendarId }],
    },
  })

  return data.calendars?.[calendarId]?.busy ?? []
}
