/**
 * This file contains React component for the Policy Button.
 *
 * @author Saagar Arya
 * @version 2.0.0
 */

import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Modal, {openDialog} from 'jsx/Modal';
import Button from 'jsx/Button';

/**
 * PolicyButton Component
 *
 * @param {object} props - The component props.
 * @param {object} props.onClickPolicy - The policy object containing title
 *                 and content that should appear when the button is pressed.
 * @param {object} [props.buttonStyle] - Optional style object for the button.
 * @param {object} [props.popUpPolicy] - Optional policy object for pop-up
 *                 policy that needs renewal.
 * @param {string} [props.buttonText] - Optional text for the button.
 * @param {boolean} [props.anon] - Optional flag to indicate if the user is anonymous.
 * @param {function} [props.callback] - Optional callback function to execute after the policy decision.
 */
const PolicyButton = ({
  onClickPolicy,
  popUpPolicy,
  buttonStyle,
  buttonText,
  anon=false,
  callback=() => {},
}) => {
  useEffect(() => {
    if (popUpPolicy && popUpPolicy.needsRenewal) {
      showPolicy(popUpPolicy);
    }
  }, []);
  if (onClickPolicy) {
    return <a
      id="on-click-policy-button"
      style={{...buttonStyle}}
      href="#"
      onClick={() => {
        showPolicy(onClickPolicy, anon, callback);
      }}
    >
      {buttonText || onClickPolicy.HeaderButtonText}
    </a>;
  }
};

/**
 * Shows a policy in a dialog that only its buttons close, and records the
 * user's decision.
 *
 * @param {object} policy - The policy to show
 * @param {boolean} [anon] - True if the user is not logged in
 * @param {function} [callback] - Called with true when the policy is accepted
 */
const showPolicy = (policy, anon, callback) => {
  openDialog((finish) => (
    <Modal
      show={true}
      title={policy.SwalTitle}
      onClose={() => finish(false)}
      dismissable={false}
      footer={
        <div style={{
          display: 'flex',
          gap: 'var(--space-md)',
          marginLeft: 'auto',
        }}>
          {policy.DeclineButtonText && (
            <Button display='secondary' onClick={() => finish(false)}>
              {policy.DeclineButtonText}
            </Button>
          )}
          <Button onClick={() => finish(true)} data-autofocus={true}>
            {policy.AcceptButtonText}
          </Button>
        </div>
      }
    >
      <div dangerouslySetInnerHTML={{__html: policy.Content}}/>
    </Modal>
  )).then((accepted) => {
    if (callback) {
      callback(accepted);
    }
    if (!anon) {
      fetch(
        loris.BaseURL +
        '/policy_tracker/policies',
        {
          method: 'POST',
          credentials: 'same-origin',
          body: JSON.stringify({
            ...policy,
            decision: accepted ? 'Accepted' : 'Declined',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      if (!accepted) {
        window.location.href = loris.BaseURL;
      }
    }
  });
};

PolicyButton.propTypes = {
  onClickPolicy: PropTypes.shape({
    SwalTitle: PropTypes.string.isRequired,
    Content: PropTypes.string.isRequired,
    AcceptButtonText: PropTypes.string.isRequired,
    DeclineButtonText: PropTypes.string.isRequired,
  }).isRequired,
  onClickPolicy: PropTypes.object.isRequired,
  popUpPolicy: PropTypes.shape({
    needsRenewal: PropTypes.bool,
    SwalTitle: PropTypes.string,
    Content: PropTypes.string,
    AcceptButtonText: PropTypes.string,
    DeclineButtonText: PropTypes.string,
  }),
  buttonStyle: PropTypes.object,
  buttonText: PropTypes.string,
  anon: PropTypes.bool,
  callback: PropTypes.func,
};

window.PolicyButton = PolicyButton;

export {PolicyButton, showPolicy};
