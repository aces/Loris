import {createRoot} from 'react-dom/client';
import {useState, useCallback} from 'react';
import swal from 'sweetalert2';
import QRCode from 'react-qr-code';
import * as base32 from 'hi-base32';
import Modal from 'Modal';
import MFAPrompt from 'jsx/MFAPrompt';
import {useTranslation, Trans} from 'react-i18next';
import i18n from 'I18nSetup';
import jaStrings from '../locale/ja/LC_MESSAGES/my_preferences.json';
import hiStrings from '../locale/hi/LC_MESSAGES/my_preferences.json';
import frStrings from '../locale/fr/LC_MESSAGES/my_preferences.json';

declare const loris: any;

/**
 * Get a secret that could be used as a secret
 */
function genPotentialSecret() {
  const array = new Uint8Array(20);
  crypto.getRandomValues(array);

  return base32.encode(array);
}

/**
 * React props
 *
 * @param props - react props
 * @param props.secret - the shared secret key
 */
function CodeValidator(props: {
  secret: string
}): React.ReactElement {
  const {t} = useTranslation();
  const formSubmit = useCallback(
    (code: string, onError: (msg: string) => void) => {
      const formObject = new FormData();
      formObject.append('code', code);
      formObject.append('secret', props.secret);
      fetch(loris.BaseURL + '/my_preferences/mfa', {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        body: formObject,
      }).then( (resp) => {
        if (resp.status !== 400 && !resp.ok) {
          throw new Error('Bad server response');
        }
        return resp.json();
      }).then( (json) => {
        if (json.ok == 'success') {
          swal.fire({
            title: t('Success!', {ns: 'loris'}),
            text: json.message,
            type: 'success',
            confirmButtonText: t('OK', {ns: 'loris'}),
          }).then( () => {
            window.location.href = loris.BaseURL + '/my_preferences/';
          });
        } else if (json.error) {
          onError(json.error);
        } else {
          throw new Error('Unexpected JSON response');
        }
      }).catch( (e: Error) => {
        onError(e.message);
      });
    }, [props.secret]);
  return (
    <div>
      <h3>{t('Validate Code', {ns: 'my_preferences'})}</h3>
      <MFAPrompt validate={formSubmit} />
    </div>
  );
}
/**
 *
 */
function MFAIndex(): React.ReactElement {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [key] = useState<string>(genPotentialSecret());
  const {t} = useTranslation();
  const studyTitle = loris.config('studyTitle');
  const mfaUrl = 'otpauth://totp/'
    + encodeURI(studyTitle)
    + ':' + encodeURI(loris.user.username)
    + '?secret=' + encodeURI(key)
    + '&period=30&digits=6&issuer=' + encodeURI(studyTitle);
  return <div>
    <Modal
      title={t('Manual MFA Setup', {ns: 'my_preferences'})}
      onClose={() => setShowModal(false)}
      show={showModal}
      throwWarning={false}>
      <p><Trans
        defaults={'Use the following key in your authenticator app: '
          + '<0>{{code}}</0>'}
        ns="my_preferences"
        components={[<strong>CODE</strong>]}
        values={{code: key}} /></p>
    </Modal>
    <p>{t('Scan the following QR code below in your MFA authenticator and '
          + 'enter the code to validate.', {ns: 'my_preferences'})}</p>
    <p>
      <strong><Trans
        ns="my_preferences"
        components={[<strong>overwrite</strong>]}
        defaults={'Note that this will <0>overwrite</0> any '
          + 'previously setup MFA in LORIS!'} /></strong>
    </p>
    <QRCode value={mfaUrl} />
    <p><Trans
      ns="my_preferences"
      defaults="Can't scan the QR code? <0>Setup manually.</0>"
      components={[<a href="#" onClick={() => setShowModal(true)} />]} /></p>
    <CodeValidator secret={key} />
  </div>;
}

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'my_preferences', jaStrings);
  i18n.addResourceBundle('hi', 'my_preferences', hiStrings);
  i18n.addResourceBundle('fr', 'my_preferences', frStrings);

  const element = document.getElementById('lorisworkspace');
  if (!element) {
    throw new Error('Missing lorisworkspace');
  }
  createRoot(element).render(
    <MFAIndex />
  );
});
