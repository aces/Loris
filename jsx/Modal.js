import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import Loader from 'Loader';
import {FormElement} from 'jsx/Form';

/**
 * Modal Component
 *
 * A React functional component that renders a modal dialog with optional
 * form submission and loading indicators. Supports asynchronous form submission
 * with loading and success feedback.
 *
 * @param props
 * @param props.throwWarning
 * @param props.show
 * @param props.onClose
 * @param props.onSubmit
 * @param props.onSuccess
 * @param props.title
 * @param props.children
 * @return {JSX} - React markup for the component
 */
function Modal({
  throwWarning = false,
  show = false,
  onClose,
  onSubmit,
  onSuccess,
  title,
  children,
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    if (throwWarning) {
      Swal.fire({
        title: 'Are You Sure?',
        text: 'Leaving the form will result in the loss of any information ' +
          'entered.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
      }).then((result) => result.value && onClose());
    } else {
      onClose();
    }
  };

  const headerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '40px',
    borderTopRightRadius: '10',
    fontSize: 24,
    padding: 35,
    borderBottom: '1px solid #DDDDDD',
  };

  const glyphStyle = {
    marginLeft: 'auto',
    cursor: 'pointer',
  };

  const bodyStyle = {
    padding: success ? 0 : '15px 15px',
    maxHeight: success ? 0 : '75vh',
    overflow: 'scroll',
    opacity: success ? 0 : 1,
    transition: '1s ease, opacity 0.3s',
  };

  const modalContainer = {
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

  const modalContent = {
    opacity: show ? 1 : 0,
    top: show ? 0 : '-300px',
    position: 'relative',
    backgroundColor: '#fefefe',
    borderRadius: '7px',
    margin: 'auto',
    padding: 0,
    border: '1px solid #888',
    width: '700px',
    boxShadow: '0 4px 8px 0 rbga(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
    transition: '0.4s ease',
  };

  const renderChildren = () => show && children;

  const footerStyle = {
    borderTop: '1px solid #DDDDDD',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '40px',
    padding: '35px',
    backgroundColor: success && '#e0ffec',
  };

  const submitStyle = {
    marginLeft: 'auto',
    marginRight: '20px',
  };

  const submitButton = () => {
    if (onSubmit && !(loading || success)) {
      return (
        <div style={submitStyle}>
          <ButtonElement/>
        </div>
      );
    }
  };

  const processStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    margin: '0px auto',
    width: '90px',
  };
  const loader = loading && (
    <div style={processStyle}>
      <Loader size={20}/>
      <h5 className='animate-flicker'>Saving</h5>
    </div>
  );
  const successDisplay = success && (
    <div style={processStyle}>
      <span
        style={{color: 'green', marginBottom: '2px'}}
        className='glyphicon glyphicon-ok-circle'
      />
      <h5>Success!</h5>
    </div>
  );

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const submit = async (e) => {
    console.log('form submit');
    try {
      setLoading(true);
      const data = await onSubmit();
      setLoading(false);
      setSuccess(true);
      await wait(2000);
      setSuccess(false);
      onClose();
      onSuccess(data);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div style={modalContainer} onClick={handleClose}>
      <div
        style={modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerStyle}>
          {title}
          <span style={glyphStyle} onClick={handleClose}>
            ×
          </span>
        </div>
        <FormElement
          name="modalForm"
          id="modalForm"
          onSubmit={submit}
        >
          <div style={bodyStyle}>
            {renderChildren()}
          </div>
          <div style={footerStyle}>
            {loader}
            {successDisplay}
            {submitButton()}
          </div>
        </FormElement>
      </div>
    </div>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  show: PropTypes.bool.isRequired,
  throwWarning: PropTypes.bool,
};

export default Modal;
