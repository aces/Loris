import {useEffect, useState, useSyncExternalStore} from 'react';
import {createRoot} from 'react-dom/client';
import {useTranslation} from 'react-i18next';
import Button from './Button';
import Icon from './Icon';
import './Toast.css';

type Tone = 'success' | 'error';

type ToastData = {
  id: number,
  tone: Tone,
  message: string,
  title?: string,
  leaving: boolean,
};

const successDuration = 5000;
const leaveDuration = 200;

let toasts: ToastData[] = [];
let nextId = 0;
let mounted = false;
const listeners = new Set<() => void>();

/**
 * Replaces the list of toasts and tells the region to render it.
 *
 * @param next - The new list
 */
function update(next: ToastData[]) {
  toasts = next;
  listeners.forEach((listener) => listener());
}

/**
 * Adds a toast, mounting the region on the first one.
 *
 * @param tone - success or error
 * @param message - The text of the toast
 * @param title - An optional heading above the text
 */
function add(tone: Tone, message: string, title?: string) {
  if (!mounted) {
    mounted = true;
    const container = document.createElement('div');
    document.body.appendChild(container);
    createRoot(container).render(<ToastRegion/>);
  }
  update([...toasts, {id: nextId++, tone, message, title, leaving: false}]);
}

/**
 * Removes a toast once it has moved out.
 *
 * @param id - The toast to remove
 */
function dismiss(id: number) {
  update(toasts.map((item) => item.id === id
    ? {...item, leaving: true}
    : item
  ));
  setTimeout(
    () => update(toasts.filter((item) => item.id !== id)),
    leaveDuration
  );
}

/**
 * The corner of the page that holds the toasts, newest at the bottom.
 *
 * @returns - The region
 */
function ToastRegion() {
  const list = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => toasts,
  );
  return (
    <div className='loris-toasts'>
      {list.map((item) => <ToastItem key={item.id} item={item}/>)}
    </div>
  );
}

/**
 * One toast. A success closes itself after a few seconds, unless the pointer
 * or the focus is on it; an error stays until it is closed.
 *
 * @param props - React props
 * @param props.item - The toast to show
 * @returns - The toast
 */
function ToastItem(props: {item: ToastData}) {
  const {item} = props;
  const {t} = useTranslation('loris');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (item.tone !== 'success' || paused) {
      return;
    }
    const timer = setTimeout(() => dismiss(item.id), successDuration);
    return () => clearTimeout(timer);
  }, [paused]);

  return (
    <div
      role={item.tone === 'error' ? 'alert' : 'status'}
      className={'loris-toast ' + item.tone
        + (item.leaving ? ' leaving' : '')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Icon name={item.tone} className='loris-toast-icon'/>
      <div className='loris-toast-text'>
        {item.title && <div className='loris-toast-title'>{item.title}</div>}
        {item.message}
      </div>
      <Button
        display='quiet'
        onClick={() => dismiss(item.id)}
        aria-label={t('Close', {ns: 'loris'})}
      >
        <Icon name='close'/>
      </Button>
    </div>
  );
}

/**
 * Shows a success at the bottom of the page.
 *
 * @param message - The text of the toast
 * @param title - An optional heading above the text
 */
function success(message: string, title?: string) {
  add('success', message, title);
}

/**
 * Shows an error that isn't about one field of a form at the bottom of the
 * page.
 *
 * @param message - The text of the toast
 * @param title - An optional heading above the text
 */
function error(message: string, title?: string) {
  add('error', message, title);
}

/**
 * Short messages at the bottom of the page that don't interrupt the user.
 */
export const toast = {success, error};

export default toast;
