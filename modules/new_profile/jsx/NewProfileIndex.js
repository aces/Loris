import {createRoot} from 'react-dom/client';
import React from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import swal from 'sweetalert2';
import {
  SelectElement,
  DateElement,
  TextboxElement,
  FormElement,
  ButtonElement,
  FieldsetElement,
} from 'jsx/Form';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import hiStrings from '../locale/hi/LC_MESSAGES/new_profile.json';

// Register Hindi translations for this namespace


class NewProfileIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configData: {},
      formData: {},
      isLoaded: false,
      error: false,
      submitDisabled: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
  }

  fetchData() {
    return fetch(this.props.dataURL,
      {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({configData: data.fieldOptions}))
      .catch(() => {
        this.setState({error: true});
      });
  }

  validateMatchDate() {
    let validate = false;
    const formData = this.state.formData;

    if (formData.dobDate !== formData.dobDateConfirm) {
      swal.fire(this.props.t('Error!', {ns: 'loris'}),
        this.props.t('Date of Birth fields must match',
          {ns: 'new_profile'}), 'error');
    } else if (this.state.configData['edc'] === 'true' &&
         (formData.edcDate !== formData.edcDateConfirm)
    ) {
      swal.fire(this.props.t('Error!', {ns: 'loris'}),
        this.props.t('EDC fields must match', {ns: 'new_profile'}), 'error');
    } else {
      validate = true;
    }
    return validate;
  }

  handleSubmit(e) {
    e.preventDefault();
    const match = this.validateMatchDate();
    if (!match) {
      return;
    }
    const formData = this.state.formData;
    const configData = this.state.configData;

    let candidateObject = {
      'Candidate': {
        'Project': formData.project,
        'DoB': formData.dobDate,
        'Sex': formData.sex,
        'Site': configData.site[formData.site],
      },
    };

    if (this.state.configData['edc'] === 'true') {
      candidateObject.Candidate.EDC = formData.edcDate;
    }
    if (this.state.configData['pscidSet'] === 'true') {
      candidateObject.Candidate.PSCID = formData.pscid;
    }

    this.setState({submitDisabled: true});

    fetch(this.props.submitURL, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      body: JSON.stringify(candidateObject),
    })
      .then((resp) => {
        if (resp.ok && resp.status === 201) {
          resp.json().then((data) => {
            swal.fire({
              icon: 'success',
              title: this.props.t('New Candidate Created',
                {ns: 'new_profile'}),
              html: this.props.t('DCCID',
                {ns: 'loris'}) + ': ' + data.CandID + ' '
                  + this.props.t('PSCID',
                    {ns: 'loris'}) + ': ' + data.PSCID + ' ',
              confirmButtonText: this.props.t('Access Profile',
                {ns: 'new_profile'}),
              showCancelButton: true,
              cancelButtonColor: '#3085d6',
              cancelButtonText: this.props.t('Recruit another candidate',
                {ns: 'new_profile'}),
            }).then((result) => {
              window.location.href = result.value === true
                ? '/' + data.CandID
                : window.location.href;
            });
          })
            .catch((error) => {
              swal.fire({
                icon: 'error',
                title: this.props.t('Error!', {ns: 'loris'}),
                text: error,
              });
              console.error(error);
            });
        } else {
          resp.json().then((message) => {
            this.setState({submitDisabled: false});
            swal.fire(this.props.t('Error!',
              {ns: 'loris'}), message.error, 'error');
          }).catch((error) => {
            swal.fire({
              icon: 'error',
              title: this.props.t('Error!', {ns: 'loris'}),
              text: error,
            });
            console.error(error);
          });
        }
      })
      .catch((error) => {
        swal.fire({
          icon: 'error',
          title: this.props.t('Error!', {ns: 'loris'}),
          text: error,
        });
        console.error(error);
      });
  }

  setFormData(formElement, value) {
    let formData = Object.assign({}, this.state.formData);
    formData[formElement] = value;

    this.setState({formData: formData});
  }

  render() {
    if (this.state.error) {
      return <h3>{this.props.t('An error occured while loading the page.',
        {ns: 'loris'})}</h3>;
    }

    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    let edc = null;
    let pscid = null;
    let site = null;
    let minYear = this.state.configData.minYear;
    let thisYear = (new Date()).getFullYear();
    let dobMaxYear = this.state.configData.maxYear;
    if (!(dobMaxYear) || (dobMaxYear > thisYear)) {
      dobMaxYear = thisYear;
    }
    let dateFormat = this.state.configData.dobFormat;
    let requireBirthDate = true;

    if (this.state.configData['edc'] === 'true') {
      requireBirthDate = false;
      edc =
        <div>
          <DateElement
            name = "edcDate"
            label = {this.props.t('Expected Date of Confinement',
              {ns: 'new_profile'})}
            minYear = {minYear}
            maxYear = {this.state.configData.maxYear}
            dateFormat = {dateFormat}
            onUserInput = {this.setFormData}
            value = {this.state.formData.edcDate}
            required = {true}
          />
          <DateElement
            name = "edcDateConfirm"
            label = {this.props.t('Confirm EDC', {ns: 'new_profile'})}
            minYear = {minYear}
            maxYear = {this.state.configData.maxYear}
            dateFormat = {dateFormat}
            onUserInput = {this.setFormData}
            value = {this.state.formData.edcDateConfirm}
            required = {true}
          />
        </div>;
    }
    if (this.state.configData['pscidSet'] === 'true') {
      pscid =
        <TextboxElement
          name = "pscid"
          label = {this.props.t('PSCID', {ns: 'loris'})}
          onUserInput = {this.setFormData}
          value = {this.state.formData.pscid}
          required = {true}
        />;
    }
    if (this.state.configData.site && this.state.configData.site.length !== 0) {
      site =
        <SelectElement
          name = "site"
          label = {this.props.t('Site', {ns: 'loris'})}
          options = {this.state.configData.site}
          onUserInput = {this.setFormData}
          value = {this.state.formData.site}
          required = {true}
        />;
    }
    const fields = [
      {
        label: this.props.t('Date of Birth', {ns: 'loris'}),
        element: (
          <DateElement
            name = "dobDate"
            label = {this.props.t('Date of Birth', {ns: 'loris'})}
            minYear = {minYear}
            maxYear = {dobMaxYear}
            dateFormat = {dateFormat}
            onUserInput = {this.setFormData}
            value = {this.state.formData.dobDate}
            required = {requireBirthDate}
          />
        ),
      },
      {
        label: this.props.t('Date of Birth Confirm', {ns: 'new_profile'}),
        element: (
          <DateElement
            name = "dobDateConfirm"
              {ns: 'new_profile'}) + '*'}
            onUserInput = {this.setFormData}
            value = {this.state.formData.dobDateConfirm}
            required = {requireBirthDate}
          />
        ),
      },
      {
        label: this.props.t('Sex', {ns: 'loris'}) ,
        element: (
          <SelectElement
            name = "sex"
            label = {this.props.t('Sex', {ns: 'loris'})}
            options = {this.state.configData.project}
            onUserInput = {this.setFormData}
            value = {this.state.formData.project}
            required = {true}
          />
        ),
      },
      {
        label: this.props.t('PSCID', {ns: 'loris'}),
        element: pscid,
      },
      {
        label: this.props.t('Expected Date of Confinement',
          {ns: 'new_profile'}),
        element: edc,
      },
    ];

    return (
      <FieldsetElement legend=
        {this.props.t('Create a New Profile', {ns: 'new_profile'})}>
        <FormElement
          name = "newProfileForm"
          onSubmit = {this.handleSubmit}
        >
          {fields.map((field, idx) => field.element)}
          <ButtonElement
            name = "fire_away"
            label = {this.props.t('Create', {ns: 'loris'})}
            id = "button"
            type = "submit"
            disabled={this.state.submitDisabled}
          />
        </FormElement>
      </FieldsetElement>
    );
  }
}

NewProfileIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  submitURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('hi', 'new_profile', hiStrings);

  const NPIndex = withTranslation(['new_profile'])(NewProfileIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <NPIndex
      dataURL = {`${loris.BaseURL}/new_profile/?format=json`}
      submitURL = {`${loris.BaseURL}/api/v0.0.3/candidates/`}
      hasPermission = {loris.userHasPermission}
    />
  );
});

export default withTranslation(['new_profile'])(NewProfileIndex);
