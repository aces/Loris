/**
 * Add Consent form
 * Renders form to add a consent row
 *
 * @author Camille Beaudoin
 *
 * */
import React, {Component} from 'react';
import Modal from 'Modal';

/**
 * Add Consent Form
 *
 * Component for form adding consent to DB
 *
 * @author Camille Beaudoin
 */
class AddConsentForm extends Component {
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
        email1: null,
        email2: null,
        consent_group: null,
        eConsent: false,
        centerID: null,
      },
    };

    this.setFormData = this.setFormData.bind(this);
    this.createConsent = this.createConsent.bind(this);
    this.createSendConsent = this.createSendConsent.bind(this);
    this.close = this.close.bind(this);
    this.clear = this.clear.bind(this);
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
   * Submit the formdata to add consent row
   */
  createConsent() {
    this.props.submitData(
      this.state.formData,
      'Create',
      'Consent created.',
      this.clear
    );
  }

  /**
   * Submit the formdata to add consent row and send
   */
  createSendConsent() {
    this.props.submitData(
      this.state.formData,
      'CreateSend',
      'Consent created and sent.',
      this.clear
    );
  }

  /**
   * Close modal window and reset formData
   */
  close() {
    this.props.closeAddForm();
    this.clear();
  }

  /**
   * Reset blank formData
   */
  clear() {
    this.setState({formData: {}});
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

    // When candidate & consent group are entered
    // Check if eConsent compatible
    let eConsentAvailable = false;
    if (this.state.formData['candID'] && this.state.formData['consent_group']) {
      eConsentAvailable = this.props.eConsentCompatible(
        this.state.formData.consent_group,
        this.state.formData['candID']
      );
    }

    // Add eConsent checkbox if eConsent compatible
    const eConsentOption = eConsentAvailable ? (
      <div>
        <CheckboxElement
          name="eConsent"
          label="Add as eConsent?"
          id="eConsent"
          value={this.state.formData.eConsent}
          onUserInput={this.setFormData}
        />
        <br/><br/>
      </div>
    ) : null;

    // Add email fields and send button if eConsent selected
    const email1 = this.state.formData.eConsent ? (
      <TextboxElement
        name="email1"
        label="Participant email"
        value={this.state.formData.email1}
        required={false}
        onUserInput={this.setFormData}
      />
    ) : null;
    const email2 = this.state.formData.eConsent ? (
      <TextboxElement
        name="email2"
        label="Please re-enter participant email"
        value={this.state.formData.email2}
        required={false}
        onUserInput={this.setFormData}
      />
    ) : null;
    const sendButton = this.state.formData.eConsent ? (
      <ButtonElement
        name="fire_away"
        label={
          <div>
            <span className="glyphicon glyphicon-envelope"/> Send
          </div>
        }
        type="submit"
        buttonClass="btn btn-sm btn-success"
        onUserInput={this.createSendConsent}
      />
    ) : null;

    return (
      <Modal
        title='Add Consent'
        onClose={this.close}
        show={this.props.openAddConsent}
      >
        <FormElement
          Module="consent"
          name="addConsent"
          id="addConsentForm"
          method="POST"
        >
          <TextboxElement
            name="candID"
            label="CandID"
            value={this.state.formData.candID}
            required={true}
            onUserInput={this.setFormData}
          />
          <TextboxElement
            name="pscid"
            label="PSCID"
            value={this.state.formData.pscid}
            required={true}
            onUserInput={this.setFormData}
          />
          <SelectElement
            name="consent_group"
            options={this.props.data.fieldOptions.consentGroupOptions}
            label="Consent Form"
            value={this.state.formData.consent_group}
            required={true}
            onUserInput={this.setFormData}
          />
          {eConsentOption}
          {email1}
          {email2}
          <ButtonElement
            name="fire_away"
            label={
              <div>
                <span className="glyphicon glyphicon-plus"/> Create
              </div>
            }
            type="submit"
            buttonClass="btn btn-sm btn-success"
            onUserInput={this.createConsent}
          />
          {sendButton}
        </FormElement>
      </Modal>
    );
  }
}

export default AddConsentForm;
