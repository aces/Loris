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
import {
  NumericElement,
  SelectElement,
  TextareaElement,
  TextboxElement,
} from 'jsx/Form';

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
      canViewDecisions: false,
      canEditPolicies: false,
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
   * Format policy decision rows for the DataTable.
   *
   * @param {object} decisions - Raw decisions response.
   * @return {object}
   */
  formatDecisions(decisions) {
    return {
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
    };
  }

  /**
   * Fetch table rows and policy editor options.
   */
  fetchData() {
    this.requestJSON('decisions').then((decisions) => {
      if (!decisions.canEditPolicies) {
        this.setState({
          decisions: this.formatDecisions(decisions),
          canViewDecisions: decisions.canViewDecisions,
          canEditPolicies: false,
          error: false,
          isLoaded: true,
        });
        return null;
      }

      return this.requestJSON('options').then((options) => {
        this.setState({
          decisions: this.formatDecisions(decisions),
          options,
          versionForm: this.getVersionForm(options.policies[0]),
          translationForm: this.getTranslationForm(
            options.policies[0],
            options.languages[0],
            options.translations
          ),
          canViewDecisions: decisions.canViewDecisions,
          canEditPolicies: true,
          error: false,
          isLoaded: true,
        });
        return null;
      });
    }).catch((error) => {
      this.setState({
        error: true,
        isLoaded: true,
      });
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
   * @param {array} translations - Existing policy translations.
   * @return {object}
   */
  getTranslationForm(
    policy,
    language,
    translations = this.state.options.translations
  ) {
    if (!policy || !language) {
      return {};
    }
    const translation = translations.find((row) => {
      return parseInt(row.PolicyID) === parseInt(policy.PolicyID) &&
        parseInt(row.LanguageID) === parseInt(language.language_id);
    }) || {};

    return {
      PolicyID: policy.PolicyID,
      LanguageID: language.language_id,
      Content: translation.Content ?? policy.Content,
      SwalTitle: translation.SwalTitle ?? policy.SwalTitle,
      HeaderButtonText: translation.HeaderButtonText ??
        policy.HeaderButtonText,
      AcceptButtonText: translation.AcceptButtonText ??
        policy.AcceptButtonText,
      DeclineButtonText: translation.DeclineButtonText ??
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
   * @param {string} name - Field name.
   * @param {string|number} value - Field value.
   */
  handleVersionChange(name, value) {
    this.setState((state) => ({
      versionForm: {...state.versionForm, [name]: value},
    }));
  }

  /**
   * Handle translation form changes.
   *
   * @param {string} name - Field name.
   * @param {string|number} value - Field value.
   */
  handleTranslationChange(name, value) {
    this.setState((state) => ({
      translationForm: {...state.translationForm, [name]: value},
    }));
  }

  /**
   * Change the source policy used by the create-version form.
   *
   * @param {string} name - Field name.
   * @param {string|number} value - Selected policy ID.
   */
  selectPolicy(name, value) {
    const policy = this.state.options.policies.find((row) => {
      return parseInt(row.PolicyID) === parseInt(value);
    });
    this.setState({versionForm: this.getVersionForm(policy)});
  }

  /**
   * Change the policy or language used by the translation form.
   *
   * @param {string} name - Field name.
   * @param {string|number} value - Selected field value.
   */
  selectTranslation(name, value) {
    const form = {
      ...this.state.translationForm,
      [name]: value,
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
          <SelectElement
            name="PolicyID"
            id="version-PolicyID"
            label={t('Source Policy', {ns: 'policy_tracker'})}
            options={policies}
            value={String(this.state.versionForm.PolicyID || '')}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
            onUserInput={this.selectPolicy}
          />
          <TextboxElement
            name="Name"
            id="version-Name"
            label={t('Name', {ns: 'loris'})}
            value={this.state.versionForm.Name || ''}
            onUserInput={this.handleVersionChange}
          />
          <SelectElement
            name="ModuleID"
            id="version-ModuleID"
            label={t('Module', {ns: 'loris'})}
            options={modules}
            value={String(this.state.versionForm.ModuleID || '')}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
            onUserInput={this.handleVersionChange}
          />
          <NumericElement
            name="PolicyRenewalTime"
            id="version-PolicyRenewalTime"
            label={t('Days to Renew', {ns: 'policy_tracker'})}
            value={String(this.state.versionForm.PolicyRenewalTime || '')}
            onUserInput={this.handleVersionChange}
          />
          <SelectElement
            name="PolicyRenewalTimeUnit"
            id="version-PolicyRenewalTimeUnit"
            label={t('Renewal Unit', {ns: 'policy_tracker'})}
            options={renewalUnits}
            value={this.state.versionForm.PolicyRenewalTimeUnit || ''}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
            onUserInput={this.handleVersionChange}
          />
          <SelectElement
            name="HeaderButton"
            id="version-HeaderButton"
            label={t('Header Button', {ns: 'policy_tracker'})}
            options={yesNo}
            value={this.state.versionForm.HeaderButton || ''}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
            onUserInput={this.handleVersionChange}
          />
          <TextboxElement
            name="HeaderButtonText"
            id="version-HeaderButtonText"
            label={t('Header Button Text', {ns: 'policy_tracker'})}
            value={this.state.versionForm.HeaderButtonText || ''}
            onUserInput={this.handleVersionChange}
          />
          <SelectElement
            name="Active"
            id="version-Active"
            label={t('Active', {ns: 'loris'})}
            options={yesNo}
            value={this.state.versionForm.Active || ''}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
            onUserInput={this.handleVersionChange}
          />
          <TextboxElement
            name="SwalTitle"
            id="version-SwalTitle"
            label={t('Modal Title', {ns: 'policy_tracker'})}
            value={this.state.versionForm.SwalTitle || ''}
            onUserInput={this.handleVersionChange}
          />
          <TextboxElement
            name="AcceptButtonText"
            id="version-AcceptButtonText"
            label={t('Accept Button Text', {ns: 'policy_tracker'})}
            value={this.state.versionForm.AcceptButtonText || ''}
            onUserInput={this.handleVersionChange}
          />
          <TextboxElement
            name="DeclineButtonText"
            id="version-DeclineButtonText"
            label={t('Decline Button Text', {ns: 'policy_tracker'})}
            value={this.state.versionForm.DeclineButtonText || ''}
            onUserInput={this.handleVersionChange}
          />
          <TextareaElement
            name="Content"
            id="version-Content"
            label={t('Content', {ns: 'loris'})}
            rows={8}
            value={this.state.versionForm.Content || ''}
            onUserInput={this.handleVersionChange}
          />
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
          <SelectElement
            name="PolicyID"
            id="translation-PolicyID"
            label={t('Policy', {ns: 'policy_tracker'})}
            options={policies}
            value={String(this.state.translationForm.PolicyID || '')}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
            onUserInput={this.selectTranslation}
          />
          <SelectElement
            name="LanguageID"
            id="translation-LanguageID"
            label={t('Language', {ns: 'loris'})}
            options={languages}
            value={String(this.state.translationForm.LanguageID || '')}
            emptyOption={false}
            autoSelect={false}
            sortByValue={false}
            onUserInput={this.selectTranslation}
          />
          <TextboxElement
            name="SwalTitle"
            id="translation-SwalTitle"
            label={t('Modal Title', {ns: 'policy_tracker'})}
            value={this.state.translationForm.SwalTitle || ''}
            onUserInput={this.handleTranslationChange}
          />
          <TextboxElement
            name="HeaderButtonText"
            id="translation-HeaderButtonText"
            label={t('Header Button Text', {ns: 'policy_tracker'})}
            value={this.state.translationForm.HeaderButtonText || ''}
            onUserInput={this.handleTranslationChange}
          />
          <TextboxElement
            name="AcceptButtonText"
            id="translation-AcceptButtonText"
            label={t('Accept Button Text', {ns: 'policy_tracker'})}
            value={this.state.translationForm.AcceptButtonText || ''}
            onUserInput={this.handleTranslationChange}
          />
          <TextboxElement
            name="DeclineButtonText"
            id="translation-DeclineButtonText"
            label={t('Decline Button Text', {ns: 'policy_tracker'})}
            value={this.state.translationForm.DeclineButtonText || ''}
            onUserInput={this.handleTranslationChange}
          />
          <TextareaElement
            name="Content"
            id="translation-Content"
            label={t('Content', {ns: 'loris'})}
            rows={8}
            value={this.state.translationForm.Content || ''}
            onUserInput={this.handleTranslationChange}
          />
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
        {this.state.canViewDecisions && this.renderDecisionTable()}
        {this.state.canEditPolicies &&
          <div className="row">
            <div className="col-md-6">
              {this.renderVersionForm()}
            </div>
            <div className="col-md-6">
              {this.renderTranslationForm()}
            </div>
          </div>
        }
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
