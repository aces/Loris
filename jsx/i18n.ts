import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      'Clear filters': 'Réinitialiser les filtres',
      'Patient name': 'Nom du patient',
      'Project': 'Projet',
      'Cohort': 'Cohorte',
      'Site': 'Site',
      'Tim run': 'Date d\'insertion',
      'Image file': 'Fichier de l\'image',
      'Series description or scan type': 'Description de la série ou type du scan',
      'Type of problem': 'Type de problème',
      'Resolution status': 'Statut de résolution',
      'Series UID': 'UID de la série',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') ?? 'en',
    interpolation: {
    escapeValue: false
    },
  });

export default i18n;
