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
        firstName: "Андрей",
        lastName: "Ким",
        faculty: "Менеджмент",
        year: 4,
        telegram: "aldente_02",
        photoUrl: "/member-img/kim_andrey.webp"
    },
    {
        id: 4,
        firstName: "Евгений",
        lastName: "Ким",
        faculty: "Мультимедиа",
        year: 2,
        telegram: "tipo_yujin",
        photoUrl: "/member-img/yujin.webp"
    },
    {
        id: 5,
        firstName: "Малика",
        lastName: "Азимова",
        faculty: "Менеджмент",
        year: 4,
        telegram: "MalyJenner",
        photoUrl: "/member-img/malika.webp"
    },
    {
        id: 6,
        firstName: "Вераника",
        lastName: "Тен",
        faculty: "Мультимедиа",
        year: 2,
        telegram: "vrrrkuf",
        photoUrl: "/member-img/veranika.webp"
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
        firstName: "Маргарита",
        lastName: "Ким",
        faculty: "Дошкольное образование",
        year: 3,
        telegram: "marg_kim",
        photoUrl: "/member-img/margarita.webp"
    },
    {
        id: 9,
        firstName: "Никита",
        lastName: "Смирнов",
        faculty: "IT",
        year: 3,
        telegram: "sowiebdbdu",
        photoUrl: "/member-img/nikita.webp"
    },
    {
        id: 10,
        firstName: "Никита",
        lastName: "Хегай",
        faculty: "Менеджмент",
        year: 4,
        telegram: "Niki_Cat",
        photoUrl: "/member-img/h_nikita.webp"
    },
    {
        id: 11,
        firstName: "Станислав",
        lastName: "Ем",
        faculty: "IT",
        year: 2,
        telegram: "thefiam",
        photoUrl: "/member-img/stas.webp"
    },
    {
        id: 12,
        firstName: "Ирина",
        lastName: "Пан",
        faculty: "Мультимедиа",
        year: 2,
        telegram: "OtherHuman_for_you",
        photoUrl: "/member-img/irina.webp"
    },
    {
        id: 13,
        firstName: "Вячеслав",
        lastName: "Ли",
        faculty: "Мультимедиа",
        year: 2,
        telegram: "ssluvvik",
        photoUrl: "/member-img/vyacheslav.webp"
    },
    {
        id: 14,
        firstName: "Андрей",
        lastName: "Чурбанов",
        faculty: "Менеджмент",
        year: 4,
        telegram: "kkuro_0",
        photoUrl: "/member-img/andrey.webp"
    },
    {
        id: 15,
        firstName: "Ернур",
        lastName: "Сыздыков",
        faculty: "Менеджмент",
        year: 4,
        telegram: "Tax797",
        photoUrl: "/member-img/ernur.webp"
    },
    {
        id: 16,
        firstName: "Мелисса",
        lastName: "Пак",
        faculty: "Дошкольное образование",
        year: 4,
        telegram: "meli62_30",
        photoUrl: "/member-img/melisa.webp"
    },
    {
        id: 17,
        firstName: "Михаил",
        lastName: "Тян",
        faculty: "Менеджмент",
        year: 4,
        telegram: "mtlll13",
        photoUrl: "/member-img/default.jpeg"
    },
    {
        id: 18,
        firstName: "Вероника ",
        lastName: "Ли",
        faculty: "Менеджмент",
        year: 4,
        telegram: "kakoolya",
        photoUrl: "/member-img/veronika.webp"
    },
    {
        id: 19,
        firstName: "Камила",
        lastName: "Султанова",
        faculty: "Менеджмент",
        year: 4,
        telegram: "camaaa_s",
        photoUrl: "/member-img/kamila.webp"
    },
    {
        id: 20,
        firstName: "Евгений",
        lastName: "Ко",
        faculty: "Менеджмент",
        year: 4,
        telegram: "eugeneheat",
        photoUrl: "/member-img/evgeniy.webp"
    },
    {
        id: 21,
        firstName: "Амирбек",
        lastName: "Ашуров",
        faculty: "Менеджмент",
        year: 4,
        telegram: "avvorld",
        photoUrl: "/member-img/amir.webp"
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
                src="/images/promo5.png" // Указан правильный путь к изображению
                alt="Человек думает"
                className={styles.promoImageOverlap}/>
                <div className={styles.promoBlock}>
                    <div className={styles.promoText}>Хотите что-то обсудить? Просто напишите нам лично — Telegram у каждого указан.</div>
                </div>
            </div>
    </div>
  )
}