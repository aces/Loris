/* exported RPassword */

/**
 * @author Laetitia Fesselier
 * @version 1.0.0
 *
 */

import React, {Component} from 'react';
import '../htdocs/css/password.css';

/**
 * Display an input password
 * with a toggle option to display it in plain text
 */
class Password extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   *
   * props:
   *   inputName, the name of the input, default to password
   *   class, additional classes for the input
   *   placeholder, the placeholder value for the input, default to ''
   */
  constructor(props) {
    super(props);

    // state when the password is displayed
    this.on = {
      // icon: open|close, the glyph suffix to display either glyphicon-eye-open or glyphicon-eye-close
      icon: 'close',
      // type: text|password, the type of the input
      type: 'text',
    };

    // state when the password is hidden
    this.off = {
      icon: 'open',
      type: 'password',
    };

    // state initilized to off, password hidden
    this.state = this.off;

    // callback called to toogle the visibility
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  /**
   * Toggle the mode of the password field
   * between password|text
   * If mode is text, password is visible
   */
  toggleVisibility() {
    if (this.state.type === 'password') {
      this.setState(this.on);
    } else {
      this.setState(this.off);
    }
  }

  /**
   * Render the React component
   *
   * @return {object}
   */
  render() {
    return (
      <div className="form-group has-feedback">
        <input
          type={this.state.type} name={this.props.inputName}
          className={'form-control' + this.props.class}
          placeholder={this.props.placeholder}
        />
        <span
          className={
            'form-control-feedback glyphicon glyphicon-eye-' + this.state.icon
          }
          onClick={this.toggleVisibility}
        ></span>
      </div>
    );
  }
}
Password.defaultProps = {
  inputName: 'password',
  class: '',
  placeholder: '',
};

let RPassword = React.createFactory(Password);

window.Password = Password;
window.RPassword = RPassword;

export default Password;
