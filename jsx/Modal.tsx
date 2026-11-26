import {
  useState,
  useEffect,
  useRef,
  useId,
  PropsWithChildren,
  CSSProperties,
  KeyboardEvent,
  ReactNode,
} from 'react';
import {createRoot} from 'react-dom/client';
import Loader from './Loader';
import Button from './Button';
import Icon from './Icon';
import {useTranslation} from 'react-i18next';

export type ModalProps = PropsWithChildren<{
  throwWarning?: boolean;
  show: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: string;
  footer?: ReactNode;
  dismissable?: boolean;
}>;

/**
 * Modal Component
 *
 * A React functional component that renders a generic modal dialog.
 *
 * @param props - Properties for the modal component
 * @returns - A modal dialog box
 */
function Modal({
  throwWarning = false,
  show = false,
  onClose,
  title,
  children,
  width,
  footer,
  dismissable = true,
}: ModalProps) {
  return (
    <ModalFrame
      show={show}
      title={title}
      onClose={onClose}
      throwWarning={throwWarning}
      width={width}
      dismissable={dismissable}
    >
      <div style={bodyStyle}>{show && children}</div>
      {footer && <div style={footerStyle}>{footer}</div>}
    </ModalFrame>
  );
}

export type FormModalProps<T> = Omit<ModalProps, 'footer'> & {
  onSubmit: () => Promise<T>;
  onSuccess?: (data: T) => void;
  submitDisabled?: boolean;
};

/**
 * FormModal Component
 *
 * A form-specific modal that keeps submit controls inside the form DOM while
 * preserving the async submit, loading, and success behavior used by LORIS.
 * When `onSubmit` rejects with an Error, its message is shown above the
 * Save button.
 */
export function FormModal<T>({
  throwWarning = false,
  show = false,
  onClose,
  onSubmit,
  onSuccess,
  submitDisabled = false,
  title,
  children,
  width,
}: FormModalProps<T>) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const {t} = useTranslation('loris');

  /**
   * Manages form submission with loading and success states, calling
   * `onSubmit` and handling modal state based on success or failure.
   */
  const handleSubmit = async () => {
    if (submitDisabled) return;

    setError(null);
    setLoading(true); // Show loader

    try {
      const data = await onSubmit();
      setLoading(false);
      setSuccess(true); // Show success

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Close delay

      setSuccess(false); // Reset success state
      onClose(); // Close modal
      onSuccess?.(data); // call onSuccess if defined
    } catch (e) {
      setLoading(false);
      if (e instanceof Error && e.message) {
        setError(e.message);
      }
    }
  };

  const submitFooter = !(loading || success) && (
    <div style={footerSubmitStyle}>
      <button
        type='submit'
        className='btn btn-primary'
        disabled={submitDisabled}
      >
        {t('Save')}
      </button>
    </div>
  );

  /**
   * Loader element displayed during form submission.
   */
  const loadingFooter = loading && (
    <div style={footerStatusStyle}>
      <Loader size={20}/>
      <span className='animate-flicker'>
        {t('Saving', {ns: 'loris'})}
      </span>
    </div>
  );

  /**
   * Success display element shown after successful form submission.
   */
  const successFooter = success && (
    <div style={footerStatusStyle}>
      <span
        style={{color: 'var(--success-strong)', marginBottom: '2px'}}
        className='glyphicon glyphicon-ok-circle'
      />
      <span>{t('Success!', {ns: 'loris'})}</span>
    </div>
  );

  return (
    <ModalFrame
      show={show}
      title={title}
      onClose={onClose}
      throwWarning={throwWarning}
      width={width}
    >
      <form
        className='form-horizontal'
        name='modal'
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        style={formStyle}
      >
        <div style={{
          ...bodyStyle,
          padding: success ? 0 : bodyStyle.padding,
          opacity: success ? 0 : 1,
        }}>
          {show && children}
        </div>
        <div style={{
          ...formFooterStyle,
          backgroundColor: success ? 'var(--success-fill)' : undefined,
        }}>
          {error && <div role='alert' style={formErrorStyle}>{error}</div>}
          {loadingFooter}
          {successFooter}
          {submitFooter}
        </div>
      </form>
    </ModalFrame>
  );
}

export type ConfirmDialogProps = {
  show: boolean;
  title: ReactNode;
  children?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * ConfirmDialog Component
 *
 * Asks the user to confirm an action before it happens. The title asks the
 * question, the children explain what follows, and the buttons name the
 * action. A dangerous action is drawn as one and the focus starts on Cancel;
 * otherwise it starts on the action.
 *
 * @param props - React props
 * @param props.show - Whether the dialog is open
 * @param props.title - The question
 * @param props.children - What happens if the user confirms
 * @param props.confirmLabel - The action, as the confirm button's label
 * @param props.cancelLabel - The cancel button's label, Cancel by default
 * @param props.danger - Whether the action destroys something
 * @param props.onConfirm - Called when the user confirms
 * @param props.onCancel - Called when the user cancels
 * @returns - The confirmation dialog
 */
export function ConfirmDialog({
  show,
  title,
  children,
  confirmLabel,
  cancelLabel,
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const {t} = useTranslation('loris');
  const descriptionId = useId();
  return (
    <ModalFrame
      show={show}
      title={title}
      onClose={onCancel}
      width='480px'
      role='alertdialog'
      describedBy={children ? descriptionId : undefined}
    >
      {children && (
        <div id={descriptionId} style={bodyStyle}>{children}</div>
      )}
      <div style={confirmFooterStyle}>
        <Button
          display='secondary'
          onClick={onCancel}
          data-autofocus={danger || undefined}
        >
          {cancelLabel ?? t('Cancel', {ns: 'loris'})}
        </Button>
        <Button
          display={danger ? 'danger' : 'primary'}
          onClick={onConfirm}
          data-autofocus={!danger || undefined}
        >
          {confirmLabel}
        </Button>
      </div>
    </ModalFrame>
  );
}

/**
 * Renders a dialog outside the page's React tree, for code that asks a
 * question from an event handler. The dialog calls `finish` with its answer,
 * which removes it and resolves the promise.
 *
 * @param render - Renders the dialog, given the callback that closes it
 * @returns - A promise of the dialog's answer
 */
export function openDialog<T>(
  render: (finish: (answer: T) => void) => ReactNode
): Promise<T> {
  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    /**
     * Resolves with the dialog's answer and removes the dialog.
     *
     * @param answer - The dialog's answer
     */
    const finish = (answer: T) => {
      resolve(answer);
      setTimeout(() => {
        root.unmount();
        container.remove();
      });
    };
    root.render(render(finish));
  });
}

/**
 * Opens a ConfirmDialog from an event handler.
 *
 * @param props - The dialog's title, text and labels
 * @returns - A promise that resolves to true when the user confirms
 */
export function openConfirm(
  props: Omit<ConfirmDialogProps, 'show' | 'onConfirm' | 'onCancel'>
): Promise<boolean> {
  return openDialog<boolean>((finish) => (
    <ConfirmDialog
      {...props}
      show={true}
      onConfirm={() => finish(true)}
      onCancel={() => finish(false)}
    />
  ));
}

type ModalFrameProps = Omit<ModalProps, 'footer'> & {
  role?: 'dialog' | 'alertdialog';
  describedBy?: string;
};

const focusableSelector = 'a[href], button:not([disabled]), '
  + 'input:not([disabled]), select:not([disabled]), '
  + 'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal frame that owns the chrome and close behavior. While open,
 * the focus stays inside it, and it returns to where it was on close.
 * Escape and a click outside close it unless it is not dismissable.
 *
 * @param props - React props
 * @param props.throwWarning - Whether closing asks first
 * @param props.show - Whether the modal is open
 * @param props.onClose - Called when the modal closes
 * @param props.title - The modal's title
 * @param props.children - The modal's content
 * @param props.width - The modal's width, 700px by default
 * @param props.dismissable - Whether Escape, a click outside and the close
 *                            button close it
 * @param props.role - dialog, or alertdialog for a question
 * @param props.describedBy - The id of the element that describes it
 * @returns - The modal frame
 */
function ModalFrame({
  throwWarning = false,
  show = false,
  onClose,
  title,
  children,
  width,
  dismissable = true,
  role = 'dialog',
  describedBy,
}: ModalFrameProps) {
  const {t} = useTranslation('loris');
  const [confirmingClose, setConfirmingClose] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!show) {
      return;
    }
    const opener = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const initial = dialog?.querySelector<HTMLElement>('[data-autofocus]');
    (initial ?? dialog)?.focus();
    return () => opener?.focus();
  }, [show]);

  /**
   * Handles modal close event. Asks first if `throwWarning` is true.
   */
  const handleClose = () => {
    if (!dismissable) {
      return;
    }
    if (throwWarning) {
      setConfirmingClose(true);
    } else {
      onClose();
    }
  };

  /**
   * Closes on Escape and keeps Tab cycling through the dialog's controls.
   *
   * @param e - The key event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      handleClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) {
      return;
    }
    e.stopPropagation();
    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
    );
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      style={{
        ...modalContainer,
        visibility: show ? 'visible' : 'hidden',
      }}
      onMouseDown={(e) => e.target === e.currentTarget && e.preventDefault()}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        ref={dialogRef}
        role={role}
        aria-modal={true}
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={describedBy}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        style={{
          ...modalContent,
          opacity: show ? 1 : 0,
          top: show ? 0 : '-300px',
          width: width ?? '700px',
        }}
      >
        <div style={headerStyle}>
          <span id={titleId}>{title}</span>
          {dismissable && (
            <Button
              display='quiet'
              onClick={handleClose}
              aria-label={t('Close', {ns: 'loris'})}
              style={closeButtonStyle}
            >
              <Icon name='close'/>
            </Button>
          )}
        </div>
        <div style={contentStyle}>
          {children}
        </div>
      </div>
      {confirmingClose && (
        <ConfirmDialog
          show={true}
          title={t('Discard this form?', {ns: 'loris'})}
          confirmLabel={t('Discard', {ns: 'loris'})}
          cancelLabel={t('Keep editing', {ns: 'loris'})}
          danger={true}
          onConfirm={() => {
            setConfirmingClose(false);
            onClose();
          }}
          onCancel={() => setConfirmingClose(false)}
        >
          {t('Leaving the form will result in the loss '
            + 'of any information entered.', {ns: 'loris'})}
        </ConfirmDialog>
      )}
    </div>
  );
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  minHeight: '64px',
  fontSize: 22,
  fontWeight: 400,
  lineHeight: 1.25,
  padding: '16px 20px',
  borderBottom: '1px solid var(--border)',
};

const closeButtonStyle: CSSProperties = {
  marginLeft: 'auto',
  fontSize: 'var(--font-size-lg)',
};

const bodyStyle: CSSProperties = {
  flex: '1 1 auto',
  minHeight: 0,
  padding: '16px',
  overflow: 'auto',
  transition: 'opacity 0.3s ease',
};

const contentStyle: CSSProperties = {
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  minHeight: 0,
  overflow: 'hidden',
};

const formStyle: CSSProperties = {
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  minHeight: 0,
  overflow: 'hidden',
};

const modalContainer: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  zIndex: 9999,
  padding: '24px 16px',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  overflow: 'auto',
  backgroundColor: 'rgba(0,0,0,0.7)',
};

const modalContent: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  backgroundColor: 'var(--surface)',
  color: 'var(--text)',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  maxHeight: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-overlay)',
  outline: 'none',
  transition: 'opacity 0.4s ease, top 0.4s ease',
};

const footerStyle: CSSProperties = {
  borderTop: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  minHeight: '64px',
  padding: '16px 20px',
};

const confirmFooterStyle: CSSProperties = {
  ...footerStyle,
  justifyContent: 'flex-end',
  gap: 'var(--space-md)',
};

const formFooterStyle: CSSProperties = {
  ...footerStyle,
  flexDirection: 'column',
  gap: '12px',
  justifyContent: 'center',
};

const formErrorStyle: CSSProperties = {
  alignSelf: 'stretch',
  padding: 'var(--space-md) var(--space-lg)',
  background: 'var(--danger-fill)',
  border: '1px solid var(--danger-border)',
  borderRadius: 'var(--radius)',
  color: 'var(--danger-strong)',
};

const footerSubmitStyle: CSSProperties = {
  alignSelf: 'flex-end',
};

const footerStatusStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center',
  gap: '8px',
};

export default Modal;
