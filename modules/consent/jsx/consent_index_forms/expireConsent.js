/**
 * Expire Consent form
 *
 * Renders form for deleting expired consents /
 * setting participant to inactive
 *
 * @author Camille Beaudoin
 *
 * */
import React, {Component} from 'react';
import {
  FormElement,
  ButtonElement,
} from 'jsx/Form';

/**
 * Expire Consent Form
 *
 * Component for form expiring eConsent row
 *
 * @author Camille Beaudoin
 */
class ExpireConsentForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      formData: {
        pscid: null,
        candID: null,
        consent_group: null,
      },
    };

    this.expireConsent = this.expireConsent.bind(this);
    this.expireAndInactivate = this.expireAndInactivate.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.setState({
      isLoaded: true,
      formData: {
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

    return (
      <div>
        <FormElement
          Module="consent"
          name="sendConsent"
          id="sendConsentForm"
          method="POST"
        >
          <p>
            To set the eConsent form <b>{this.state.formData.consent_group} </b>
             to expired for <b>{this.state.formData.pscid}</b>, please click
             "Expire". If you also wish to set the participant to inactive,
             please click "Expire and Inactivate".
          </p>
          <ButtonElement
            label={<div>Expire</div>}
            buttonClass="btn btn-sm btn-primary"
            onUserInput={this.expireConsent}
          />
          <ButtonElement
            label={<div>Expire and Inactivate</div>}
            buttonClass="btn btn-sm btn-primary"
            onUserInput={this.expireAndInactivate}
          />
        </FormElement>
      </div>
    );
  }

  /**
   * Submit data to be expired
   */
  expireConsent() {
    this.props.submitData(
      this.state.formData,
      'Expire',
      'E-Consent form set to "expired"'
    );
  }

  /**
   * Submit data to be expired and inactivated
   */
  expireAndInactivate() {
    this.props.submitData(
      this.state.formData,
      'ExpireAndInactivate',
      'E-Consent form set to "expired" and candidate inactivated'
    );
  }
}

ExpireConsentForm.propTypes = {
  submitData: PropTypes.string.isRequired,
  data: PropTypes.object,
};

export default ExpireConsentForm;
