'use client'
import MemberCard from '../components/MemberCard'
import styles from './page.module.css'

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
    {
        id: 3,
        firstName: "Руслан",
        lastName: "Кустиков",
        faculty: "Менеджмент",
        year: 2,
        telegram: "zuz_zyy",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 4,
        firstName: "Елена",
        lastName: "Мирзаахмедова",
        faculty: "Менеджмент",
        year: 2,
        telegram: "mrzxmz",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 5,
        firstName: "Маргарита",
        lastName: "Пак",
        faculty: "Менеджмент",
        year: 3,
        telegram: "mpak05",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 6,
        firstName: "Карина",
        lastName: "Тё",
        faculty: "Менеджмент",
        year: 3,
        telegram: "kte_90",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 7,
        firstName: "Зарина",
        lastName: "Алимова",
        faculty: "Архитектура",
        year: 2,
        telegram: "Corazavr",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 8,
        firstName: "Виктор",
        lastName: "Шек",
        faculty: "Архитектура",
        year: 3,
        telegram: "blagodarstvuyu",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 9,
        firstName: "Анастасия",
        lastName: "Ким",
        faculty: "Менеджмент",
        year: 3,
        telegram: "Kimi_Kimiku",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 10,
        firstName: "Игорь",
        lastName: "Бя",
        faculty: "E-business",
        year: 3,
        telegram: "sb_03i",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 11,
        firstName: "Денис",
        lastName: "Ким",
        faculty: "E-business",
        year: 3,
        telegram: "Mynightmaresss",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 12,
        firstName: "Абдурахмон",
        lastName: "Икромов",
        faculty: "Мультимедиа",
        year: 2,
        telegram: "smackfake",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 13,
        firstName: "Тимур",
        lastName: "Ким",
        faculty: "Дошкольное образование",
        year: 2,
        telegram: "Apolonirr",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 14,
        firstName: "Павел",
        lastName: "Хван",
        faculty: "Менеджмент",
        year: 2,
        telegram: "kr1d0",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 15,
        firstName: "Денис",
        lastName: "Когай",
        faculty: "E-business",
        year: 3,
        telegram: "Mynightmaresss",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 16,
        firstName: "Александра",
        lastName: "Пугачёва",
        faculty: "Мультимедиа",
        year: 2,
        telegram: "alexa0313",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 17,
        firstName: "Виктория",
        lastName: "Сон",
        faculty: "Мультимедиа",
        year: 2,
        telegram: "sv07_15",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 18,
        firstName: "Карина ",
        lastName: "Сагидулина",
        faculty: "Мультимедиа",
        year: 2,
        telegram: "kte_90",
        photoUrl: "/member-img/default.jpeg"
    },
    
    
  // Добавьте остальных участников здесь
];

export default function Members() {
  return (
    <div className={styles.container}>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-6">
            {students.map(student => (
                <MemberCard key={student.id} student={student} />
            ))}
            </div>
        </div>


        <div className={styles.promoWrapper}>
                <img
                src="/images/promo.png" // Указан правильный путь к изображению
                alt="Человек думает"
                className={styles.promoImageOverlap}/>
                <div className={styles.promoBlock}>
                    <div className={styles.promoText}>Хотите что-то обсудить? Просто напишите нам лично — Telegram у каждого указан.</div>
                </div>
            </div>
    </div>
  )
}