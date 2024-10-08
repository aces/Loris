import i18n from 'i18next';
import {useCallback} from 'react';
import {initReactI18next, useTranslation} from 'react-i18next';

export const supportedLanguages = [
  {code: 'en', name: 'English'},
  {code: 'fr', name: 'Français'},
];

/**
 * Check if a given language code is among the supported langauges of this
 * LORIS instance.
 *
 * @returns The boolean
 */
function isSupportedLanguage(languageCode: string) {
  return supportedLanguages.some((language) => languageCode === language.code);
}

/**
 * Get the language to use for an anonymous user, which is either the language
 * saved in the local storage, or the language of the user web browser if it is
 * supported by this LORIS instance, or the default language otherwise.
 *
 * @returns The anonymous user language
 */
function getAnonymousUserLanguage() {
  let languageCode = localStorage.getItem('lang');
  if (languageCode !== null) {
    return languageCode;
  }

  languageCode = navigator.language.split('-')[0];
  if (isSupportedLanguage(languageCode)) {
    console.warn(
      `Language '${languageCode}' is not supported by this LORIS instance.`
    );

    languageCode = 'en';
  }

  localStorage.setItem('lang', languageCode);
  return languageCode;
}

/**
 * A React hook to access the application language.
 *
 * @returns The application language and its setter
 */
export function useLanguage() {
  const {i18n} = useTranslation();

  const setLanguageCode = useCallback((languageCode: string) => {
    localStorage.setItem('lang', languageCode);
    i18n.changeLanguage(languageCode);
  }, []);

  return [i18n.language, setLanguageCode] as const;
}

const resources = {
  fr: {
    translation: {
      'Clear filters': 'Réinitialiser les filtres',
      'Patient name': 'Nom du patient',
      'Project': 'Projet',
      'Cohort': 'Cohorte',
      'Site': 'Site',
      'Time run': 'Date d\'insertion',
      'Image file': 'Fichier de l\'image',
      'Series description or scan type':
        'Description de la série ou type du scan',
      'Type of problem': 'Type de problème',
      'Resolution status': 'Statut de résolution',
      'Series UID': 'UID de la série',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getAnonymousUserLanguage(),
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
