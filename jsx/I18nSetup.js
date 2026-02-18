import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

import jaResources from '../locale/ja/LC_MESSAGES/loris.json';
import hiResources from '../locale/hi/LC_MESSAGES/loris.json';
import esResources from '../locale/es/LC_MESSAGES/loris.json';
import enResources from '../locale/en/LC_MESSAGES/loris.json';
import frResources from '../locale/fr/LC_MESSAGES/loris.json';
import zhResources from '../locale/zh/LC_MESSAGES/loris.json';

const resources = {
  ja: {
    loris: jaResources,
  },
  hi: {
    loris: hiResources,
  },
  es: {
    loris: esResources,
  },
  en: {
    loris: enResources,
  },
  fr: {
    loris: frResources,
  },
  zh: {
    loris: zhResources,
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
