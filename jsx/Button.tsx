import React from 'react';
import './Button.css';

/**
 * A control that performs an action.
 *
 * Choose the display by how much weight the action deserves, so that a set of
 * buttons reads as a hierarchy rather than as equals:
 *
 *   primary    the action being encouraged
 *   secondary  an ordinary action, outlined rather than filled so it does not
 *              compete with a primary beside it
 *   quiet      an action that should be available without asking for
 *              attention, drawn as text rather than as a control
 *   danger     an action that destroys something
 *
 * It is the unwrapped control, with no form row around it, so it can be placed
 * anywhere.
 *
 * @param {object} props - React props
 * @param {React.ReactNode} props.children - The label
 * @param {function} props.onClick - Callback when pressed
 * @param {string|undefined} props.display - "primary" (the default),
 *                                           "secondary", "quiet" or "danger"
 * @param {boolean|undefined} props.disabled - Disables the button
 * @param {string|undefined} props.type - Button type, defaults to "button"
 * @param {string|undefined} props.title - Tooltip text
 * @returns {React.ReactElement} - The button
 */
function Button(props: {
    children: React.ReactNode,
    onClick?: () => void,
    display?: 'primary' | 'secondary' | 'quiet' | 'danger',
    disabled?: boolean,
    type?: 'button' | 'submit',
    title?: string,
}): React.ReactElement {
  return (
    <button type={props.type || 'button'}
      className={'loris-button ' + (props.display || 'primary')}
      disabled={props.disabled}
      title={props.title}
      onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export default Button;
