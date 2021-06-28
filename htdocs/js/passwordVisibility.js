/* exported passwordVisibility */

/**
 * @author Laetitia Fesselier
 * @version 1.0.0
 *
 * Display a password input
 * with a toggle option to display it in plain text
 *
 * For React integration, see React version (jsx/Password.js)
 */

/**
 * Collect all input[type='password'] in the DOM
 * and instantiate PwdInput
 */
function passwordVisibility() {
  const inputs = document.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type.toLowerCase() === 'password') {
      new PwdInput(inputs[i]);
    }
  }
}

/**
 * Add a button to toggle password visibility from a input[type='password'] DOM element
 */
class PwdInput {
  /**
   * @constructor
   * @param {object} pwdInput - input['password'] DOM element
   */
  constructor(pwdInput) {
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

    this.pwdInput = pwdInput;
    this.button = this.createButton();
    this.addContainer();
  }

  /**
   * Add a container around the input and button
   * for formatting purpose with Bootstrap
   */
  addContainer() {
    // create container div
    const container = document.createElement('div');
    container.classList.add('form-group', 'has-feedback');

    // insert wrapper before pwdInput in the DOM tree
    this.pwdInput.parentNode.insertBefore(container, this.pwdInput);
    this.pwdInput.classList.add('form-control');

    // move pwdInput and button into container
    container.appendChild(this.pwdInput);
    container.appendChild(this.button);
  }

  /**
   * Create a button to toggle the visibility
   * Icon state: open|close
   *
   * @return {object} - A span DOM element
   */
  createButton() {
    const button = document.createElement('span');
    button.classList.add(
      'form-control-feedback',
      'glyphicon',
      'glyphicon-eye-' + this.state.icon
    );
    button.onclick = this.toggleVisibility.bind(this);

    return button;
  }

  /**
   * Toggle the mode of the password field
   * between password|text
   * If mode is text, password is visible
   */
  toggleVisibility() {
    this.button.classList.remove('glyphicon-eye-' + this.state.icon);

    if (this.state.type === 'password') {
      this.state = this.on;
    } else {
      this.state = this.off;
    }

    this.pwdInput.type = this.state.type;
    this.button.classList.add('glyphicon-eye-' + this.state.icon);
  }
}
