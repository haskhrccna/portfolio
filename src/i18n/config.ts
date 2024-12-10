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
      "contact": {
        "title": "Get in Touch",
        "getInTouch": "Contact Me",
        "description": "Kindly if you have any inquiries or technical clarification I can help you with, don't hesitate to contact me",
        "adminLogin": "Admin Login",
        "name": "Name",
        "email": "Email",
        "message": "Message",
        "send": "Send Message",
        "success": "Message Sent",
        "successMessage": "Thank you for your message. I will get back to you soon.",
        "error": "Error",
        "errorMessage": "There was an error sending your message. Please try again.",
        "sending": "Sending...",
        "sendMessage": "Send Message",
        "companyName": "Company Name",
        "subject": "Subject",
        "requestCV": "Request CV"
      },
      "projects": {
        "title": "Projects Photo Library",
        "viewAll": "View All Projects"
      },
      "certifications": {
        "title": "Professional Certifications",
        "viewCertificate": "View Certificate"
      },
      "navigation": {
        "home": "Home",
        "about": "About",
        "skills": "Skills",
        "projects": "Projects",
        "contact": "Contact"
      },
      "bio": "Specialized in high-voltage power systems with extensive experience in managing and supervising infrastructure projects across the Middle East.",
      "getInTouch": "Get in Touch",
      "jobTitle": "Principal Resident Engineer - Electrical",
      "name": "Hassan Hassan Khairalla Adam",
      "hero": {
        "status": "Status: Hired"
      }
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
      "contact": {
        "title": "تواصل معي",
        "getInTouch": "اتصل بي",
        "description": "إذا كان لديك أي استفسارات أو توضيحات تقنية يمكنني المساعدة بها، فلا تتردد في الاتصال بي",
        "adminLogin": "تسجيل دخول المشرف",
        "name": "الاسم",
        "email": "البريد الإلكتروني",
        "message": "الرسالة",
        "send": "إرسال الرسالة",
        "success": "تم إرسال الرسالة",
        "successMessage": "شكراً لرسالتك. سأرد عليك قريباً.",
        "error": "خطأ",
        "errorMessage": "حدث خطأ في إرسال رسالتك. يرجى المحاولة مرة أخرى.",
        "sending": "جاري الإرسال...",
        "sendMessage": "إرسال الرسالة",
        "companyName": "اسم الشركة",
        "subject": "الموضوع",
        "requestCV": "طلب السيرة الذاتية"
      },
      "projects": {
        "title": "معرض صور المشاريع",
        "viewAll": "عرض جميع المشاريع"
      },
      "certifications": {
        "title": "الشهادات المهنية",
        "viewCertificate": "عرض الشهادة"
      },
      "navigation": {
        "home": "الرئيسية",
        "about": "عني",
        "skills": "المهارات",
        "projects": "المشاريع",
        "contact": "اتصل بي"
      },
      "bio": "متخصص في أنظمة الطاقة عالية الجهد مع خبرة واسعة في إدارة والإشراف على مشاريع البنية التحتية في الشرق الأوسط",
      "getInTouch": "تواصل معي",
      "jobTitle": "مهندس مقيم رئيسي - كهرباء",
      "name": "حسن حسن خير الله آدم",
      "hero": {
        "status": "الحالة: تم التوظيف"
      }
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
      "contact": {
        "title": "Contact",
        "getInTouch": "Me Contacter",
        "description": "Si vous avez des questions ou des clarifications techniques dont je peux vous aider, n'hésitez pas à me contacter",
        "adminLogin": "Connexion Admin",
        "name": "Nom",
        "email": "Email",
        "message": "Message",
        "send": "Envoyer",
        "success": "Message Envoyé",
        "successMessage": "Merci pour votre message. Je vous répondrai bientôt.",
        "error": "Erreur",
        "errorMessage": "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer.",
        "sending": "Envoi en cours...",
        "sendMessage": "Envoyer le message",
        "companyName": "Nom de l'entreprise",
        "subject": "Sujet",
        "requestCV": "Demander CV"
      },
      "projects": {
        "title": "Galerie de Photos des Projets",
        "viewAll": "Voir Tous les Projets"
      },
      "certifications": {
        "title": "Certifications Professionnelles",
        "viewCertificate": "Voir le Certificat"
      },
      "navigation": {
        "home": "Accueil",
        "about": "À Propos",
        "skills": "Compétences",
        "projects": "Projets",
        "contact": "Contact"
      },
      "bio": "Spécialisé dans les systèmes électriques haute tension avec une vaste expérience dans la gestion et la supervision de projets d'infrastructure au Moyen-Orient",
      "getInTouch": "Me Contacter",
      "jobTitle": "Ingénieur Résident Principal - Électricité",
      "name": "Hassan Hassan Khairalla Adam",
      "hero": {
        "status": "Statut: Embauché"
      }
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
