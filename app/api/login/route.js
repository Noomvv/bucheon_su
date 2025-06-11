// app/api/login/route.js
import { NextResponse } from 'next/server'
import { supabase }     from '../../../lib/supabaseClient'

export async function POST(request) {
  const { email, password } = await request.json()

  // 1) Считаем попытки за 10 минут
  const tenMinAgo = new Date(Date.now() - 10*60*1000).toISOString()
  const { count } = await supabase
    .from('login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .gte('attempted_at', tenMinAgo)

  if (count >= 5) {
    return NextResponse.json(
      { error: 'Слишком много попыток, попробуйте позже' },
      { status: 429 }
    )
  }

  // 2) Пишем попытку
  await supabase.from('login_attempts').insert({ email })

  // 3) Пытаемся войти
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
  }

  return NextResponse.json({ session: data.session, user: data.user }, { status: 200 })
}
