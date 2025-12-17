import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import Modal from 'Modal';

import fetchDataStream from 'jslib/fetchDataStream';
import OpenProfileForm from './openProfileForm';

import i18n from 'I18nSetup';
import {withTranslation} from 'react-i18next';

import jaStrings from '../locale/ja/LC_MESSAGES/candidate_list.json';
import hiStrings from '../locale/hi/LC_MESSAGES/candidate_list.json';
import frStrings from '../locale/fr/LC_MESSAGES/candidate_list.json';

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
      hideFilter: true,
      fieldOptions: {},
      show: {profileForm: false},
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
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

    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has('hide')) {
      this.setState({hideFilter: JSON.parse(searchParams.get('hide'))});
    }
  }

  /**
   * Retrieve data from the provided URL and save it in state
   * Additionally add hiddenHeaders to global loris variable
   * for easy access by columnFormatter.
   *
   * @return {object}
   */
  fetchData() {
    fetchDataStream(this.props.dataURL,
      (row) => this.state.data.push(row),
      (end) => {
        this.setState({data: this.state.data});
      },
      () => {
        this.setState({isLoaded: true});
      },
    );
  }

  /**
   * Basic/Advanced toggle
   */
  toggleFilters() {
    const hideFilter = !this.state.hideFilter;
    this.setState({hideFilter});

    // Updates query params to reflect advance filter toggle.
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('hide', hideFilter);
    history.replaceState(history.state, '', `?${searchParams.toString()}`);
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    if (column === this.props.t('PSCID', {ns: 'loris'})) {
      let url;
      const dccid = row[this.props.t('DCCID', {ns: 'loris'})];
      if (this.props.betaProfileLink) {
        url = this.props.baseURL + '/candidate_profile/' + dccid + '/';
      } else {
        url = this.props.baseURL + '/' + dccid + '/';
      }

      return <td><a href ={url}>{cell}</a></td>;
    }
    if (column === this.props.t('Feedback', {ns: 'loris'})) {
      switch (cell) {
      case '1': return <td style ={{background: '#E4A09E'}}>Opened</td>;
      case '2': return <td style ={{background: '#EEEEAA'}}>Answered</td>;
      case '3': return <td style ={{background: '#99CC99'}}>Closed</td>;
      case '4': return <td style ={{background: '#99CCFF'}}>Comment</td>;
      default: return <td>None</td>;
      }
    }
    if (column === this.props.t('Scan Uploaded', {ns: 'loris'})) {
      if (cell === 'Y') {
        const pscid = row[this.props.t('PSCID', {ns: 'loris'})];
        let url = this.props.baseURL + '/imaging_browser/?PSCID=' + pscid;
        return (
          <td className="scanUploadedLink">
            <a href={url}>{this.props.t('Yes', {ns: 'loris'})}</a>
          </td>
        );
      } else if (cell === 'N') {
        return <td>{this.props.t('No', {ns: 'loris'})}</td>;
      }
    }

    if (column === this.props.t('Cohort', {ns: 'loris', count: 1})) {
      let result = (cell) ? <td>{cell}</td> : <td></td>;
      return result;
    }

    return <td>{cell}</td>;
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
      return <h3>An error occured while loading the page.</h3>;
    }

    // Waiting for async data to load
    if (!this.state.isLoaded) {
      return <Loader/>;
    }

    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in candidate_list.class.inc
     */
    // const options = this.state.data.fieldOptions;
    const options = this.state.fieldOptions;
    const fields = [
      {
        label: this.props.t('PSCID', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'pscid',
          type: 'text',
        },
      },
      {
        label: this.props.t('DCCID', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'dccid',
          type: 'text',
        },
      },
      {
        label: this.props.t('Visit Label', {ns: 'loris'}),
        show: false,
        filter: {
          name: 'visitLabel',
          type: 'multiselect',
          options: options.visitlabel,
        },
      },
      {
        label: this.props.t('Site', {ns: 'loris', count: 1}),
        show: true,
        filter: {
          name: 'site',
          type: 'multiselect',
          options: options.site,
        },
      },
      {
        'label': this.props.t('Cohort', {ns: 'loris', count: 1}),
        'show': true,
        'filter': {
          name: 'cohort',
          type: 'multiselect',
          options: options.cohort,
        },
      },
      {
        label: this.props.t('Entity Type', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'entityType',
          type: 'select',
          options: {
            'Human': 'Human',
            'Scanner': 'Scanner',
          },
        },
      },
      {
        'label': this.props.t('Scan Uploaded', {ns: 'loris'}),
        'show': true,
        'filter': {
          name: 'scanUploaded',
          type: 'select',
          hide: this.state.hideFilter,
          options: {
            'Y': this.props.t('Yes', {ns: 'loris'}),
            'N': this.props.t('No', {ns: 'loris'}),
          },
        },
      },
      {
        'label': this.props.t('Participant Status', {ns: 'loris'}),
        'show': true,
        'filter': {
          name: 'participantStatus',
          type: 'select',
          hide: this.state.hideFilter,
          options: options.participantstatus,
        },
      },
      {
        'label': this.props.t('DoB', {ns: 'loris'}),
        'show': true,
        'filter': {
          name: 'DoB',
          type: 'date',
          hide: this.state.hideFilter,
        },
      },
      {
        'label': this.props.t('Date of registration', {ns: 'loris'}),
        'show': true,
        'filter': {
          name: 'Date_registered',
          type: 'date',
        },
      },
      {
        label: this.props.t('Sex', {ns: 'loris'}),
        show: true,
        filter: {
          name: 'sex',
          type: 'select',
          hide: this.state.hideFilter,
          options: options.Sex,
        },
      },
      {
        'label': this.props.t('Visit Count', {ns: 'candidate_list'}),
        'show': true,
        'filter': {
          name: 'visitCount',
          type: 'text',
          hide: this.state.hideFilter,
        },
      },
      {
        'label': this.props.t('Feedback', {ns: 'loris'}),
        'show': true,
        'filter': {
          name: 'feedback',
          type: 'select',
          hide: this.state.hideFilter,
          options: {
            '0': 'None',
            '1': 'Opened',
            '2': 'Answered',
            '3': 'Closed',
            '4': 'Comment',
          },
        },
      },
      {
        'label': this.props.t('Project', {ns: 'loris', count: 1}),
        'show': true,
        'filter': {
          name: 'project',
          type: 'select',
          options: options.project,
        },
      },
    ];

    if (options.useedc === 'true') {
      fields.push(
        {
          'label': this.props.t('EDC', {ns: 'loris'}),
          'show': true,
          'filter': {
            name: 'edc',
            type: 'date',
            hide: this.state.hideFilter,
          },
        }
      );
    }

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

    // Add action buttons for toggle and open profile
    // FIXME: move toggle button in the filter component next to the clear button
    const actions = [
      {
        label: this.state.hideFilter ?
          this.props.t('Show Advanced Filters', {ns: 'loris'}) :
          this.props.t('Hide Advanced Filters', {ns: 'loris'}),
        action: this.toggleFilters,
        name: 'advanced',
      },
      {
        label: this.props.t('Open Profile', {ns: 'candidate_list'}),
        action: () => this.show('profileForm'),
        show: !this.props.hasPermission('access_all_profiles'),
      },
    ];

    return (
      <div>
        {profileForm}
        <FilterableDataTable
          name="candidateList"
          data={this.state.data}
          fields={fields}
          actions={actions}
          getFormattedCell={this.formatColumn}
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
