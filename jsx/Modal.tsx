import {useState, PropsWithChildren, CSSProperties, ReactNode} from 'react';
import Swal from 'sweetalert2';
import Loader from './Loader';
import {
  ButtonElement,
  FormElement,
} from 'jsx/Form';
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

  const submitButton = onSubmit && !(loading || success) && (
    <div style={submitStyle}><ButtonElement label={t('Save')}/></div>
  );

  /**
   * Loader element displayed during form submission.
   */
  const loader = loading && (
    <div style={processStyle}>
      <Loader size={20}/>
      <h5 className='animate-flicker'>{t('Saving', {ns: 'loris'})}</h5>
    </div>
  );

  /**
   * Success display element shown after successful form submission.
   */
  const successDisplay = success && (
    <div style={processStyle}>
      <span
        style={{color: 'green', marginBottom: '2px'}}
        className='glyphicon glyphicon-ok-circle'
      />
      <h5>{t('Success!', {ns: 'loris'})}</h5>
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
      <FormElement
        name='modal'
        onSubmit={handleSubmit}
      >
        <div style={{
          ...bodyStyle,
          padding: success ? 0 : bodyStyle.padding,
          maxHeight: success ? 0 : bodyStyle.maxHeight,
          opacity: success ? 0 : 1,
        }}>
          {show && children}
        </div>
        <div style={{
          ...footerStyle,
          backgroundColor: success ? '#e0ffec' : undefined,
        }}>
          {loader}
          {successDisplay}
          {submitButton}
        </div>
      </FormElement>
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
          <span style={glyphStyle} onClick={handleClose}>×</span>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

const headerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '40px',
  borderTopRightRadius: '10',
  fontSize: 24,
  padding: 35,
  borderBottom: '1px solid #DDDDDD',
};

const glyphStyle: CSSProperties = {
  marginLeft: 'auto',
  cursor: 'pointer',
};

const bodyStyle: CSSProperties = {
  padding: '15px 15px',
  maxHeight: '75vh',
  overflow: 'scroll',
  transition: '1s ease, opacity 0.3s',
};

const modalContainer: CSSProperties = {
  display: 'block',
  position: 'fixed',
  zIndex: 9999,
  paddingTop: '100px',
  paddingBottom: '100px',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  overflow: 'auto',
  backgroundColor: 'rgba(0,0,0,0.7)',
};

const modalContent: CSSProperties = {
  position: 'relative',
  backgroundColor: '#fefefe',
  borderRadius: '7px',
  margin: 'auto',
  padding: 0,
  border: '1px solid #888',
  boxShadow: '0 4px 8px 0 rbga(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
  transition: '0.4s ease',
};

const footerStyle: CSSProperties = {
  borderTop: '1px solid #DDDDDD',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '40px',
  padding: '35px',
};

const submitStyle: CSSProperties = {
  marginLeft: 'auto',
  marginRight: '20px',
};

const processStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  margin: '0px auto',
  width: '90px',
};

export default Modal;
