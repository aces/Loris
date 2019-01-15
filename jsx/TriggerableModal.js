/**
 * This file contains the React Component for a Triggerable Modal Window.
 *
 * @author Henri Rabalais
 * @version 1.1.0
 *
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Modal from 'Modal';

/**
 * Triggerable Modal Component.
 * React wrapper for a Triggerable Modal Window.
 * Allows to dynamically toggle a Modal window through a rendered trigger.
 *
 * ================================================
 * Usage:
 * - Wrap the contents to be displayed by the Modal Window by the
 *   Triggerable Modal Component.
 * - Use the 'title' prop to set a title for the Modal Component.
 * - Use the 'trigger' prop to set the component that will act as a trigger to
 *   open the Modal window.
 * - Use the 'onSubmit' prop to set a submission promise object for the Modal's contents.
 * - Use the 'onClose' prop to set a function to be triggered when the Modal is
 *   closed.
 * - Use the 'throwWarning' prop to throw a warning upon closure of the Modal Window.
 * =================================================
 *
 */
class TriggerableModal extends Component {
  constructor() {
    super();
    this.state = {open: false};
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({open: false});
    if (this.props.onClose instanceof Function) this.props.onClose();
  }

  render() {
    const {label, onUserInput} = this.props;

    const trigger = (
      <CTA label={label} onUserInput={() => {
        if (onUserInput instanceof Function) onUserInput();
        this.setState({open: true});
      }}/>
    );

    return (
      <div>
        {trigger}
        <Modal {...this.props} show={this.state.open} onClose={this.close}/>
      </div>
    );
  }
}

TriggerableModal.propTypes = {
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default TriggerableModal;
