import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

const resources = {
  ja: {
    loris: require('../locale/ja/LC_MESSAGES/loris.json'),
  },
  hi: {
    loris: require('../locale/hi/LC_MESSAGES/loris.json'),
  },
  es: {
    loris: require('../es/LC_MESSAGES/loris.json'),
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    // debug: true,
    partialBundledLanguages: true,
    lng: loris.user.langpref ?? 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // Modules add to this with addResourceBundle
    ns: ['loris'],
    defaultNS: 'loris',
    fallbackNS: [],
  });
export default i18n;
