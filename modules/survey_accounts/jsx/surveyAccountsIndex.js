import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import swal from 'sweetalert2';
import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

/**
 * Survey Account React Component
 */
class SurveyAccountsIndex extends Component {
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
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
      .then(() => this.setState({isLoaded: true}));
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
      .then((data) => this.setState({data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {*} a formatted table cell for a given column
   */
  formatColumn(column, cell, row) {
    let result = <td>{cell}</td>;
    switch (column) {
      case 'URL': {
        const url = loris.BaseURL + '/survey.php?key=' + row.URL;
        result = <td><a href={url}>{cell}</a></td>;
        break;
      }
      case 'Instrument': {
        const instruments = this.state.data.fieldOptions.instruments;
        result = <td>{instruments[cell]}</td>;
        break;
      }
      case 'Edit': {
        if (!loris.userHasPermission('user_account')) {
          return;
        }
        result = (
          <td>
            <button
              onClick={() => this.deleteclick(row.Instrument, row.Edit)}
              className="btn btn-danger"
            >
              Delete
            </button>
            <button
              className="btn btn-warning"
              onClick={() => this.archiveclick(row.Instrument, row.Edit)}
            >
              Archive
            </button>
          </td>
        );
        break;
      }
    }
    return result;
  }

  /**
   * Handle delete click function
   *
   * @param {string} Instrument - Instrument name
   * @param {string} commentid - Comment ID
   */
  deleteclick(Instrument, commentid) {
    swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.value) {
        const deleteurl = `${loris.BaseURL}/survey_accounts/` +
          `deleteSurvey/${Instrument}/${commentid}`;
        fetch(deleteurl, {
          method: 'DELETE',
          cache: 'no-cache',
          credentials: 'same-origin',
        })
          .then((resp) => {
            const message = resp.status === 200 ?
              'Delete Successful!' : 'Delete Not Successful!';
            const type = resp.status === 200 ? 'success' : 'error';
            swal.fire(message, '', type);
          })
          .then(() => location.reload());
      }
    });
  }

  /**
   * Handle archive click function
   *
   * @param {string} Instrument - Instrument name
   * @param {string} commentid - Comment ID
   */
  archiveclick(Instrument, commentid) {
    swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t see this survey in the table!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive it!',
    }).then((result) => {
      if (result.value) {
        const archiveurl = `${loris.BaseURL}/survey_accounts/` +
          `archiveSurvey/${Instrument}/${commentid}`;
        fetch(archiveurl, {
          method: 'POST',
          cache: 'no-cache',
          credentials: 'same-origin',
        })
          .then((resp) => {
            const message = resp.status === 200 ?
              'Archive Successful!' : 'Archive Not Successful!';
            const type = resp.status === 200 ? 'success' : 'error';
            swal.fire(message, '', type);
          })
          .then(() => location.reload());
      }
    });
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (this.state.error) {
      return <h3>An error occurred while loading the page.</h3>;
    }

    if (!this.state.isLoaded) {
      return <Loader />;
    }

    /**
     * XXX: Currently, the order of these fields MUST match the order of the
     * queried columns in _setupVariables() in survey_accounts.class.inc
     */
    const options = this.state.data.fieldOptions;
    const fields = [
      {label: 'PSCID', show: true, filter: {name: 'pscid', type: 'text'}},
      {
        label: 'Visit',
        show: true,
        filter: {name: 'visit', type: 'select', options: options.visits},
      },
      {
        label: 'Instrument',
        show: true,
        filter: {
          name: 'instrument',
          type: 'select',
          options: options.instruments,
        },
      },
      {label: 'URL', show: true},
      {
        label: 'Status',
        show: true,
        filter: {
          name: 'Status',
          type: 'select',
          options: options.statusOptions,
        },
      },
      {label: 'Edit', show: true},
      {label: 'centerID', show: false},
      {label: 'projectID', show: false},
    ];

    const addSurvey = () => {
      location.href='/survey_accounts/addSurvey/';
    };
    const actions = [
      {label: 'Add Survey', action: addSurvey},
    ];

    return (
      <FilterableDataTable
        name="surveyAccounts"
        title="Survey Accounts"
        data={this.state.data.Data}
        fields={fields}
        getFormattedCell={this.formatColumn}
        actions={actions}
      />
    );
  }
}

SurveyAccountsIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
};

window.addEventListener('load', () => {
  createRoot(document.getElementById('lorisworkspace')).render(
    <SurveyAccountsIndex
      dataURL={`${loris.BaseURL}/survey_accounts/?format=json`}
    />
  );
});

