import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/landingpage/en.json';
import arTranslations from './locales/landingpage/ar.json';

const savedLang = localStorage.getItem('appLang') || 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { landing: enTranslations },
      ar: { landing: arTranslations }
    },
    lng: savedLang, // Use saved language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

// Setup document direction based on language
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = i18n.dir();
  localStorage.setItem('appLang', lng);
});
document.documentElement.dir = i18n.dir();

export default i18n;
