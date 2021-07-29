import React, {Component} from 'react';
import swal from 'sweetalert2';
import Loader from 'jsx/Loader';
import PropTypes from 'prop-types';
import Modal from 'jsx/Modal';

/**
 * Data Request Form
 *
 * Create a data request form
 *
 * @author  Laetitia Fesselier
 * @version 1.0.0
 * */
class DataRequest extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      configData: {},
      formData: {
        coinvestigators: [],
      },
      isLoaded: false,
      isCreated: false,
      error: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.addInvestigator = this.addInvestigator.bind(this);
    this.removeInvestigator = this.removeInvestigator.bind(this);
    this.updateInvestigator = this.updateInvestigator.bind(this);
  }

  /**
   * ComponentDidMount
   */
  componentDidMount() {
    this.addInvestigator();
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Remove an investigator entry to the form
   *
   * @param {Number} idx - index of the investigator to delete
   *
   * @return {function}
   */
  removeInvestigator(idx) {
    return () => {
      this.setFormData(
        'coinvestigators',
        this.state.formData.coinvestigators.filter((s, _idx) => _idx !== idx)
      );
    };
  }

  /**
   * Add an investigator entry to the form
   */
  addInvestigator() {
    this.setFormData(
      'coinvestigators',
      [
        ...this.state.formData.coinvestigators,
        {name: '', email: '', institution: ''},
      ]
    );
  }

  /**
   * Update an investigator entry
   *
   * @param {Number} index - index of the investigator to update
   * @param {string} key - the investigator key to update
   *
   * @return {function}
   */
  updateInvestigator(index, key) {
    return (evt) => {
      this.setFormData(
        'coinvestigators',
        this.state.formData.coinvestigators.map((investigator, _idx) => {
          if (_idx !== index) return investigator;
          // this is gonna create a new object, that has the fields from
          // `s`, and `name` set to `newName`
          return {...investigator, [key]: evt.target.value};
        }),
      );
    };
  }

  /**
   * Retrieve data from the provided URL and save it in state
   *
   * @return {object}
   */
  fetchData() {
    return fetch(this.props.dataURL,
      {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({configData: data.fieldOptions}))
      .catch((error) => {
        this.setState({error: true});
      });
  }

  /**
   * Set the form data based on state values of child elements/components
   *
   * @param {string} formElement - name of the selected element
   * @param {*} value - selected value for corresponding form element
   */
  setFormData(formElement, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[formElement] = value;
    this.setState({formData: formData});
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    let formData = {...this.state.configData, ...this.state.formData};
    let formObject = new FormData();

    for (let key in formData) {
      if (formData.hasOwnProperty(key) && formData[key] !== '') {
        let value = formData[key];
        if (key === 'coinvestigators') {
          value = value.filter((s, _idx) => {
            return s.name !== '' || s.email !== '' || s.institution !== '';
          });
          if (value.length == 0) continue;
          value = JSON.stringify(value);
        }
        formObject.append(key, value);
      }
    }

    formObject.set('fire_away', 'New Data Request');

    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: formObject,
    })
    .then((resp) => {
      if (resp.ok && resp.status === 201) {
        this.setState({isCreated: true});
      } else {
        resp.json().then((message) => {
          swal('Error!', message, 'error');
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (!this.props.show) return null;

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    let msg = null;
    // If error occurs, return a message.
    if (this.state.error) {
      msg = 'An error occured while loading the form.';
    }
    if (this.state.isCreated) {
      msg = 'Your request is created, we will contact you shortly.';
    }

    return (
      <Modal
        title='Controlled Data / Bio-specimen Request'
        onClose={this.props.onClose}
        show={this.props.show}
      >
        <div className="data-request">
          { msg &&
            (<div className="alert alert-warning">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-hidden="true"
              >×</button>
              <span className="glyphicon glyphicon-ok"></span>
              {msg}
            </div>)
          }
          <FormElement
            name="dataRequestForm"
            onSubmit={this.handleSubmit}
            fileUpload='true'
          >
            <TextboxElement
              name='email'
              label='Email:'
              disabled='true'
              required='true'
              value={this.state.configData.email}
            />

            <div className="form-group">
              <div className="col-sm-offset-3">
                <p className="col-sm-12">
                  To update your email, you can edit
                  <a href="/user_accounts/my_preferences/">your account</a>.
                </p>
              </div>
            </div>

            <input name='userID' type='hidden'
                   value={this.state.configData.userID}/>

            <TextboxElement
              name="institution"
              label="Institution:"
              required='true'
              onUserInput={this.setFormData}
              value={this.state.formData.institution}
            />

            <div className="row">
              <label className="col-sm-3 control-label">
                Co-investigator(s):
              </label>
              <div className='col-sm-9 investigators'>
                {this.state.formData.coinvestigators.map(
                  (investigator, idx) => (
                  <div className="form-group investigator"
                       key={'investigator-' + idx}>
                    <div className="col-sm-3">
                      <small className="label">Name</small>
                      <input
                        type="text"
                        value={investigator.name}
                        className="form-control"
                        onChange={this.updateInvestigator(idx, 'name')}
                      />
                    </div>

                    <div className="col-sm-3">
                      <small className="label">Institution</small>
                      <input
                        type="text"
                        value={investigator.institution}
                        className="form-control"
                        onChange={this.updateInvestigator(
                          idx, 'institution'
                        )}
                      />
                    </div>

                    <div className="col-sm-3">
                      <small className="label">Email</small>
                      <input
                        type="text"
                        value={investigator.email}
                        className="form-control"
                        onChange={this.updateInvestigator(idx, 'email')}

                      />
                    </div>

                    <div className="col-sm-3">
                      {(this.state.formData.coinvestigators.length > 1)
                        &&
                        (<button
                          className="btn btn-danger"
                          type="button"
                          onClick={this.removeInvestigator(idx)}
                      >
                        <span className="glyphicon glyphicon-minus"></span>
                      </button>)
                    }
                    {(idx == this.state.formData.coinvestigators.length-1)
                      &&
                      (<button
                        className="btn btn-success"
                        type="button"
                        onClick={this.addInvestigator}
                      >
                        <span className="glyphicon glyphicon-plus"></span>
                      </button>)
                    }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <div className="col-sm-offset-3">
                <p className="col-sm-12">
                  Please list all co-investigators&nbsp;
                  who will be using the requested materials and/or data.
                </p>
              </div>
            </div>

            <TextboxElement
              name="researchTitle"
              required='true'
              label="Title of research:"
              onUserInput={this.setFormData}
              value={this.state.formData.researchTitle}
            />

            <TextareaElement
              label='Summary of proposed research:'
              name='researchSummary'
              onUserInput={this.setFormData}
              value={this.state.formData.researchSummary}
            />

            <div className="form-group checkboxes">
              <CheckboxElement
                value={this.state.formData.requiresEthicsApproval}
                name='requiresEthicsApproval'
                onUserInput={this.setFormData}
                label={'Does your work require ' +
                'Research Ethics Board (REB/IRB) Approval?'}
              />
            </div>

            <div className="form-group"
                 style={{display: this.state.formData.requiresEthicsApproval
                     ? 'block'
                     : 'none',
                   marginBottom: 0}}>
              <div className="form-group-inline">
                <label className="col-sm-3 control-label">
                  Research Ethics Board:
                </label>
              </div>

              <div className="form-group-inline top-label">
                <div className="col-sm-4">
                  <TextboxElement
                    name="rebName"
                    label="Name"
                    required={this.state.formData.requiresEthicsApproval}
                    onUserInput={this.setFormData}
                    value={this.state.formData.rebName}
                  />
                </div>
              </div>

              <div className="form-group-inline top-label">
                <div className="col-sm-4">
                  <TextboxElement
                    name="rebLocation"
                    label="Location"
                    required={this.state.formData.requiresEthicsApproval}
                    onUserInput={this.setFormData}
                    value={this.state.formData.rebLocation}
                  />
                </div>
              </div>
            </div>

            <div className="form-group checkboxes"
                 style={{display: this.state.formData.requiresEthicsApproval
                     ? 'block'
                     : 'none'}}>
              <CheckboxElement
                value={this.state.formData.ethicsApprovalReceived}
                name='ethicsApprovalReceived'
                onUserInput={this.setFormData}
                label='Have you already obtained approval?'
              />
            </div>

            <div style={{display: this.state.formData.ethicsApprovalReceived
                ? 'block'
                : 'none'}}>
              <FileElement
                label='Approval letter (.pdf)'
                name='approvalLetter'
                required={this.state.formData.ethicsApprovalReceived}
                onUserInput={this.setFormData}
                value={this.state.formData.approvalLetter}
              />
            </div>

            <TextareaElement
              label='Materials requested:'
              name='materialsRequested'
              required='true'
              onUserInput={this.setFormData}
              value={this.state.formData.materialsRequested}
            />

            <div className="form-group checkboxes">
              <CheckboxElement
                value={this.state.formData.consent}
                name='consent'
                onUserInput={this.setFormData}
                label={['I consent to the ',
                  <a key='btnShowTerms' href='#' className='btnShowTerms'>
                    Terms of use
                  </a>]}
              />
            </div>

            <ButtonElement
              name="fire_away"
              label="Submit"
              id="button"
              type="submit"
              disabled={!this.state.formData.consent || this.state.isCreated}
            />
          </FormElement>
        </div>
      </Modal>
    );
  }
}

DataRequest.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

DataRequest.defaultProps = {
  dataURL: loris.BaseURL + '/dqt/data_request/?format=json',
  submitURL: loris.BaseURL + '/dqt/data_request/',
};

export default DataRequest;
