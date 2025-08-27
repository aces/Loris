import {createRoot} from 'react-dom/client';
import {useState, useCallback} from 'react';
import swal from 'sweetalert2';
import QRCode from 'react-qr-code';
import * as base32 from 'hi-base32';
import Modal from 'Modal';
import MFAPrompt from 'jsx/MFAPrompt';

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
          swal.fire('Success!', json.message, 'success').then( () => {
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
      <h3>Validate Code</h3>
      <MFAPrompt validate={formSubmit} />
    </div>
  );
}
/**
 *
 */
function MFAIndex(): React.ReactElement {
  const [showModal, setShowModal] = useState<boolean>(false);
  const studyTitle = loris.config('studyTitle');
  const key = genPotentialSecret();
  const mfaUrl = 'otpauth://totp/'
    + encodeURI(studyTitle)
    + ':' + encodeURI(loris.user.username)
    + '?secret=' + encodeURI(key)
    + '&period=30&digits=6&issuer=' + encodeURI(studyTitle);
  return <div>
    <Modal
      title='Manual MFA Setup'
      onClose={() => setShowModal(false)}
      show={showModal}
      throwWarning={false}>
      <p>Use the following key in your authenticator app: <b>{key}</b></p>
    </Modal>
    <p>Scan the following QR code below in your MFA authenticator and
      enter the code to validate.</p>
    <p>
      <b>Note that this will <i>overwrite</i> any previously
      setup MFA in LORIS!</b>
    </p>
    <QRCode value={mfaUrl} />
    <p>Can't scan the QR code? <a href="#" onClick={() => setShowModal(true)}>
    Setup manually.</a>
    </p>
    <CodeValidator secret={key} />
  </div>;
}

window.addEventListener('load', () => {
  /*
  const MFAIndex = withTranslation(
    ['my_preferences', 'loris']
  )(MFAIndex);
 */
  const element = document.getElementById('lorisworkspace');
  if (!element) {
    throw new Error('Missing lorisworkspace');
  }
  createRoot(element).render(
    <MFAIndex />
  );
});
