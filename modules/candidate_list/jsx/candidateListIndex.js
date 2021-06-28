import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';
import Modal from 'Modal';

import OpenProfileForm from './openProfileForm';

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
      data: {},
      error: false,
      isLoaded: false,
      hideFilter: true,
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
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));

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
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => {
        // Convert concatenated string of subproject and visit labels to array
        data.Data = data.Data.map((row) => {
          // Visit label
          row[2] = (row[2]) ? row[2].split(',') : null;
          // Subproject
          row[4] = (row[4]) ? row[4].split(',') : null;
          return row;
        });
        this.setState({data});
      })
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
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
  };

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   *
   * @return {*} a formated table cell for a given column
   */
  formatColumn(column, cell, row) {
    if (column === 'PSCID') {
      let url;
      if (this.props.betaProfileLink) {
          url = this.props.baseURL + '/candidate_profile/' + row['DCCID'] + '/';
      } else {
          url = this.props.baseURL + '/' + row['DCCID'] + '/';
      }

      return <td><a href ={url}>{cell}</a></td>;
    }
    if (column === 'Feedback') {
      switch (cell) {
        case '1': return <td style ={{background: '#E4A09E'}}>opened</td>;
        case '2': return <td style ={{background: '#EEEEAA'}}>answered</td>;
        case '3': return <td style ={{background: '#99CC99'}}>closed</td>;
        case '4': return <td style ={{background: '#99CCFF'}}>comment</td>;
        default: return <td>None</td>;
      }
    }
    if (column === 'Scan Done' && cell === 'Y') {
      let url = this.props.baseURL + '/imaging_browser/?PSCID=' + row['PSCID'];
      return (
        <td className="scanDoneLink">
          <a href={url}>{cell}</a></td>
      );
    }

    if (column === 'Subproject') {
      // If user has multiple subprojects, join array into string
      let result = (cell) ? <td>{cell.join(', ')}</td> : <td></td>;
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
    const options = this.state.data.fieldOptions;
    const fields = [
      {
        label: 'PSCID',
        show: true,
        filter: {
          name: 'pscid',
          type: 'text',
        },
      },
      {
        label: 'DCCID',
        show: true,
        filter: {
          name: 'dccid',
          type: 'text',
        },
      },
      {
        label: 'Visit Label',
        show: false,
        filter: {
          name: 'visitLabel',
          type: 'select',
          options: options.visitlabel,
        },
      },
      {
        label: 'Site',
        show: true,
        filter: {
          name: 'site',
          type: 'select',
          options: options.site,
        },
      },
      {
        'label': 'Subproject',
        'show': true,
        'filter': {
          name: 'subproject',
          type: 'select',
          options: options.subproject,
        },
      },
      {
        label: 'Entity Type',
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
        'label': 'Scan Done',
        'show': true,
        'filter': {
          name: 'scanDone',
          type: 'select',
          hide: this.state.hideFilter,
          options: {
            'Y': 'Yes',
            'N': 'No',
          },
        },
      },
      {
        'label': 'Participant Status',
        'show': true,
        'filter': {
          name: 'participantStatus',
          type: 'select',
          hide: this.state.hideFilter,
          options: options.participantstatus,
        },
      },
      {
        'label': 'DoB',
        'show': true,
        'filter': {
          name: 'DoB',
          type: 'date',
          hide: this.state.hideFilter,
        },
      },
      {
        label: 'Sex',
        show: true,
        filter: {
          name: 'sex',
          type: 'select',
          hide: this.state.hideFilter,
          options: {
            'Male': 'Male',
            'Female': 'Female',
            'Other': 'Other',
          },
        },
      },
      {
        'label': 'VisitCount',
        'show': true,
        'filter': {
          name: 'visitCount',
          type: 'text',
          hide: this.state.hideFilter,
        },
      },
      {
        'label': 'Feedback',
        'show': true,
        'filter': {
          name: 'feedback',
          type: 'select',
          hide: this.state.hideFilter,
          options: {
            '0': 'None',
            '1': 'opened',
            '2': 'answered',
            '3': 'closed',
            '4': 'comment',
          },
        },
      },
      {
        'label': 'Latest Visit Status',
        'show': true,
        'filter': {
          name: 'latestVisitStatus',
          type: 'select',
          hide: this.state.hideFilter,
          options: {
            'Not Started': 'Not Started',
            'Screening': 'Screening',
            'Visit': 'Visit',
            'Approval': 'Approval',
            'Recycling Bin': 'Recycling Bin',
          },
        },
      },

    ];
     fields.push(
        {
          'label': 'Project',
          'show': true,
          'filter': {
            name: 'project',
            type: 'select',
            options: options.project,
          },
        },
      );

    if (options.useedc === 'true') {
      fields.push(
        {
          'label': 'EDC',
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
        title='Open Profile'
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
          'Show Advanced Filters' :
          'Hide Advanced Filters',
        action: this.toggleFilters,
        name: 'advanced',
      },
      {
        label: 'Open Profile',
        action: () => this.show('profileForm'),
        show: !this.props.hasPermission('access_all_profiles'),
      },
    ];

    return (
      <div>
        {profileForm}
        <FilterableDataTable
          name="candidateList"
          data={this.state.data.Data}
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
};

window.addEventListener('load', () => {
  const args = QueryString.get();
  ReactDOM.render(
    <CandidateListIndex
      dataURL={`${loris.BaseURL}/candidate_list/?format=json`}
      hasPermission={loris.userHasPermission}
      baseURL={loris.BaseURL}
      betaProfileLink={args['betaprofile']}
    />,
    document.getElementById('lorisworkspace')
  );
});
