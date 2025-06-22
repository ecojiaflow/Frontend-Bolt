// /src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { en } from './locales/en';
import { fr } from './locales/fr';

// 🔍 DEBUG: Vérifier le contenu des imports
console.log('🇫🇷 FR imported:', fr.common?.home); // Devrait afficher "Accueil"
console.log('🇺🇸 EN imported:', en.common?.home); // Devrait afficher "Home"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: fr  // FR = contenu français
      },
      en: {
        translation: en  // EN = contenu anglais
      }
    },
    fallbackLng: 'fr',
    lng: 'fr',
    debug: true,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  })
  .then(() => {
    // 🔍 DEBUG: Vérifier après initialisation
    console.log('🌍 i18n initialized with language:', i18n.language);
    console.log('🏠 Home text should be:', i18n.t('common.home'));
  });

export default i18n;