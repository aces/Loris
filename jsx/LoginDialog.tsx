import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {useTranslation} from 'react-i18next';
import lorisFetch from 'jslib/lorisFetch';
import {FormModal} from './Modal';
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
 * page they are on is not lost.
 *
 * @param {LoginDialogProps} props - Properties for the dialog
 * @returns {JSX.Element} - A modal with a login form
 */
function LoginDialog({onClose}: LoginDialogProps) {
  const {t} = useTranslation('loris');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  /**
   * Post the credentials to the login endpoint. A rejection keeps the dialog
   * open.
   */
  const submit = async () => {
    setError(null);
    const response = await lorisFetch(
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
    if (!response.ok) {
      const data = await response.json();
      setError(data.error === 'password expired'
        ? t('Password expired for user.', {ns: 'loris'})
        : data.error ?? t('Login failed.', {ns: 'loris'}));
      throw new Error('login failed');
    }
  };

  return (
    <FormModal
      show={true}
      onClose={onClose}
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

let container: HTMLElement | null = null;

/**
 * Show the login dialog, unless it is already open. Nothing is added to the
 * page until this is called.
 */
function show() {
  if (container) {
    return;
  }
  const host = document.createElement('div');
  document.body.appendChild(host);
  container = host;
  const root = createRoot(host);
  root.render(
    <LoginDialog
      onClose={() => {
        root.unmount();
        host.remove();
        container = null;
      }}
    />
  );
}

window.LoginDialog = {show};

export {LoginDialog, show};
