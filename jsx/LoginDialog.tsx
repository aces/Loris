import {useState, FormEvent} from 'react';
import {createRoot} from 'react-dom/client';
import {useTranslation} from 'react-i18next';
import Modal from './Modal';

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
  const [submitting, setSubmitting] = useState(false);

  /**
   * Post the credentials to the login endpoint and close on success.
   *
   * @param {FormEvent} event - Form submission event
   */
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${loris.BaseURL}/login/Authentication`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          login: 'true',
          command: 'login',
          username,
          password,
        }),
      });
      if (response.ok) {
        onClose();
        return;
      }
      const data = await response.json();
      setError(data.error === 'password expired'
        ? t('Password expired for user.', {ns: 'loris'})
        : data.error ?? t('Login failed.', {ns: 'loris'}));
    } catch {
      setError(t('Login failed.', {ns: 'loris'}));
    }
    setSubmitting(false);
  };

  return (
    <Modal
      show={true}
      onClose={onClose}
      title={t('Your session has expired', {ns: 'loris'})}
      width='420px'
      footer={
        <button
          type='submit'
          form='session-expired-login'
          className='btn btn-primary'
          style={{marginLeft: 'auto'}}
          disabled={submitting || !username || !password}
        >
          {t('Login', {ns: 'loris'})}
        </button>
      }
    >
      <form id='session-expired-login' onSubmit={submit}>
        <p>
          {t('Log in again to continue where you left off.', {ns: 'loris'})}
        </p>
        {error && <p className='text-danger'>{error}</p>}
        <div className='form-group'>
          <input
            className='form-control'
            type='text'
            name='username'
            autoComplete='username'
            placeholder={t('Username', {ns: 'loris'})}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <div className='form-group'>
          <input
            className='form-control'
            type='password'
            name='password'
            autoComplete='current-password'
            placeholder={t('Password', {ns: 'loris'})}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </form>
    </Modal>
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
