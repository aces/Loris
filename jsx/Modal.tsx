import {useState, PropsWithChildren, CSSProperties, ReactNode} from 'react';
import Swal from 'sweetalert2';
import Loader from './Loader';
import {useTranslation} from 'react-i18next';

export type ModalProps = PropsWithChildren<{
  throwWarning?: boolean;
  show: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: string;
  footer?: ReactNode;
}>;

export type FormModalProps = Omit<ModalProps, 'footer'> & {
  onSubmit?: () => Promise<any> | any;
  onSuccess?: (data: any) => void;
};

/**
 * Modal Component
 *
 * A React functional component that renders a generic modal dialog.
 *
 * @param {ModalProps} props - Properties for the modal component
 * @returns {JSX.Element} - A modal dialog box
 */
const Modal = ({
  throwWarning = false,
  show = false,
  onClose,
  title,
  children,
  width,
  footer,
}: ModalProps) => {
  return (
    <ModalFrame
      show={show}
      title={title}
      onClose={onClose}
      throwWarning={throwWarning}
      width={width}
    >
      <div style={bodyStyle}>{show && children}</div>
      {footer && <div style={footerStyle}>{footer}</div>}
    </ModalFrame>
  );
};

/**
 * FormModal Component
 *
 * A form-specific modal that keeps submit controls inside the form DOM while
 * preserving the async submit, loading, and success behavior used by LORIS.
 */
export const FormModal = ({
  throwWarning = false,
  show = false,
  onClose,
  onSubmit,
  onSuccess,
  title,
  children,
  width,
}: FormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const {t} = useTranslation('loris');

  /**
   * Manages form submission with loading and success states, calling
   * `onSubmit` and handling modal state based on success or failure.
   */
  const handleSubmit = async () => {
    if (!onSubmit) return; // Ensure onSubmit exists

    setLoading(true); // Show loader

    try {
      const data = await onSubmit();
      setLoading(false);
      setSuccess(true); // Show success

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Close delay

      setSuccess(false); // Reset success state
      onClose(); // Close modal
      onSuccess?.(data); // call onSuccess if defined
    } catch {
      setLoading(false);
    }
  };

  const submitFooter = onSubmit && !(loading || success) && (
    <div style={footerSubmitStyle}>
      <button type='submit' className='btn btn-primary'>
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
        style={{color: 'green', marginBottom: '2px'}}
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
          backgroundColor: success ? '#e0ffec' : undefined,
        }}>
          {loadingFooter}
          {successFooter}
          {submitFooter}
        </div>
      </form>
    </ModalFrame>
  );
};

type ModalFrameProps = Omit<ModalProps, 'footer'>;

/**
 * Shared modal frame that owns the chrome and close behavior.
 */
const ModalFrame = ({
  throwWarning = false,
  show = false,
  onClose,
  title,
  children,
  width,
}: ModalFrameProps) => {
  const {t} = useTranslation('loris');

  /**
   * Handles modal close event. Shows a confirmation if `throwWarning` is true.
   */
  const handleClose = () => {
    if (throwWarning) { // Display warning if enabled
      Swal.fire({
        title: t('Are You Sure?', {ns: 'loris'}),
        text: t('Leaving the form will result in the loss '
          +'of any information entered.',
        {ns: 'loris'}),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: t('Proceed', {ns: 'loris'}),
        cancelButtonText: t('Cancel', {ns: 'loris'}),
      }).then((result) => result.value && onClose());
    } else {
      onClose(); // Close immediately if no warning
    }
  };

  return (
    <div
      style={{
        ...modalContainer,
        visibility: show ? 'visible' : 'hidden',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          ...modalContent,
          opacity: show ? 1 : 0,
          top: show ? 0 : '-300px',
          width: width ?? '700px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerStyle}>
          {title}
          <span style={closeButtonStyle} onClick={handleClose}>×</span>
        </div>
        <div style={contentStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  minHeight: '64px',
  fontSize: 22,
  fontWeight: 400,
  lineHeight: 1.25,
  padding: '16px 20px',
  borderBottom: '1px solid #DDDDDD',
};

const closeButtonStyle: CSSProperties = {
  marginLeft: 'auto',
  cursor: 'pointer',
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
  backgroundColor: '#fefefe',
  borderRadius: '8px',
  border: '1px solid #888',
  maxHeight: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
  transition: 'opacity 0.4s ease, top 0.4s ease',
};

const footerStyle: CSSProperties = {
  borderTop: '1px solid #DDDDDD',
  display: 'flex',
  alignItems: 'center',
  flex: '0 0 auto',
  minHeight: '64px',
  padding: '16px 20px',
};

const formFooterStyle: CSSProperties = {
  ...footerStyle,
  flexDirection: 'column',
  gap: '12px',
  justifyContent: 'center',
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
