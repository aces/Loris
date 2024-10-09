import {Language, useLanguage} from 'i18n';

declare const loris: any;

/**
 * The language menu component, which displays the list of languages supported
 * by this LORIS instance.
 *
 * @returns The React element
 */
function LanguageMenu() {
  const [currentLanguageCode, setCurrentLanguageCode] = useLanguage();

  return (
    <div>
      {loris.supportedLanguages.map((language: Language) => (
        <button
          key={language.code}
          className={language.code === currentLanguageCode ? 'selected' : ''}
          onClick={() => setCurrentLanguageCode(language.code)}
        >
          {language.name}
        </button>
      ))}
    </div>
  );
}

(window as any).LanguageMenu = LanguageMenu;
