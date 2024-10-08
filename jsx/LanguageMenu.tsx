import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import 'i18n';

const supportedLanguageCodes = ['en', 'fr'];

function filterSupportedLanguageCode(languageCode: string) {
  if (supportedLanguageCodes.includes(languageCode)) {
      return languageCode;
  }

  console.log(`Language '${languageCode}' is not supported by LORIS.`);
  return 'en';
}

function getLanguageCodeFromBrowser() {
  const languageCode = localStorage.getItem('lang');
  if (languageCode !== null) {
      return languageCode;
  }

  return navigator.language.split('-')[0];
}

interface Language {
  code: string;
  name: string;
}

interface LanguageProps {
  language: Language;
  appLanguageCode: string;
  setAppLanguageCode: (languageCode: string) => void
}

function Language(props: LanguageProps) {
  return (
    <button
        className={props.appLanguageCode === props.language.code ? 'selected' : ''}
        onClick={() => props.setAppLanguageCode(props.language.code)}
    >
      {props.language.name}
    </button>
  );
}

const languages = [
  {code: 'en', name: 'English'},
  {code: 'fr', name: 'Français'},
];

function LanguageMenu() {
  const {i18n} = useTranslation();
  const [languageCode, setLanguageCode] = useState<string>('en');

  const setAppLanguageCode = (languageCode: string) => {
    languageCode = filterSupportedLanguageCode(languageCode);
    localStorage.setItem('lang', languageCode);
    i18n.changeLanguage(languageCode);
    setLanguageCode(languageCode);
  };

  useEffect(() => {
      setAppLanguageCode(getLanguageCodeFromBrowser());
  }, []);

  return (
    <div>
      {languages.map((language) => (
        <Language key={language.code} language={language} appLanguageCode={languageCode} setAppLanguageCode={setAppLanguageCode} />
      ))}
    </div>
  );
}

(window as any).LanguageMenu = LanguageMenu;
