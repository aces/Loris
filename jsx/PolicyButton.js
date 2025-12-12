/**
 * This file contains React component for the Policy Button.
 *
 * @author Saagar Arya
 * @version 2.0.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

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
  if (popUpPolicy && popUpPolicy.needsRenewal) {
    fireSwal(popUpPolicy);
  }
  if (onClickPolicy) {
    return <a
      className="hidden-xs hidden-sm"
      id="on-click-policy-button"
      style={{...buttonStyle}}
      href="#"
      onClick={() => {
        fireSwal(onClickPolicy, anon, callback);
      }}
    >
      {buttonText || onClickPolicy.HeaderButtonText}
    </a>;
  }
};

const fireSwal = (policy, anon, callback) => {
  Swal.fire({
    title: policy.SwalTitle,
    html: policy.Content,
    confirmButtonText: policy.AcceptButtonText,
    cancelButtonText: policy.DeclineButtonText,
    showCancelButton: policy.DeclineButtonText,
    allowOutsideClick: false,
  }).then((decision) => {
    if (callback) {
      callback(decision);
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
            decision: decision.value == true ? 'Accepted' : 'Declined',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      if (decision.value != true) {
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

export {PolicyButton, fireSwal};
