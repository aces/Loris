import React from 'react';
import PropTypes from 'prop-types';

const Button = (props) => {
  const handleClick = (e) => {
    props.onUserInput(e);
  };
  return (
    <div className={'text-center'}>
      <button
        name={props.name}
        type={props.type}
        className={props.buttonClass}
        onClick={handleClick}
        style={props.style}
        disabled={props.disabled}
      >
        {props.label}
      </button>
    </div>
  );
};
Button.defaultProps = {
  label: 'Submit',
  type: 'submit',
  disabled: null,
  buttonClass: 'btn btn-primary',
  columnSize: 'col-sm-9 col-sm-offset-3',
  onUserInput: function() {
    console.warn('onUserInput() callback is not set');
  },
};
Button.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onUserInput: PropTypes.func,
};

export default Button;
