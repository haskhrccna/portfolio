import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "about": "About Me",
      "skills": "Skills",
      "contact": "Get in Touch",
      "bio": "Specialized in high-voltage power systems with extensive experience in managing and supervising infrastructure projects across the Middle East.",
      "skillsTitle": "Skills",
      "getInTouch": "Get in Touch",
      "jobTitle": "Principal Resident Engineer - Electrical",
      "name": "Hassan Hassan Khairalla Adam",
      "hero.status": "Status: Available"
    }
  },
  ar: {
    translation: {
      "about": "عني",
      "skills": "المهارات",
      "contact": "تواصل معي",
      "bio": "متخصص في أنظمة الطاقة عالية الجهد مع خبرة واسعة في إدارة والإشراف على مشاريع البنية التحتية في الشرق الأوسط",
      "skillsTitle": "المهارات",
      "getInTouch": "تواصل معي",
      "jobTitle": "مهندس مقيم رئيسي - كهرباء",
      "name": "حسن حسن خير الله آدم",
      "hero.status": "الحالة: متاح"
    }
  },
  fr: {
    translation: {
      "about": "À Propos",
      "skills": "Compétences",
      "contact": "Contact",
      "bio": "Spécialisé dans les systèmes électriques haute tension avec une vaste expérience dans la gestion et la supervision de projets d'infrastructure au Moyen-Orient",
      "skillsTitle": "Compétences",
      "getInTouch": "Me Contacter",
      "jobTitle": "Ingénieur Résident Principal - Électricité",
      "name": "Hassan Hassan Khairalla Adam",
      "hero.status": "Statut: Disponible"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;