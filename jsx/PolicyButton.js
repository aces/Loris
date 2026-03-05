/**
 * This file contains React component for the Policy Button.
 *
 * @author Saagar Arya
 * @version 2.0.0
 */

import React from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import 'I18nSetup';
import {withTranslation} from 'react-i18next';

const DATAQUERY_DEFAULT_CONTENT =
  'By using this Data Query Tool, you acknowledge that you know it is ' +
  'in beta and may not work as expected. You also agree to use it ' +
  'responsibly and not to misuse the data.';
const LOGIN_DEFAULT_CONTENT =
  'By using this LORIS instance you acknowledge that you know it is ' +
  'filled with test data, and not real user data.';

const POLICY_TRANSLATION_MSGIDS = Object.freeze({
  dataquery_example: Object.freeze({
    HeaderButtonText: 'Terms of Use',
    SwalTitle: 'Terms of Use',
    AcceptButtonText: 'Yes, I accept',
    DeclineButtonText: 'Decline',
    Content: DATAQUERY_DEFAULT_CONTENT,
  }),
  login_example: Object.freeze({
    HeaderButtonText: 'Terms of Use',
    SwalTitle: 'Terms of Use',
    AcceptButtonText: 'Accept',
    Content: LOGIN_DEFAULT_CONTENT,
  }),
});

/**
 * Return the canonical literal msgid for a known policy field.
 *
 * @param {object} policy - Policy object from backend.
 * @param {string} field - Backend policy field name.
 * @return {string|null} canonical msgid or null if unknown.
 */
const getPolicyMsgid = (policy, field) => {
  if (!policy
    || typeof policy.PolicyName !== 'string'
    || policy.PolicyName === ''
  ) {
    return null;
  }
  const policyTranslations = POLICY_TRANSLATION_MSGIDS[policy.PolicyName];
  if (!policyTranslations || !policyTranslations[field]) {
    return null;
  }
  return policyTranslations[field];
};

/**
 * Translate known policy text while preserving literal fallback.
 *
 * @param {object} policy - Policy object from backend.
 * @param {string} field - Backend policy field name.
 * @param {string|undefined|null} fallbackText - Raw backend value.
 * @param {function|undefined} t - i18n translate function from withTranslation.
 * @return {string|undefined|null} Translated or fallback text.
 */
const translatePolicyField = (policy, field, fallbackText, t) => {
  if (typeof fallbackText !== 'string' || fallbackText === '') {
    return fallbackText;
  }
  const msgid = getPolicyMsgid(policy, field);
  if (msgid === null || typeof t !== 'function') {
    return fallbackText;
  }
  return t(
    msgid,
    {ns: 'loris', defaultValue: fallbackText}
  );
};

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
 * @param {function} [props.t] - Translate function from withTranslation.
 */
const PolicyButtonComponent = ({
  onClickPolicy,
  popUpPolicy,
  buttonStyle,
  buttonText,
  anon=false,
  callback=() => {},
  t,
}) => {
  if (popUpPolicy && popUpPolicy.needsRenewal) {
    fireSwal(popUpPolicy, undefined, undefined, t);
  }
  if (onClickPolicy) {
    const headerButtonText = translatePolicyField(
      onClickPolicy,
      'HeaderButtonText',
      onClickPolicy.HeaderButtonText,
      t
    );
    return <a
      className="hidden-xs hidden-sm"
      id="on-click-policy-button"
      style={{...buttonStyle}}
      href="#"
      onClick={() => {
        fireSwal(onClickPolicy, anon, callback, t);
      }}
    >
      {buttonText || headerButtonText}
    </a>;
  }
};

const fireSwal = (policy, anon=false, callback=() => {}, t) => {
  Swal.fire({
    title: translatePolicyField(policy, 'SwalTitle', policy.SwalTitle, t),
    html: translatePolicyField(policy, 'Content', policy.Content, t),
    confirmButtonText: translatePolicyField(
      policy,
      'AcceptButtonText',
      policy.AcceptButtonText,
      t
    ),
    cancelButtonText: translatePolicyField(
      policy,
      'DeclineButtonText',
      policy.DeclineButtonText,
      t
    ),
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

PolicyButtonComponent.propTypes = {
  onClickPolicy: PropTypes.shape({
    PolicyName: PropTypes.string,
    HeaderButtonText: PropTypes.string,
    SwalTitle: PropTypes.string.isRequired,
    Content: PropTypes.string.isRequired,
    AcceptButtonText: PropTypes.string.isRequired,
    DeclineButtonText: PropTypes.string.isRequired,
  }),
  popUpPolicy: PropTypes.shape({
    PolicyName: PropTypes.string,
    HeaderButtonText: PropTypes.string,
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
  t: PropTypes.func,
};

const PolicyButton = withTranslation('loris')(PolicyButtonComponent);

window.PolicyButton = PolicyButton;

export {PolicyButton, PolicyButtonComponent, fireSwal, translatePolicyField};
