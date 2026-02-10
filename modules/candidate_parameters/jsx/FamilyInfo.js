import React, {Component} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import 'I18nSetup';
import {
  FormElement,
  StaticElement,
  ButtonElement,
  SelectElement,
} from 'jsx/Form';
import CandidateParametersClient from './CandidateParametersClient';

/**
 * Family info component
 */
class FamilyInfo extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      formData: {},
      familyMembers: [],
      updateResult: null,
      errorMessage: null,
      isLoaded: false,
      loadedData: 0,
    };
    this.client = new CandidateParametersClient();
    this.setFormData = this.setFormData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.deleteFamilyMember = this.deleteFamilyMember.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  /**
   * Fetch data
   */
  fetchData() {
    const {t} = this.props;
    this.client.getJSON(this.props.dataURL)
      .then((data) => {
        this.setState({
          Data: data,
          isLoaded: true,
          familyMembers: data.existingFamilyMembers,
        });
      })
      .catch(() => {
        this.setState({
          error: t('An error occurred when loading the form!',
            {ns: 'candidate_parameters'}
          ),
        });
      });
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Set form data
   *
   * @param {string} formElement
   * @param {*} value
   */
  setFormData(formElement, value) {
    let formData = this.state.formData;
    formData[formElement] = value;
    this.setState({
      formData: formData,
    });
  }

  /**
   * On submit
   *
   * @param {object} e - Event object
   */
  onSubmit(e) {
    e.preventDefault();
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    const {t} = this.props;
    if (!this.state.isLoaded) {
      if (this.state.error !== undefined) {
        return (
          <div className="alert alert-danger text-center">
            <strong>
              {this.state.error}
            </strong>
          </div>
        );
      }

      return (
        <button className="btn-info has-spinner">
          Loading
          <span
            className="glyphicon glyphicon-refresh glyphicon-refresh-animate"
          >
          </span>
        </button>
      );
    }
    let relationshipOptions = {
      'full_sibling': t('Full Sibling', {ns: 'candidate_parameters'}),
      'half_sibling': t('Half Sibling', {ns: 'candidate_parameters'}),
      '1st_cousin': t('First Cousin', {ns: 'candidate_parameters'}),
    };

    let disabled = true;
    let addButton = null;
    if (loris.userHasPermission('candidate_parameter_edit')) {
      disabled = false;
      addButton =
        <ButtonElement label={t('Add', {ns: 'candidate_parameters'})}/>;
    }

    let candidateList = this.state.Data.candidates;

    let familyMembers = this.state.familyMembers;
    let familyMembersHTML = [];

    for (let key in familyMembers) {
      if (familyMembers.hasOwnProperty(key)) {
        let candID = familyMembers[key].FamilyCandID;
        let relationship = familyMembers[key].Relationship_type;
        let link = '?candID=' + candID + '&identifier=' + candID;

        familyMembersHTML.push(
          <div key={key}>
            <StaticElement
              label={
                t('Family Member ID (DCCID)', {ns: 'candidate_parameters'})
              }
              text={<a href={link}>{candID}</a>}
            />
            <StaticElement
              label={t('Relation Type', {ns: 'candidate_parameters'})}
              text={relationshipOptions[relationship]}
            />

            <ButtonElement
              label={t('Delete', {ns: 'candidate_parameters'})}
              type="button"
              onUserInput={this.deleteFamilyMember.bind(
                null,
                candID,
                key,
                candidateList
              )}
            />
            <hr/>
          </div>
        );
        // remove from list of candidates because it can only be added once
        delete candidateList[candID];
      }
    }

    let alertMessage = '';
    let alertClass = 'alert text-center hide';
    if (this.state.updateResult) {
      if (this.state.updateResult === 'success') {
        alertClass = 'alert alert-success text-center';
        alertMessage = t('Update Successful!', {ns: 'candidate_parameters'});
      } else if (this.state.updateResult === 'error') {
        let errorMessage = this.state.errorMessage;
        alertClass = 'alert alert-danger text-center';
        alertMessage = errorMessage ? errorMessage :
          t('Failed to update!', {ns: 'candidate_parameters'});
      }
    }

    return (
      <div className="row">
        <div className={alertClass} role="alert" ref="alert-message">
          {alertMessage}
        </div>
        <FormElement
          name="familyInfo"
          onSubmit={this.handleSubmit}
          ref="form"
          class="col-md-6"
        >
          <StaticElement
            label={t('PSCID', {ns: 'loris'})}
            text={this.state.Data.pscid}
          />
          <StaticElement
            label={t('DCCID', {ns: 'loris'})}
            text={this.state.Data.candID}
          />
          <hr/>
          {familyMembersHTML}
          <SelectElement
            label={t('Family Member ID (DCCID)', {ns: 'candidate_parameters'})}
            name="FamilyCandID"
            options={candidateList}
            onUserInput={this.setFormData}
            ref="FamilyCandID"
            disabled={disabled}
            required={true}
            value={this.state.formData.FamilyCandID}
          />
          <SelectElement
            label={t('Relation Type', {ns: 'candidate_parameters'})}
            name="Relationship_type"
            options={relationshipOptions}
            onUserInput={this.setFormData}
            ref="Relationship_type"
            disabled={disabled}
            required={true}
            value={this.state.formData.Relationship_type}
          />
          {addButton}
        </FormElement>
      </div>
    );
  }

  /**
   * Handles form submission
   *
   * @param {event} e - Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    let myFormData = this.state.formData;
    let self = this;
    let formData = new FormData();
    let formRefs = this.refs;

    let familyMembers = this.state.familyMembers;
    let familyMember = {};

    for (let key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== '') {
          familyMember[key] = myFormData[key];
          formData.append(key, myFormData[key]);
        }
      }
    }
    formData.append('tab', this.props.tabName);
    formData.append('candID', this.state.Data.candID);

    familyMembers.push(familyMember);

    this.setState({
      familyMembers: familyMembers,
    });

    this.client.postForm(this.props.action, formData)
      .then(() => {
        self.setState({
          updateResult: 'success',
          formData: {},
        });
        self.showAlertMessage();

        // Iterates through child components and resets state
        // to initial state in order to clear the form
        Object.keys(formRefs).map(function(ref) {
          if (formRefs[ref].state && formRefs[ref].state.value) {
            formRefs[ref].state.value = '';
          }
        });
        // rerender components
        self.forceUpdate();
      })
      .catch(async (err) => {
        let errorMessage = '';
        if (err && err.response) {
          try {
            const text = await err.response.text();
            if (text) {
              errorMessage = JSON.parse(text).message || '';
            }
          } catch (parseError) {
            errorMessage = '';
          }
        }
        self.setState(
          {
            updateResult: 'error',
            errorMessage: errorMessage,
          }
        );
        self.showAlertMessage();
      });
  }

  /**
   * Display a success/error alert message after form submission
   */
  showAlertMessage() {
    let self = this;
    if (this.refs['alert-message'] === null) {
      return;
    }

    let alertMsg = this.refs['alert-message'];
    $(alertMsg).fadeTo(2000, 500).delay(3000).slideUp(
      500,
      function() {
        self.setState(
          {
            updateResult: null,
          }
        );
      }
    );
  }

  /**
   * Delete family member
   *
   * @param {*} candID
   * @param {*} key
   * @param {*} candidateList
   */
  deleteFamilyMember(candID, key, candidateList) {
    let familyMembers = this.state.familyMembers;
    delete familyMembers[key];

    // readd to list of possible family members
    candidateList[candID] = candID;

    this.setState({
      familyMembers: familyMembers,
    });

    let myFormData = this.state.formData;
    let self = this;
    let formData = new FormData();
    for (let key in myFormData) {
      if (myFormData.hasOwnProperty(key)) {
        if (myFormData[key] !== '') {
          formData.append(key, myFormData[key]);
        }
      }
    }
    formData.append('tab', 'deleteFamilyMember');
    formData.append('candID', this.state.Data.candID);
    formData.append('familyDCCID', candID);

    this.client.postForm(this.props.action, formData)
      .then(() => {
        self.setState(
          {
            updateResult: 'success',
          });
        self.showAlertMessage();
      })
      .catch(async (err) => {
        let errorMessage = '';
        if (err && err.response) {
          try {
            const text = await err.response.text();
            if (text) {
              errorMessage = JSON.parse(text).message || '';
            }
          } catch (parseError) {
            errorMessage = '';
          }
        }
        if (errorMessage !== '') {
          self.setState(
            {
              updateResult: 'error',
              errorMessage: errorMessage,
            });
          self.showAlertMessage();
        }
      });
  }
}
FamilyInfo.propTypes = {
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
  candID: PropTypes.string,
  action: PropTypes.string,
  t: PropTypes.string.isRequired,
};

export default withTranslation(['candidate_parameters', 'loris'])(FamilyInfo);
