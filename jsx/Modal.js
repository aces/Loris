/**
 * This file contains the React Component for a Modal Window.
 *
 * @author Henri Rabalais
 * @version 1.1.0
 *
 */
import swal from 'sweetalert2';

/**
 * Modal Component.
 * React wrapper for a Modal Window. Allows to dynamically toggle a Modal window.
 *
 * ================================================
 * Usage:
 * - Wrap the contents to be displayed by the Modal Window by the Modal Component.
 * - Use the 'show' prop to toggle the Modal Component's presentation.
 * - Use the 'title' prop to set a title for the Modal Component.
 * - Use the 'onSubmit' prop set a submission function for the Modal's contents.
 * - Use the 'throwWarning' prop to throw a warning upon closure of the Modal Window
 * =================================================
 *
 */
class Modal extends React.Component {
  constructor() {
    super();
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    if (this.props.throwWarning) {                                              
      swal({                                                                    
        title: "Are You Sure?",                                                 
        text: "Leaving the form will result in the loss of any information entered.",
        type: "warning",                                                        
        showCancelButton: true,                                                 
        confirmButtonText: 'Proceed',                                           
        cancelButtonText: 'Cancel',                                             
      }).then(result => {
        if (result.value) {
          this.props.closeModal();                                                        
        }
      });
    } else {                                                                    
      this.props.closeModal();
    }                                                                           
  }   

  render() {
    const headerStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '40px',
      borderTopRightRadius: '10',
      fontSize: 24,
      padding: 35,
      borderBottom: '1px solid #DDDDDD'
    }

    const glyphStyle = {
      marginLeft: 'auto',
      cursor: 'pointer'
    }

    const bodyStyle = {
      padding: 15
    }

    let children = () => this.props.show && this.props.children;

    let display = () => this.props.show ? {display: 'block'} : {display: 'none'};

    const footerStyle = {
      borderTop: '1px solid #DDDDDD',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '40px',
      padding: '35px 35px 20px 35px'
    }

    const submitStyle = {
      marginLeft: 'auto',
      marginRight: '20px'
    }

    let submitButton = () => {
      if (this.props.onSubmit) {
        return (
          <div style={submitStyle}>
            <ButtonElement
              label='Submit'
              onUserInput={this.props.onSubmit}
            />
          </div>
        );
      }
    }
  
    let modal = (
      <div className='modal' style={display()} onClick={this.closeModal}>
        <div className='modal-content' onClick={e => {e.stopPropagation()}}>
          <div style={headerStyle}>
            {this.props.title}
            <span style={glyphStyle} onClick={this.closeModal}>
              ×
            </span>
          </div>
          <div style={bodyStyle}>
            {children()}
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
  title: React.PropTypes.string,
  show: React.PropTypes.bool.isRequired,
  onSubmit: React.PropTypes.func,
  closeModal: React.PropTypes.func.isRequired,
  throwWarning: React.PropTypes.bool,
};

Modal.defaultProps = {
  show: false,
  throwWarning: true
};

export default Modal;
