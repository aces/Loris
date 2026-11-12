import {useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {useTranslation} from 'react-i18next';
import lorisFetch from 'jslib/lorisFetch';
import Modal, {FormModal} from './Modal';
import MFAPrompt from './MFAPrompt';
import {TextboxElement, PasswordElement} from './Form';

declare const loris: {BaseURL: string};

declare global {
  interface Window {
    LoginDialog?: {show: () => void},
  }
}

type LoginDialogProps = {
  onClose: () => void,
};

/**
 * Dialog that logs the user back in after their session has expired, so the
 * page they are on is not lost. Users with a second factor enter their code
 * in the same dialog.
 *
 * @param {LoginDialogProps} props - Properties for the dialog
 * @returns {JSX.Element} - A modal with a login form
 */
function LoginDialog({onClose}: LoginDialogProps) {
  const {t} = useTranslation('loris');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [needsCode, setNeedsCode] = useState(false);
  const codeRequired = useRef(false);
  const failed = t('Login failed.', {ns: 'loris'});

  /**
   * Post the credentials to the login endpoint. A rejection keeps the dialog
   * open.
   */
  const submit = async () => {
    setError(null);
    let response: Response;
    try {
      response = await lorisFetch(
        `${loris.BaseURL}/login/Authentication`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            login: 'true',
            command: 'login',
            username,
            password,
          }),
        }
      );
    } catch {
      setError(failed);
      throw new Error('login failed');
    }
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.error === 'password expired'
        ? t('Password expired for user.', {ns: 'loris'})
        : data?.error ?? failed);
      throw new Error('login failed');
    }
    codeRequired.current = data?.mfa === true;
  };

  /**
   * Post the code from the authenticator app. The prompt resets itself
   * when onError is called.
   *
   * @param {string} code - The six digit code
   * @param {function} onError - Called with the message to show
   */
  const validate = (code: string, onError: (msg: string) => void) => {
    lorisFetch(`${loris.BaseURL}/login/mfa`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({code}),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          onClose();
        } else {
          onError(data.error ?? failed);
        }
      })
      .catch(() => onError(failed));
  };

  if (needsCode) {
    return (
      <Modal
        show={true}
        onClose={() => window.location.reload()}
        title={t('Multifactor authentication required', {ns: 'loris'})}
        width='420px'
      >
        <p>
          {t(
            'Enter the code from your authenticator app below to proceed.',
            {ns: 'loris'}
          )}
        </p>
        <MFAPrompt validate={validate} />
      </Modal>
    );
  }

  return (
    <FormModal
      show={true}
      onClose={() => codeRequired.current ? setNeedsCode(true) : onClose()}
      onSubmit={submit}
      submitDisabled={!username || !password}
      submitLabel={t('Login', {ns: 'loris'})}
      title={t('Your session has expired', {ns: 'loris'})}
      width='420px'
    >
      <p>{t('Log in again to continue where you left off.', {ns: 'loris'})}</p>
      {error && <p className='text-danger'>{error}</p>}
      <TextboxElement
        name='username'
        label={t('Username', {ns: 'loris'})}
        value={username}
        autoComplete='username'
        onUserInput={(_name: string, value: string) => setUsername(value)}
      />
      <PasswordElement
        name='password'
        label={t('Password', {ns: 'loris'})}
        value={password}
        autoComplete='current-password'
        onUserInput={(_name: string, value: string) => setPassword(value)}
      />
    </FormModal>
  );
}

let isOpen = false;

/**
 * Show the login dialog, unless it is already open. Nothing is added to the
 * page until this is called.
 */
function show() {
  if (isOpen) {
    return;
  }
  isOpen = true;
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  root.render(
    <LoginDialog
      onClose={() => {
        root.unmount();
        host.remove();
        isOpen = false;
      }}
    />
  );
}

window.LoginDialog = {show};
