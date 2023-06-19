/**
 * This file contains the React Component for a Triggerable Modal Window.
 *
 * @author Henri Rabalais
 * @version 1.1.0
 *
 */
// ########### CBIGR START ###########
import React, {useState} from 'react';
// ###########  CBIGR END  ###########
import PropTypes from 'prop-types';

import Modal from 'Modal';

// ########### CBIGR START ###########
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
 * @param {object} props - React Component properties
 * @return {JSX} - React markup for the component
 */
function TriggerableModal(props) {
  const [open, setOpen] = useState(false);
  const {label, onClose, onUserInput, TriggerTag = CTA} = props;

  const close = () => {
    setOpen(false);
    if (onClose instanceof Function) onClose();
  };

  const trigger = (
    <TriggerTag label={label} onUserInput={() => {
      if (onUserInput instanceof Function) onUserInput();
      setOpen(true);
    }}/>
  );

  return (
    <>
      {trigger}
      <Modal {...props} show={open} onClose={close}/>
    </>
  );
}
// ###########  CBIGR END  ###########

TriggerableModal.propTypes = {
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

export default TriggerableModal;
