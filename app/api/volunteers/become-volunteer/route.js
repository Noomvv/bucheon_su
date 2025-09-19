// app/api/volunteers/become-volunteer/route.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 })
    }

    console.log('Creating volunteer for auth user:', userId)

    // 1. Находим студента по auth_user_id
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('student_id, faculty, firstname, lastname')
      .eq('auth_user_id', userId)
      .single()

    if (studentError || !student) {
      console.error('Student not found for auth user:', userId)
      return Response.json({ error: 'Студент не найден' }, { status: 404 })
    }

    console.log('Found student:', student.student_id)

    // 2. Проверяем, есть ли уже волонтер с таким student_id
    const { data: existingVolunteer } = await supabase
      .from('volunteers')
      .select('*')
      .eq('student_id', student.student_id)
      .single()

    if (existingVolunteer) {
      return Response.json({ 
        success: true, 
        message: 'Вы уже являетесь волонтером' 
      })
    }

    // 3. Создаем нового волонтера с числовым student_id
    const { data, error } = await supabase
      .from('volunteers')
      .insert({
        student_id: student.student_id, // Используем числовой student_id
        faculty: student.faculty || 'Не указан',
        firstname: student.firstname,
        lastname: student.lastname,
        total_hours: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return Response.json({ error: 'Ошибка базы данных: ' + error.message }, { status: 500 })
    }

    return Response.json({ 
      success: true, 
      message: 'Вы успешно стали волонтером!',
      data 
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return Response.json({ error: 'Server error: ' + error.message }, { status: 500 })
  }
}