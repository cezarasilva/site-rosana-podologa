import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { exchangeCodeForTokens, createOAuth2Client } from '@/lib/google/auth'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/admin/configuracoes?google=erro`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${appUrl}/admin/login`)

  const tokens = await exchangeCodeForTokens(code)

  const oauth2Client = createOAuth2Client()
  oauth2Client.setCredentials(tokens)
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
  const { data: googleUser } = await oauth2.userinfo.get()

  const db = createServiceClient()

  const { data: usuario } = await db
    .from('usuarios')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  await db.from('google_integracoes').upsert(
    {
      usuario_id: usuario?.id,
      google_email: googleUser.email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expira_em: tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null,
      ativo: true,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: 'usuario_id' }
  )

  return NextResponse.redirect(`${appUrl}/admin/configuracoes?google=conectado`)
}
