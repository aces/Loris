import {createRoot} from 'react-dom/client';
import MFAPrompt from 'jsx/MFAPrompt';
import i18n from 'I18nSetup';
import {useTranslation} from 'react-i18next';
import jaStrings from '../locale/ja/LC_MESSAGES/login.json';
import frStrings from '../locale/fr/LC_MESSAGES/login.json';

type errorCallback = (msg: string) => void;
/**
 * Prompt for an MFA code to login.
 */
function LoginMFAPrompt() {
  const {t} = useTranslation();
  return (<div>
    <h2>{t('Multifactor authentication required', {ns: 'login'})}</h2>
    <p>{t(
      'Enter the code from your authenticator app below to proceed.',
      {ns: 'login'}
    )}</p>
    <MFAPrompt validate={(code: string, onError: errorCallback) => {
      fetch('/login/mfa',
        {
          method: 'POST',
          body: JSON.stringify({'code': code}),
          credentials: 'same-origin',
        }).then((resp) => {
        if (!resp.ok) {
          console.warn('invalid response');
        }
        return resp.json();
      }).then( (json) => {
        if (json['success']) {
          window.location.reload();
        } else if (json['error']) {
          onError(json['error']);
        }
      }).catch( () => {
        onError('Error validating code');
        console.error('error validating code');
      });
    }} />
  </div>);
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'login', jaStrings);
  i18n.addResourceBundle('fr', 'login', frStrings);
  createRoot(
    document.getElementsByClassName('main-content')[0]
  ).render(
    <LoginMFAPrompt />
  );
});
