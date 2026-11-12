import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import RecordTable from 'jsx/table/RecordTable';
import Modal from 'Modal';

import fetchDataStream from 'jslib/fetchDataStream';
import OpenProfileForm from './openProfileForm';
import NewProfileForm from '../../new_profile/jsx/NewProfileForm';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import jaStrings from '../locale/ja/LC_MESSAGES/candidate_list.json';
import hiStrings from '../locale/hi/LC_MESSAGES/candidate_list.json';
import frStrings from '../locale/fr/LC_MESSAGES/candidate_list.json';
import zhStrings from '../locale/zh/LC_MESSAGES/candidate_list.json';

const DEFAULT_SORT = [{name: 'pscid', ascending: true}];

/**
 * Candidate List
 *
 * Main module component rendering the candidate list and open profile form
 *
 * @author Dave MacFarlane
 * @author Cécile Madjar *
 */
class CandidateListIndex extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      error: false,
      isLoaded: false,
      fieldOptions: {},
      show: {profileForm: false},
    };

    this.fetchData = this.fetchData.bind(this);

    this.dateFormatter = new Intl.DateTimeFormat(
      loris.user.langpref.replace('_', '-'),
      {
        style: 'short',
        timeZone: 'UTC',

      }
    );
  }

  /**
   * Show
   *
   * @param {string} state
   */
  show(state) {
    let show = this.state.show;
    show[state] = true;
    this.setState({show});
  }

  /**
   * Hide
   *
   * @param {string} state
   */
  hide(state) {
    let show = this.state.show;
    show[state] = false;
    this.setState({show});
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    fetch(loris.BaseURL+'/candidate_list/options',
      {credentials: 'same-origin'}).then(
      (resp) => resp.json()
    ).then(
      (json) => {
        this.setState({
          fieldOptions: json,
        });
      }
    );

    this.fetchData();
  }

  /**
   * Turns a row from the data stream into a candidate record
   *
   * @param {array} row - the row, in the order the provisioner queries it
   * @return {object}
   */
  toRecord(row) {
    const [
      pscid, dccid, visitLabel, site, cohort, entityType, scanDone,
      participantStatus, dob, dateRegistered, sex, visitCount, feedback,
      project, edc,
    ] = row;
    return {
      pscid, dccid, visitLabel, site, cohort, entityType, scanDone,
      participantStatus, dob, dateRegistered, sex, visitCount, feedback,
      project, edc,
    };
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   *
   * @return {object}
   */
  fetchData() {
    const rows = [];
    fetchDataStream(this.props.dataURL,
      (row) => rows.push(this.toRecord(row)),
      () => this.setState({data: rows}),
      () => this.setState({data: rows, isLoaded: true}),
    );
  }

  /**
   * Builds the table's columns, actions and views for a set of field
   * options. Called again only when the options change.
   *
   * @param {object} options - field options from /candidate_list/options
   * @return {object}
   */
  tableConfig(options) {
    const {t, baseURL, betaProfileLink} = this.props;
    const formatDate = (value) => value
      ? this.dateFormatter.format(new Date(value)) : '';
    const feedbackColours = {
      '1': '#E4A09E', '2': '#EEEEAA', '3': '#99CC99', '4': '#99CCFF',
    };
    const feedbackOptions = {
      '0': t('None', {ns: 'loris'}),
      '1': t('Opened', {ns: 'candidate_list'}),
      '2': t('Answered', {ns: 'candidate_list'}),
      '3': t('Closed', {ns: 'candidate_list'}),
      '4': t('Comment', {ns: 'candidate_list'}),
    };
    const profileURL = (dccid) => betaProfileLink
      ? baseURL + '/candidate_profile/' + dccid + '/'
      : baseURL + '/' + dccid + '/';

    const columns = [
      {
        name: 'pscid',
        label: t('PSCID', {ns: 'loris'}),
        sticky: true,
        value: (c) => c.pscid,
        format: (pscid, c) => <a href={profileURL(c.dccid)}>{pscid}</a>,
        filter: {type: 'text'},
      },
      {
        name: 'dccid',
        label: t('DCCID', {ns: 'loris'}),
        value: (c) => c.dccid,
        filter: {type: 'text'},
      },
      {
        name: 'visitLabel',
        label: t('Visit Label', {ns: 'loris'}),
        value: (c) => c.visitLabel,
        hidden: true,
        filter: {
          type: 'multiselect',
          options: options.visitlabel,
        },
      },
      {
        name: 'site',
        label: t('Site', {ns: 'loris', count: 1}),
        value: (c) => c.site,
        groupable: true,
        filter: {type: 'multiselect', options: options.site},
      },
      {
        name: 'cohort',
        label: t('Cohort', {ns: 'loris', count: 1}),
        value: (c) => c.cohort,
        groupable: true,
        filter: {type: 'multiselect', options: options.cohort},
      },
      {
        name: 'entityType',
        label: t('Entity Type', {ns: 'loris'}),
        value: (c) => c.entityType,
        groupable: true,
        filter: {type: 'select', options: options.entitytype},
      },
      {
        name: 'scanDone',
        label: t('Scan Done', {ns: 'loris'}),
        value: (c) => c.scanDone,
        groupable: true,
        format: (scanDone, c) => scanDone === 'Y'
          ? <a href={baseURL + '/imaging_browser/?PSCID=' + c.pscid}>
            {t('Yes', {ns: 'loris'})}
          </a>
          : t('No', {ns: 'loris'}),
        filter: {
          type: 'select',
          options: {'Y': t('Yes', {ns: 'loris'}), 'N': t('No', {ns: 'loris'})},
        },
      },
      {
        name: 'participantStatus',
        label: t('Participant Status', {ns: 'loris'}),
        value: (c) => c.participantStatus,
        groupable: true,
        filter: {type: 'select', options: options.participantstatus},
      },
      {
        name: 'DoB',
        label: t('DoB', {ns: 'loris'}),
        type: 'date',
        value: (c) => c.dob,
        display: formatDate,
        groupable: true,
        filter: {type: 'date-range'},
      },
      {
        name: 'Date_registered',
        label: t('Date of registration', {ns: 'loris'}),
        type: 'date',
        value: (c) => c.dateRegistered,
        display: formatDate,
        groupable: true,
        filter: {type: 'date-range'},
      },
      {
        name: 'sex',
        label: t('Sex', {ns: 'loris'}),
        value: (c) => c.sex,
        groupable: true,
        filter: {type: 'select', options: options.Sex},
      },
      {
        name: 'visitCount',
        label: t('Visit Count', {ns: 'candidate_list'}),
        type: 'number',
        value: (c) => c.visitCount,
        filter: {type: 'numeric'},
      },
      {
        name: 'feedback',
        label: t('Feedback', {ns: 'loris'}),
        value: (c) => c.feedback,
        groupable: true,
        format: (feedback) => feedbackColours[feedback]
          ? <span
            className="feedback-chip"
            style={{background: feedbackColours[feedback]}}
          >
            {feedbackOptions[feedback]}
          </span>
          : feedbackOptions['0'],
        filter: {type: 'select', options: feedbackOptions},
      },
      {
        name: 'project',
        label: t('Project', {ns: 'loris', count: 1}),
        value: (c) => c.project,
        groupable: true,
        filter: {type: 'select', options: options.project},
      },
    ];

    if (options.useedc === 'true') {
      columns.push({
        name: 'edc',
        label: t('EDC', {ns: 'loris'}),
        type: 'date',
        value: (c) => c.edc,
        display: formatDate,
        filter: {type: 'date'},
      });
    }

    const actions = [
      {
        name: 'openProfile',
        label: t('Open Profile', {ns: 'candidate_list'}),
        onClick: () => this.show('profileForm'),
        show: !this.props.hasPermission('access_all_profiles'),
      },
      {
        name: 'newProfile',
        label: t('New Profile', {ns: 'candidate_list'}),
        show: this.props.hasPermission('data_entry'),
        renderForm: (close) => (
          <NewProfileForm
            dataURL={`${baseURL}/new_profile/?format=json`}
            submitURL={`${baseURL}/api/v0.0.4-dev/candidates/`}
            onCreated={() => {
              close();
              this.fetchData();
            }}
          />
        ),
      },
    ];

    const recordActions = [
      {
        name: 'profile',
        label: t('Open profile', {ns: 'candidate_list'}),
        onClick: (candidate) => {
          window.location.href = profileURL(candidate.dccid);
        },
      },
      {
        name: 'imaging',
        label: t('View imaging', {ns: 'candidate_list'}),
        show: (candidate) => candidate.scanDone === 'Y',
        onClick: (candidate) => {
          window.location.href = baseURL + '/imaging_browser/?PSCID='
            + candidate.pscid;
        },
      },
    ];

    const views = [
      {
        id: 'scanned',
        name: t('Scanned', {ns: 'candidate_list'}),
        state: {filters: {scanDone: {value: 'Y', exactMatch: true}}},
      },
      {
        id: 'bySite',
        name: t('By site', {ns: 'candidate_list'}),
        state: {groupBy: 'site'},
      },
    ];

    return {columns, actions, recordActions, views};
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    // If error occurs, return a message.
    // XXX: Replace this with a UI component for 500 errors.
    if (this.state.error) {
      return <h3>An error occurred while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    const options = this.state.fieldOptions;
    if (this.configOptions !== options) {
      this.configOptions = options;
      this.config = this.tableConfig(options);
    }
    const {columns, actions, recordActions, views} = this.config;
    const {t} = this.props;

    // Open profile modal window
    const profileForm = (
      <Modal
        title={this.props.t('Open Profile', {ns: 'candidate_list'})}
        show={this.state.show.profileForm}
        onClose={() => {
          this.hide('profileForm');
        }}
        onClick={this.openProfile}
      >
        <OpenProfileForm betaProfileLink={this.props.betaProfileLink} />
      </Modal>
    );

    return (
      <div>
        {profileForm}
        <RecordTable
          name="candidateList"
          title={t('Candidates', {ns: 'candidate_list'})}
          records={this.state.data}
          columns={columns}
          recordKey={(c) => c.dccid}
          actions={actions}
          recordActions={recordActions}
          views={views}
          selectable
          fill
          csv={{filename: 'candidates'}}
          defaultSort={DEFAULT_SORT}
        />
      </div>
    );
  }
}

CandidateListIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  hasPermission: PropTypes.func.isRequired,
  betaProfileLink: PropTypes.string,
  baseURL: PropTypes.string,
  // Provided by withTranslation HOC
  t: PropTypes.func,
};

window.addEventListener('load', () => {
  const args = QueryString.get();
  i18n.addResourceBundle('ja', 'candidate_list', jaStrings);
  i18n.addResourceBundle('hi', 'candidate_list', hiStrings);
  i18n.addResourceBundle('fr', 'candidate_list', frStrings);
  i18n.addResourceBundle('zh', 'candidate_list', zhStrings);


  const CLIndex = withTranslation(
    ['candidate_list', 'loris']
  )(CandidateListIndex);
  createRoot(
    document.getElementById('lorisworkspace')
  ).render(
    <CLIndex
      dataURL={`${loris.BaseURL}/candidate_list/?format=binary`}
      hasPermission={loris.userHasPermission}
      baseURL={loris.BaseURL}
      betaProfileLink={args['betaprofile']}
    />
  );
});
