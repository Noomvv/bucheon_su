// app/api/volunteers/top/route.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  try {
    const { data: volunteers, error } = await supabase
      .from('volunteers')
      .select('id, student_id, faculty, firstname, lastname, total_hours')
      .order('total_hours', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Supabase error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.log('Volunteers found:', volunteers.length)

    // Форматируем данные для отображения
    const formattedVolunteers = volunteers.map(volunteer => ({
      id: volunteer.id,
      total_hours: volunteer.total_hours || 0,
      faculty: volunteer.faculty || 'Не указан',
      lastname: volunteer.lastname || '',
      firstname: volunteer.firstname || `Студент ${volunteer.student_id}`
    }))

    return Response.json(formattedVolunteers)

  } catch (error) {
    console.error('Server error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}