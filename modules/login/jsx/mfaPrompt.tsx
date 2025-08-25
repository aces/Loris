import {createRoot} from 'react-dom/client';
import MFAPrompt from 'jsx/MFAPrompt';

type errorCallback = (msg: string) => void;
/**
 * Prompt for an MFA code to login.
 */
function LoginMFAPrompt() {
  return (<div>
    <h2>Multifactor authentication required</h2>
    <p>Enter the code from your authenticator app below to proceed.</p>
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
  createRoot(
    document.getElementsByClassName('main-content')[0]
  ).render(
    <LoginMFAPrompt />
  );
});
