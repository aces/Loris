/**
 * Add Consent form
 * Renders form to add a consent row
 *
 * @author Camille Beaudoin
 *
 * */
import React, {Component} from 'react';
import Modal from 'Modal';
import swal from 'sweetalert2';
import {
  FormElement,
  ButtonElement,
  TextboxElement,
} from 'jsx/Form';

/**
 * Add Consent Form
 *
 * Component for form adding consent to DB
 *
 * @author Camille Beaudoin
 */
class sendConfirmation extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      data_url: '',
      isOpen: false,
      formData: {
        email1: null,
        email2: null,
      },
    };

    this.close = this.close.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.sendConfirmation = this.sendConfirmation.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.setState({
      isLoaded: true,
      data_url: this.props.data_url,
      isOpen: this.props.openSendConfirmation,
      formData: {
        email1: null,
        email2: null,
      },
    });
  }

  /**
   * Close window
   */
  close() {
    this.setState({
      isOpen: false,
    });
  }

  /**
   * Store the value of the element in this.state.formData
   *
   * @param {string} formElement - name of the form element
   * @param {string} value - value of the form element
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * Submit the formdata to add consent row and send
   *
   * @return {object} promise
   */
  sendConfirmation() {
    // create formObject for submit values
    let formObject = new FormData();
    for (let key in this.state.formData) {
      if (this.state.formData[key] !== '') {
        formObject.append(key, this.state.formData[key]);
      }
    }

    formObject.append('action', 'send');
    // Post data
    let actionUrl = this.state.data_url + '&action=send';
    return fetch(actionUrl, {
      method: 'POST',
      body: formObject,
      cache: 'no-cache',
    })
    .then((response) => {
      if (response.ok) {
        // Give success message in swal
        // Customizeable for specific swal message / buttons
        swal.fire(
          'Success!',
          'Confirmation sent',
          'success'
        );
        return Promise.resolve();
      } else {
        // If errors, give error message
        response.text().then((message) => {
          let msg = JSON.parse(message);
          swal.fire('Error!', msg.error, 'error');
        });
        return Promise.reject();
      }
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // Waiting for data to load
    if (!this.state.isLoaded) {
      return (
        <button className='btn-info has-spinner'>
          Loading
          <span
            className='glyphicon glyphicon-refresh glyphicon-refresh-animate'>
          </span>
        </button>
      );
    }

    return (
      <Modal
        title='Send Confirmation'
        onClose={this.close}
        show={this.state.isOpen}
      >
        <FormElement
          Module="consent"
          name="sendConfirmation"
          id="sendConfirmation"
          method="POST"
        >
          <TextboxElement
            name="email1"
            label="Enter email"
            value={this.state.formData.email1}
            required={false}
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name="email2"
            label="Confirm email"
            value={this.state.formData.email2}
            required={false}
            onUserInput={this.setFormData}
          />
          <ButtonElement
            name="fire_away"
            label={
              <div>
                <span className="glyphicon glyphicon-envelope"/> Send Confirmation
              </div>
            }
            type="submit"
            buttonClass="btn btn-sm btn-success"
            onUserInput={this.sendConfirmation}
          />
        </FormElement>
      </Modal>
    );
  }
}

export default sendConfirmation;