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
  onSubmit?: () => Promise<any>;
  onSuccess?: (data: any) => void;
  title?: ReactNode;
  width?: string;
}>;

/**
 * Modal Component
 *
 * A React functional component that renders a modal dialog with optional
 * form submission and loading indicators. Supports asynchronous form submission
 * with loading and success feedback.
 *
 * @param {ModalProps} props - Properties for the modal component
 * @returns {JSX.Element} - A modal dialog box w/ optional submit functionality
 */
const Modal = ({
  throwWarning = false,
  show = false,
  onClose,
  onSubmit,
  onSuccess,
  title,
  children,
  width,
}: ModalProps) => {
  const [loading, setLoading] = useState(false); // Tracks loading during submit
  const [success, setSuccess] = useState(false); // Tracks success after submit
  const {t} = useTranslation('loris'); // Initialize translation

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
        reverseButtons: true,
        focusCancel: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#888888',
      }).then((result) => result.value && onClose());
    } else {
      onClose(); // Close immediately if no warning
    }
  };

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

  /**
   * Renders submit button if `onSubmit` is provided and no loading or success.
   *
   * @returns {JSX.Element | undefined} - The submit button if conditions are met
   */
  const submitButton = () => {
    if (onSubmit && !(loading || success)) { // Show button if conditions met
      return <div style={submitStyle}><ButtonElement label={t('Save')}/></div>;
    }
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
    padding: success ? 0 : '15px 15px',
    maxHeight: success ? 0 : '75vh',
    overflow: 'scroll',
    opacity: success ? 0 : 1,
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
    visibility: show ? 'visible' : 'hidden',
  };

  const modalContent: CSSProperties = {
    opacity: show ? 1 : 0,
    top: show ? 0 : '-300px',
    position: 'relative',
    backgroundColor: '#fefefe',
    borderRadius: '7px',
    margin: 'auto',
    padding: 0,
    border: '1px solid #888',
    width: width ?? '700px',
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
    backgroundColor: success ? '#e0ffec' : undefined,
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

  const content = (
    <>
      <div style={bodyStyle}>{show && children}</div>
      <div style={footerStyle}>
        {loader}
        {successDisplay}
        {submitButton()}
      </div>
    </>
  );

  return (
    <div style={modalContainer} onClick={handleClose}>
      <div style={modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          {title}
          <span style={glyphStyle} onClick={handleClose}>×</span>
        </div>
        <div>
          {onSubmit ? (
            <FormElement
              name='modal'
              onSubmit={handleSubmit}
            >
              {content}
            </FormElement>
          ) : content}
        </div>
      </div>
    </div>
  );
};

export default Modal;
