import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import swal from 'sweetalert2';
import Loader from 'Loader';
import Panel from 'Panel';
import FilterableDataTable from 'FilterableDataTable';
import lorisFetch from 'jslib/lorisFetch';

/**
 * Policy Tracker admin page.
 */
class PolicyTrackerIndex extends Component {
  /**
   * @param {object} props - React props.
   */
  constructor(props) {
    super(props);
    this.state = {
      decisions: {Data: [], fieldOptions: {}},
      options: {
        modules: [],
        policies: [],
        languages: [],
        translations: [],
      },
      versionForm: {},
      translationForm: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleVersionChange = this.handleVersionChange.bind(this);
    this.handleTranslationChange = this.handleTranslationChange.bind(this);
    this.saveNewVersion = this.saveNewVersion.bind(this);
    this.saveTranslation = this.saveTranslation.bind(this);
    this.selectPolicy = this.selectPolicy.bind(this);
    this.selectTranslation = this.selectTranslation.bind(this);
  }

  /**
   * Load page data.
   */
  componentDidMount() {
    this.fetchData();
  }

  /**
   * Fetch JSON from a policy tracker endpoint.
   *
   * @param {string} path - Endpoint path.
   * @param {object} options - Fetch options.
   * @return {Promise<object>}
   */
  requestJSON(path, options = {}) {
    return lorisFetch(`${this.props.baseURL}/policy_tracker/${path}`, {
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'},
      ...options,
    }).then((response) => response.text().then((text) => {
      let json = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch (error) {
        json = {error: response.statusText};
      }
      if (!response.ok) {
        throw new Error(json.error || json.message || response.statusText);
      }
      return json;
    }));
  }

  /**
   * Fetch table rows and policy editor options.
   */
  fetchData() {
    Promise.all([
      this.requestJSON('decisions'),
      this.requestJSON('options'),
    ]).then(([decisions, options]) => {
      this.setState({
        decisions: {
          ...decisions,
          Data: decisions.Data.map((row) => [
            row.ID,
            row.Username,
            row.User,
            row.Policy,
            row.Version,
            row.Module,
            row.Decision,
            row['Decision Date'],
          ]),
        },
        options,
        versionForm: this.getVersionForm(options.policies[0]),
        translationForm: this.getTranslationForm(
          options.policies[0],
          options.languages[0]
        ),
        error: false,
        isLoaded: true,
      });
    }).catch((error) => {
      this.setState({error: true, isLoaded: true});
      console.error(error);
    });
  }

  /**
   * Build a create-version form state from a source policy.
   *
   * @param {object} policy - Policy row.
   * @return {object}
   */
  getVersionForm(policy) {
    if (!policy) {
      return {};
    }
    return {
      PolicyID: policy.PolicyID,
      Name: policy.Name,
      ModuleID: policy.ModuleID,
      PolicyRenewalTime: policy.PolicyRenewalTime,
      PolicyRenewalTimeUnit: policy.PolicyRenewalTimeUnit,
      HeaderButton: policy.HeaderButton,
      HeaderButtonText: policy.HeaderButtonText,
      Active: policy.Active,
      SwalTitle: policy.SwalTitle,
      AcceptButtonText: policy.AcceptButtonText,
      DeclineButtonText: policy.DeclineButtonText,
      Content: policy.Content,
    };
  }

  /**
   * Build a translation form state from policy and language rows.
   *
   * @param {object} policy - Policy row.
   * @param {object} language - Language row.
   * @return {object}
   */
  getTranslationForm(policy, language) {
    if (!policy || !language) {
      return {};
    }
    const translation = this.state.options.translations.find((row) => {
      return parseInt(row.PolicyID) === parseInt(policy.PolicyID) &&
        parseInt(row.LanguageID) === parseInt(language.language_id);
    }) || {};

    return {
      PolicyID: policy.PolicyID,
      LanguageID: language.language_id,
      Content: translation.Content || policy.Content,
      SwalTitle: translation.SwalTitle || policy.SwalTitle,
      HeaderButtonText: translation.HeaderButtonText ||
        policy.HeaderButtonText,
      AcceptButtonText: translation.AcceptButtonText ||
        policy.AcceptButtonText,
      DeclineButtonText: translation.DeclineButtonText ||
        policy.DeclineButtonText,
    };
  }

  /**
   * Convert a list of rows into select options.
   *
   * @param {array} rows - Row list.
   * @param {string} valueField - Value field name.
   * @param {string} labelField - Label field name.
   * @return {object}
   */
  toOptions(rows, valueField, labelField) {
    return rows.reduce((options, row) => {
      options[row[valueField]] = row[labelField];
      return options;
    }, {});
  }

  /**
   * Convert policy rows into select options.
   *
   * @param {array} policies - Policy rows.
   * @return {object}
   */
  policyOptions(policies) {
    return policies.reduce((options, policy) => {
      options[policy.PolicyID] = `${policy.Name} v${policy.Version}` +
        ` (${policy.ModuleName})`;
      return options;
    }, {});
  }

  /**
   * Handle create-version form changes.
   *
   * @param {object} event - Change event.
   */
  handleVersionChange(event) {
    const {name, value} = event.target;
    this.setState((state) => ({
      versionForm: {...state.versionForm, [name]: value},
    }));
  }

  /**
   * Handle translation form changes.
   *
   * @param {object} event - Change event.
   */
  handleTranslationChange(event) {
    const {name, value} = event.target;
    this.setState((state) => ({
      translationForm: {...state.translationForm, [name]: value},
    }));
  }

  /**
   * Change the source policy used by the create-version form.
   *
   * @param {object} event - Change event.
   */
  selectPolicy(event) {
    const policy = this.state.options.policies.find((row) => {
      return parseInt(row.PolicyID) === parseInt(event.target.value);
    });
    this.setState({versionForm: this.getVersionForm(policy)});
  }

  /**
   * Change the policy or language used by the translation form.
   *
   * @param {object} event - Change event.
   */
  selectTranslation(event) {
    const form = {
      ...this.state.translationForm,
      [event.target.name]: event.target.value,
    };
    const policy = this.state.options.policies.find((row) => {
      return parseInt(row.PolicyID) === parseInt(form.PolicyID);
    });
    const language = this.state.options.languages.find((row) => {
      return parseInt(row.language_id) === parseInt(form.LanguageID);
    });
    this.setState({
      translationForm: this.getTranslationForm(policy, language),
    });
  }

  /**
   * Save a new policy version.
   *
   * @param {object} event - Submit event.
   */
  saveNewVersion(event) {
    event.preventDefault();
    this.requestJSON('new-version', {
      method: 'POST',
      body: JSON.stringify(this.state.versionForm),
    }).then(() => {
      swal.fire(
        this.props.t('Saved', {ns: 'loris'}),
        this.props.t('Policy version created', {ns: 'policy_tracker'}),
        'success'
      );
      this.fetchData();
    }).catch((error) => {
      swal.fire(
        this.props.t('Error', {ns: 'loris'}),
        error.message,
        'error'
      );
    });
  }

  /**
   * Save translated policy text.
   *
   * @param {object} event - Submit event.
   */
  saveTranslation(event) {
    event.preventDefault();
    this.requestJSON('translation', {
      method: 'POST',
      body: JSON.stringify(this.state.translationForm),
    }).then(() => {
      swal.fire(
        this.props.t('Saved', {ns: 'loris'}),
        this.props.t('Policy translation saved', {ns: 'policy_tracker'}),
        'success'
      );
      this.fetchData();
    }).catch((error) => {
      swal.fire(
        this.props.t('Error', {ns: 'loris'}),
        error.message,
        'error'
      );
    });
  }

  /**
   * Render a select input.
   *
   * @param {string} name - Field name.
   * @param {string} label - Field label.
   * @param {object} options - Select options.
   * @param {string|number} value - Selected value.
   * @param {Function} onChange - Change handler.
   * @return {React.ReactNode}
   */
  renderSelect(name, label, options, value, onChange) {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={name}>
          {label}
        </label>
        <div className="col-sm-9">
          <select
            className="form-control"
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
          >
            {Object.keys(options).map((key) => (
              <option key={key} value={key}>{options[key]}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  /**
   * Render a text or numeric input.
   *
   * @param {string} name - Field name.
   * @param {string} label - Field label.
   * @param {string|number} value - Field value.
   * @param {Function} onChange - Change handler.
   * @param {string} type - Input type.
   * @return {React.ReactNode}
   */
  renderInput(name, label, value, onChange, type = 'text') {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={name}>
          {label}
        </label>
        <div className="col-sm-9">
          <input
            className="form-control"
            id={name}
            name={name}
            type={type}
            value={value || ''}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }

  /**
   * Render a textarea input.
   *
   * @param {string} name - Field name.
   * @param {string} label - Field label.
   * @param {string} value - Field value.
   * @param {Function} onChange - Change handler.
   * @return {React.ReactNode}
   */
  renderTextarea(name, label, value, onChange) {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label" htmlFor={name}>
          {label}
        </label>
        <div className="col-sm-9">
          <textarea
            className="form-control"
            id={name}
            name={name}
            rows="8"
            value={value || ''}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }

  /**
   * Render the decisions table.
   *
   * @return {React.ReactNode}
   */
  renderDecisionTable() {
    const {t} = this.props;
    const options = this.state.decisions.fieldOptions;
    const fields = [
      {label: 'ID', show: false},
      {
        label: t('Username', {ns: 'loris'}),
        show: true,
        filter: {name: 'Username', type: 'text'},
      },
      {
        label: t('User', {ns: 'loris'}),
        show: true,
        filter: {name: 'User', type: 'text'},
      },
      {
        label: t('Policy', {ns: 'policy_tracker'}),
        show: true,
        filter: {
          name: 'Policy',
          type: 'select',
          options: options.policies || {},
        },
      },
      {
        label: t('Version', {ns: 'policy_tracker'}),
        show: true,
        filter: {name: 'Version', type: 'text'},
      },
      {
        label: t('Module', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'Module',
          type: 'select',
          options: options.modules || {},
        },
      },
      {
        label: t('Decision', {ns: 'policy_tracker'}),
        show: true,
        filter: {
          name: 'Decision',
          type: 'select',
          options: options.decision || {},
        },
      },
      {
        label: t('Decision Date', {ns: 'policy_tracker'}),
        show: true,
        filter: {name: 'Decision Date', type: 'text'},
      },
    ];

    return (
      <FilterableDataTable
        name="policyTrackerDecisionTable"
        data={this.state.decisions.Data}
        fields={fields}
      />
    );
  }

  /**
   * Render the create-version form.
   *
   * @return {React.ReactNode}
   */
  renderVersionForm() {
    const {t} = this.props;
    const modules = this.toOptions(this.state.options.modules, 'ID', 'Name');
    const policies = this.policyOptions(this.state.options.policies);
    const renewalUnits = {
      D: t('Days', {ns: 'policy_tracker'}),
      M: t('Months', {ns: 'policy_tracker'}),
      Y: t('Years', {ns: 'policy_tracker'}),
      H: t('Hours', {ns: 'policy_tracker'}),
    };
    const yesNo = {
      Y: t('Yes', {ns: 'loris'}),
      N: t('No', {ns: 'loris'}),
    };

    return (
      <Panel title={t('Create New Policy Version', {ns: 'policy_tracker'})}>
        <form className="form-horizontal" onSubmit={this.saveNewVersion}>
          {this.renderSelect(
            'PolicyID',
            t('Source Policy', {ns: 'policy_tracker'}),
            policies,
            this.state.versionForm.PolicyID,
            this.selectPolicy
          )}
          {this.renderInput(
            'Name',
            t('Name', {ns: 'loris'}),
            this.state.versionForm.Name,
            this.handleVersionChange
          )}
          {this.renderSelect(
            'ModuleID',
            t('Module', {ns: 'loris'}),
            modules,
            this.state.versionForm.ModuleID,
            this.handleVersionChange
          )}
          {this.renderInput(
            'PolicyRenewalTime',
            t('Days to Renew', {ns: 'policy_tracker'}),
            this.state.versionForm.PolicyRenewalTime,
            this.handleVersionChange,
            'number'
          )}
          {this.renderSelect(
            'PolicyRenewalTimeUnit',
            t('Renewal Unit', {ns: 'policy_tracker'}),
            renewalUnits,
            this.state.versionForm.PolicyRenewalTimeUnit,
            this.handleVersionChange
          )}
          {this.renderSelect(
            'HeaderButton',
            t('Header Button', {ns: 'policy_tracker'}),
            yesNo,
            this.state.versionForm.HeaderButton,
            this.handleVersionChange
          )}
          {this.renderInput(
            'HeaderButtonText',
            t('Header Button Text', {ns: 'policy_tracker'}),
            this.state.versionForm.HeaderButtonText,
            this.handleVersionChange
          )}
          {this.renderSelect(
            'Active',
            t('Active', {ns: 'loris'}),
            yesNo,
            this.state.versionForm.Active,
            this.handleVersionChange
          )}
          {this.renderInput(
            'SwalTitle',
            t('Modal Title', {ns: 'policy_tracker'}),
            this.state.versionForm.SwalTitle,
            this.handleVersionChange
          )}
          {this.renderInput(
            'AcceptButtonText',
            t('Accept Button Text', {ns: 'policy_tracker'}),
            this.state.versionForm.AcceptButtonText,
            this.handleVersionChange
          )}
          {this.renderInput(
            'DeclineButtonText',
            t('Decline Button Text', {ns: 'policy_tracker'}),
            this.state.versionForm.DeclineButtonText,
            this.handleVersionChange
          )}
          {this.renderTextarea(
            'Content',
            t('Content', {ns: 'loris'}),
            this.state.versionForm.Content,
            this.handleVersionChange
          )}
          <div className="form-group">
            <div className="col-sm-offset-3 col-sm-9">
              <button className="btn btn-primary" type="submit">
                {t('Create Version', {ns: 'policy_tracker'})}
              </button>
            </div>
          </div>
        </form>
      </Panel>
    );
  }

  /**
   * Render the translation form.
   *
   * @return {React.ReactNode}
   */
  renderTranslationForm() {
    const {t} = this.props;
    const policies = this.policyOptions(this.state.options.policies);
    const languages = this.toOptions(
      this.state.options.languages,
      'language_id',
      'language_label'
    );

    return (
      <Panel title={t('Edit Policy Translation', {ns: 'policy_tracker'})}>
        <form className="form-horizontal" onSubmit={this.saveTranslation}>
          {this.renderSelect(
            'PolicyID',
            t('Policy', {ns: 'policy_tracker'}),
            policies,
            this.state.translationForm.PolicyID,
            this.selectTranslation
          )}
          {this.renderSelect(
            'LanguageID',
            t('Language', {ns: 'loris'}),
            languages,
            this.state.translationForm.LanguageID,
            this.selectTranslation
          )}
          {this.renderInput(
            'SwalTitle',
            t('Modal Title', {ns: 'policy_tracker'}),
            this.state.translationForm.SwalTitle,
            this.handleTranslationChange
          )}
          {this.renderInput(
            'HeaderButtonText',
            t('Header Button Text', {ns: 'policy_tracker'}),
            this.state.translationForm.HeaderButtonText,
            this.handleTranslationChange
          )}
          {this.renderInput(
            'AcceptButtonText',
            t('Accept Button Text', {ns: 'policy_tracker'}),
            this.state.translationForm.AcceptButtonText,
            this.handleTranslationChange
          )}
          {this.renderInput(
            'DeclineButtonText',
            t('Decline Button Text', {ns: 'policy_tracker'}),
            this.state.translationForm.DeclineButtonText,
            this.handleTranslationChange
          )}
          {this.renderTextarea(
            'Content',
            t('Content', {ns: 'loris'}),
            this.state.translationForm.Content,
            this.handleTranslationChange
          )}
          <div className="form-group">
            <div className="col-sm-offset-3 col-sm-9">
              <button className="btn btn-primary" type="submit">
                {t('Save Translation', {ns: 'policy_tracker'})}
              </button>
            </div>
          </div>
        </form>
      </Panel>
    );
  }

  /**
   * Render page.
   *
   * @return {React.ReactNode}
   */
  render() {
    const {t} = this.props;
    if (!this.state.isLoaded) {
      return <Loader />;
    }

    if (this.state.error) {
      return (
        <div className="alert alert-danger">
          {t('Could not load policy tracker data', {ns: 'policy_tracker'})}
        </div>
      );
    }

    return (
      <div className="policy-tracker">
        <div className="page-header">
          <h2>{t('Policy Tracker', {ns: 'policy_tracker'})}</h2>
        </div>
        {this.renderDecisionTable()}
        <div className="row">
          <div className="col-md-6">
            {this.renderVersionForm()}
          </div>
          <div className="col-md-6">
            {this.renderTranslationForm()}
          </div>
        </div>
      </div>
    );
  }
}

PolicyTrackerIndex.propTypes = {
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  i18n.addResourceBundle('ja', 'policy_tracker', {});
  i18n.addResourceBundle('zh', 'policy_tracker', {});
  i18n.addResourceBundle('fr', 'policy_tracker', {});
  i18n.addResourceBundle('hi', 'policy_tracker', {});
  const Index = withTranslation(
    ['policy_tracker', 'loris']
  )(PolicyTrackerIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(<Index baseURL={loris.BaseURL}/>);
});
