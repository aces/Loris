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
 *
 * Other button attributes, such as an aria-label or the handlers a Tooltip
 * adds, pass through to the button.
 */
function Button(props: {
    children: React.ReactNode,
    onClick?: () => void,
    display?: 'primary' | 'secondary' | 'quiet' | 'danger',
    disabled?: boolean,
    type?: 'button' | 'submit',
    title?: string,
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'className' | 'onClick'
>): React.ReactElement {
  const {children, display, type, onClick, ...rest} = props;
  return (
    <button {...rest}
      type={type || 'button'}
      className={'loris-button ' + (display || 'primary')}
      onClick={onClick ? () => onClick() : undefined}>
      {children}
    </button>
  );
}

export default Button;
