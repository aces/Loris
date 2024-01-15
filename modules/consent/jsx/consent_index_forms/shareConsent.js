/**
 * Share Consent form
 *
 * Renders form for copying eConsent link or sending eConsent
 *
 * @author Camille Beaudoin
 *
 * */
import React, {Component} from 'react';
import swal from 'sweetalert2';
import {
  FormElement,
  ButtonElement,
  TextboxElement,
} from 'jsx/Form';

/**
 * Share Consent Form
 *
 * Component for form to share eConsent
 *
 * @author Camille Beaudoin
 */
class ShareConsentForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        email1: null,
        email2: null,
        pscid: null,
        candID: null,
        consent_group: null,
      },
      isLoaded: false,
      showEmails: false,
      showSend: false,
    };

    this.setFormData = this.setFormData.bind(this);
    this.copyLink = this.copyLink.bind(this);
    this.sendConsent = this.sendConsent.bind(this);
    this.showSend = this.showSend.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.setState({
      isLoaded: true,
      formData: {
        email1: null,
        email2: null,
        pscid: this.props.data['PSCID'],
        candID: this.props.data['CandID'],
        consent_group: this.props.data['Consent Form'],
      },
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

    let emails;
    let submitButton;
    let startingButtons = [];

    // Show emails if user clicks "Send consent"
    if (this.state.showEmails) {
      emails = (
        <div>
          <TextboxElement
            name="email1"
            label="Participant email"
            value={this.state.formData.email1}
            required={true}
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name="email2"
            label="Please re-enter participant email"
            value={this.state.formData.email2}
            required={true}
            onUserInput={this.setFormData}
          />
        </div>
      );

      if (this.state.showSend) {
        submitButton = (
          <div>
            <p className="has-error">
              Please Note: By clicking "Send", any email password
              or link that existed previously will be updated for
              this eConsent form.
            </p>
            <ButtonElement
              label={<div>Send</div>}
              buttonClass="btn btn-sm btn-success"
              onUserInput={this.sendConsent}
            />
          </div>
        );
      }
    } else {
      // Show share options to start
      startingButtons.push(
        <div>
          <ButtonElement
            label={<div>Copy Link</div>}
            buttonClass="btn btn-sm btn-primary"
            onUserInput={this.copyLink}
          />
        </div>
      );

      // Add button for sending
      startingButtons.push(
        <div>
          <ButtonElement
            label={<div>Send</div>}
            buttonClass="btn btn-sm btn-primary"
            onUserInput={this.showSend}
          />
        </div>
      );
    }

    return (
      <div>
        <FormElement
          Module="consent"
          name="sendConsent"
          id="sendConsentForm"
          method="POST"
        >
          {startingButtons}
          {emails}
          {submitButton}
        </FormElement>
      </div>
    );
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
   * Copy eConsent form link for user
   */
  copyLink() {
    const el = document.createElement('input');
    el.value = this.props.BaseURL
      + '/consent/consent_page/?key='
      + this.props.data['OneTimeKey'];
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    swal.fire('Success!', 'E-Consent form link copied!', 'success');
  }

  /**
   * Submit form data & send eConsent to participant
   */
  sendConsent() {
    this.props.submitData(
      this.state.formData,
      'Send',
      'E-Consent form sent.'
    );
  }

  /**
   * Display "Send consent" form elements
   */
  showSend() {
    this.setState({
      showEmails: true,
      showSend: true,
    });
  }
}

ShareConsentForm.propTypes = {
  submitData: PropTypes.string.isRequired,
  BaseURL: PropTypes.string.isRequired,
  data: PropTypes.object,
};

export default ShareConsentForm;
