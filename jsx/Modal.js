import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import Loader from 'Loader';

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
    this.state = {loading: false, success: false};
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
    const {loading, success} = this.state;
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
      padding: success ? 0 : 15,
      maxHeight: success ? 0 : '100vh',
      opacity: success ? 0 : 1,
      transition: '1s ease, opacity 0.3s',
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
      transition: '0.4s ease',
    };

    const renderChildren = () => show && children;

    const footerStyle = {
      borderTop: '1px solid #DDDDDD',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '40px',
      padding: '35px 35px 20px 35px',
      backgroundColor: success && '#e0ffec',
    };

    const submitStyle = {
      marginLeft: 'auto',
      marginRight: '20px',
    };

    const submitButton = () => {
      if (onSubmit && !(loading || success)) {
        const handleSubmit = () => {
          this.setState({loading: true},
            () => onSubmit()
            .then(() => this.setState({loading: false, success: true},
              () => setTimeout(() => this.setState({success: false},
                this.props.onClose), 2000)),
              () => this.setState({loading: false}))
          );
        };
        return (
          <div style={submitStyle}>
            <ButtonElement
              label="Submit"
              onUserInput={handleSubmit}
            />
          </div>
        );
      }
    };

    const processStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      margin: '0px auto 15px auto',
      width: '90px',
    };
    const loader = loading && (
      <div style={processStyle}>
        <Loader size={20}/>
        <h5 className='animate-flicker'>Saving...</h5>
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
            {loader}
            {successDisplay}
            {submitButton()}
          </div>
        </div>
      </div>
    );
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
