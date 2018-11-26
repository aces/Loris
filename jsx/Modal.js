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
 * - Use the 'title' prop to set a title for the Modal Component.
 * - Use the 'trigger' prop to set the component that will act as a trigger to
 *   open the Modal window.
 * - Use the 'onSubmit' prop to set a submission function for the Modal's contents.
 * - Use the 'throwWarning' prop to throw a warning upon closure of the Modal Window
 * =================================================
 *
 */
class Modal extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    if (this.props.throwWarning) {
      swal({
        title: 'Are You Sure?',
        text: 'Leaving the form will result in the loss of any information'
          +'entered.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel'
      }).then(result => result.value && this.setState({open: false}));
    } else {
      this.setState({open: false});
    }
  }

  render() {
    const {open} = this.state;
    const {children, onSubmit, trigger, title} = this.props;

    const headerStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '40px',
      borderTopRightRadius: '10',
      fontSize: 24,
      padding: 35,
      borderBottom: '1px solid #DDDDDD'
    };

    const glyphStyle = {
      marginLeft: 'auto',
      cursor: 'pointer'
    };

    const bodyStyle = {
      padding: 15
    };

    const renderChildren = () => open && children;

    const display = () => open ? {display: 'block'} : {display: 'none'};

    const footerStyle = {
      borderTop: '1px solid #DDDDDD',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: '40px',
      padding: '35px 35px 20px 35px'
    };

    const submitStyle = {
      marginLeft: 'auto',
      marginRight: '20px'
    };

    const submitButton = () => {
      if (onSubmit) {
        return (
          <div style={submitStyle}>
            <ButtonElement
              label="Submit"
              onUserInput={onSubmit}
            />
          </div>
        );
      }
    };

    const renderTrigger = () => {
      return React.cloneElement(
        trigger,
        {onClick: () => this.setState({open: true})}
      );
    };

    const modal = (
      <div className="modal" style={display()} onClick={this.onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div style={headerStyle}>
            {title}
            <span style={glyphStyle} onClick={this.onClose}>
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

    return (
      <div>
        {renderTrigger()}
        {modal}
      </div>
    );
  }
}

Modal.propTypes = {
  title: React.PropTypes.string,
  trigger: React.PropTypes.element.isRequired,
  onSubmit: React.PropTypes.func,
  throwWarning: React.PropTypes.bool
};

Modal.defaultProps = {
  throwWarning: true
};

export default Modal;
