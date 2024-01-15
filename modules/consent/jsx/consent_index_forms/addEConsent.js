/**
 * Add eConsent form
 * Renders the form to add consent as eConsent
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
 * Add eConsent Form
 *
 * Component for form creating eConsent row
 *
 * @author Camille Beaudoin
 */
class AddEConsentForm extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
    };

    this.addEConsent = this.addEConsent.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.setState({
      isLoaded: true,
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
          <div>
            Please click below to add '{this.props.data['Consent Form']}'
            for candidate {this.props.data['PSCID']} as an eConsent form
          </div>
          <br/><br/>
          <ButtonElement
            label={
              <div>
                Add as eConsent
              </div>
            }
            buttonClass="btn btn-sm btn-success"
            onUserInput={this.addEConsent}
          />
        </FormElement>
      </div>
    );
  }

  /**
   * Submit for eConsent to be added
   */
  addEConsent() {
    let sendData = [];
    sendData['pscid'] = this.props.data['PSCID'];
    sendData['candID'] = this.props.data['CandID'];
    sendData['consent_group'] = this.props.data['Consent Form'];

    this.props.submitData(
      sendData,
      'CreateEConsent',
      'Form added as eConsent'
    );
  }
}

AddEConsentForm.propTypes = {
  submitData: PropTypes.string.isRequired,
  data: PropTypes.object,
};

export default AddEConsentForm;
