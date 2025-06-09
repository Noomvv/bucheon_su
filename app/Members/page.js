'use client'
import MemberCard from '../components/MemberCard'

const students = [
  {
    id: 1,
    firstName: "Владимир",
    lastName: "Мун",
    faculty: "IT",
    year: 3,
    telegram: "v_v_moon",
    photoUrl: "/member-img/vladimir.webp"
  },
  {
    id: 2,
    firstName: "Софья",
    lastName: "Пыхтина",
    faculty: "Мультимедиа",
    year: 3,
    telegram: "chtototo10",
    photoUrl: "/member-img/sofa.webp"
  },
  
  // Добавьте остальных участников здесь
  // Формат:
  // {
  //   id: 4,
  //   firstName: "Имя",
  //   lastName: "Фамилия",
  //   faculty: "Факультет",
  //   year: 1, // курс
  //   telegram: "ник в телеграме без @",
  //   photoUrl: "/путь/к/фото.jpg"
  // },
];

export default function Members() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-6">
        {students.map(student => (
          <MemberCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  )
}