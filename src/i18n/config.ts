import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './translations/en';
import ar from './translations/ar';
import fr from './translations/fr';

const resources = {
  en,
  ar,
  fr
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