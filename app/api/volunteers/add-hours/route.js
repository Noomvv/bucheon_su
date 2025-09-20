// app/api/volunteers/add-hours/route.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { studentId, hours } = await request.json()

    // Находим волонтера
    const { data: volunteer, error: volunteerError } = await supabase
      .from('volunteers')
      .select('*')
      .eq('student_id', studentId)
      .single()

    if (volunteerError || !volunteer) {
      return Response.json({ error: 'Волонтер не найден' }, { status: 404 })
    }

    // Обновляем часы
    const { error: updateError } = await supabase
      .from('volunteers')
      .update({ 
        total_hours: volunteer.total_hours + hours,
        updated_at: new Date().toISOString()
      })
      .eq('id', volunteer.id)

    if (updateError) {
      return Response.json({ error: updateError.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}