import { NextResponse } from 'next/server'
import { supabase }     from '../../../lib/supabaseClient'

export async function POST(request) {
  const { studentId, login, password } = await request.json()

  // 1) Проверка student_id
  const { data: stud, error: e1 } = await supabase
    .from('students')
    .select('auth_user_id')
    .eq('student_id', studentId)
    .single()
  if (e1 || !stud)              return NextResponse.json({ error: 'Студент не найден' }, { status:400 })
  if (stud.auth_user_id)        return NextResponse.json({ error: 'Уже зарегистрирован' }, { status:400 })

  // 2) Создаём пользователя (login кладём в email)
  const { data: sd, error: e2 } = await supabase.auth.signUp({
    email: login,
    password
  })
  if (e2) return NextResponse.json({ error: e2.message }, { status:400 })

  // 3) Привязываем к students
  const { error: e3 } = await supabase
    .from('students')
    .update({
      auth_user_id: sd.user.id,
      email: login
    })
    .eq('student_id', studentId)
  if (e3) return NextResponse.json({ error: e3.message }, { status:500 })

  // 4) Сразу логиним
  await supabase.auth.signInWithPassword({ email: login, password })
  return NextResponse.json({ success:true }, { status:200 })
}
