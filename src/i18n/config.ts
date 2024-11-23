import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "about": "About Me",
      "skills": {
        "title": "Professional Skills",
        "items": {
          "projectManagement": "Project Management",
          "constructionSupervision": "Construction Supervision",
          "powerTransmission": "Power Transmission",
          "infrastructureDesign": "Infrastructure Design",
          "tenderManagement": "Tender Management"
        },
        "itSkills": {
          "title": "IT Skills",
          "microsoftOffice": "Microsoft Office Suite",
          "pythonProgramming": "Python Programming",
          "networking": "Computer Networking",
          "linux": "Linux Systems"
        }
      },
      "contact": "Get in Touch",
      "bio": "Specialized in high-voltage power systems with extensive experience in managing and supervising infrastructure projects across the Middle East.",
      "getInTouch": "Get in Touch",
      "jobTitle": "Principal Resident Engineer - Electrical",
      "name": "Hassan Hassan Khairalla Adam",
      "hero.status": "Status: Available"
    }
  },
  ar: {
    translation: {
      "about": "عني",
      "skills": {
        "title": "المهارات المهنية",
        "items": {
          "projectManagement": "إدارة المشاريع",
          "constructionSupervision": "الإشراف على البناء",
          "powerTransmission": "نقل الطاقة",
          "infrastructureDesign": "تصميم البنية التحتية",
          "tenderManagement": "إدارة المناقصات"
        },
        "itSkills": {
          "title": "مهارات تقنية المعلومات",
          "microsoftOffice": "حزمة مايكروسوفت أوفيس",
          "pythonProgramming": "برمجة بايثون",
          "networking": "شبكات الحاسوب",
          "linux": "أنظمة لينكس"
        }
      },
      "contact": "تواصل معي",
      "bio": "متخصص في أنظمة الطاقة عالية الجهد مع خبرة واسعة في إدارة والإشراف على مشاريع البنية التحتية في الشرق الأوسط",
      "getInTouch": "تواصل معي",
      "jobTitle": "مهندس مقيم رئيسي - كهرباء",
      "name": "حسن حسن خير الله آدم",
      "hero.status": "الحالة: متاح"
    }
  },
  fr: {
    translation: {
      "about": "À Propos",
      "skills": {
        "title": "Compétences Professionnelles",
        "items": {
          "projectManagement": "Gestion de Projet",
          "constructionSupervision": "Supervision de Construction",
          "powerTransmission": "Transmission d'Énergie",
          "infrastructureDesign": "Conception d'Infrastructure",
          "tenderManagement": "Gestion des Appels d'Offres"
        },
        "itSkills": {
          "title": "Compétences Informatiques",
          "microsoftOffice": "Suite Microsoft Office",
          "pythonProgramming": "Programmation Python",
          "networking": "Réseaux Informatiques",
          "linux": "Systèmes Linux"
        }
      },
      "contact": "Contact",
      "bio": "Spécialisé dans les systèmes électriques haute tension avec une vaste expérience dans la gestion et la supervision de projets d'infrastructure au Moyen-Orient",
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