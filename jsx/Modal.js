/**
 * This file contains the React Component for a Modal Window.
 *
 * @author Henri Rabalais
 * @version 1.1.0
 *
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';

/**
 * Modal Component.
 * React wrapper for a Modal Window. Allows to dynamically toggle a Modal
 * window.
 *
 * ================================================
 * Usage:
 * - Wrap the contents to be displayed by the Modal Window by the
 *   Modal Component.
 * - Use the 'title' prop to set a title for the Modal Component.
 * - Use the 'onSubmit' prop to set a submission *promise* object for the
 *   Modal's contents.
 * - Use the 'onClose' prop to set a function that triggers upon Modal closure.
 * - Use the 'throwWarning' prop to throw a warning upon closure of the
 *   Modal Window.
 * =================================================
 *
 */
class Modal extends Component {
  constructor() {
    super();
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    if (this.props.throwWarning) {
      swal({
        title: 'Are You Sure?',
        text: 'Leaving the form will result in the loss of any information ' +
          'entered.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
      }).then((result) => result.value && this.props.onClose());
    } else {
      this.props.onClose();
    }
  }

  render() {
    const {show, children, onSubmit, title} = this.props;

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
      padding: 15,
    };

    const modalContainer = {
      display: 'block',
      position: 'fixed',
      zIndex: 9999,
      paddingTop: '100px',
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
      transition: 'top 0.4s, opacity 0.4s',
    };

    const renderChildren = () => show && children;

    const footerStyle = {
      borderTop: '1px solid #DDDDDD',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '40px',
      padding: '35px 35px 20px 35px',
    };

    const submitStyle = {
      marginLeft: 'auto',
      marginRight: '20px',
    };

    const submitButton = () => {
      if (onSubmit) {
        return (
          <div style={submitStyle}>
            <ButtonElement
              label="Submit"
              onUserInput={() => onSubmit().then(() => this.props.onClose())}
            />
          </div>
        );
      }
    };

    return (
      <div style={modalContainer} onClick={this.handleClose}>
        <div
          style={modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={headerStyle}>
            {title}
            <span style={glyphStyle} onClick={this.handleClose}>
              ×
            </span>
          </div>
          <div style={bodyStyle}>
            {renderChildren()}
          </div>
          <div style={footerStyle}>
            {submitButton()}
          </div>
        </div>
      </div>
    );

    return modal;
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  onSubmit: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  throwWarning: PropTypes.bool,
};

Modal.defaultProps = {
  throwWarning: false,
};

export default Modal;
