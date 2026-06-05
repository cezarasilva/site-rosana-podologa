import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ conectado: false })

  const db = createServiceClient()
  const { data } = await db
    .from('google_integracoes')
    .select('id, google_email')
    .eq('ativo', true)
    .single()

  return NextResponse.json({ conectado: !!data, email: data?.google_email ?? null })
}
