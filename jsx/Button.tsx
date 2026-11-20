import React from 'react';
import './Button.css';

/**
 * A control that performs an action, in one of four displays: primary for the
 * action being encouraged, secondary for an ordinary one, quiet for one drawn
 * as text, and danger for one that destroys something.
 *
 * This is the unwrapped control, with no form row around it.
 *
 * @param props - React props
 * @param props.children - The label
 * @param props.onClick - Callback when pressed
 * @param props.display - "primary" (the default),
 *                        "secondary", "quiet" or "danger"
 * @param props.disabled - Disables the button
 * @param props.type - Button type, defaults to "button"
 * @param props.title - Tooltip text
 * @returns - The button
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
