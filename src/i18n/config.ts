import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "about": "About Me",
      "skills": "Skills",
      "contact": "Get in Touch",
      "bio": "I'm a passionate developer with 5 years of experience in creating beautiful and functional web applications.",
      "skillsTitle": "Skills",
    }
  },
  ar: {
    translation: {
      "about": "عني",
      "skills": "المهارات",
      "contact": "تواصل معي",
      "bio": "أنا مطور شغوف بخبرة 5 سنوات في إنشاء تطبيقات ويب جميلة وعملية.",
      "skillsTitle": "المهارات",
    }
  },
  fr: {
    translation: {
      "about": "À Propos",
      "skills": "Compétences",
      "contact": "Contact",
      "bio": "Je suis un développeur passionné avec 5 ans d'expérience dans la création d'applications web belles et fonctionnelles.",
      "skillsTitle": "Compétences",
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