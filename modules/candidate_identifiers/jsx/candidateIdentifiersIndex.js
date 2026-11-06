import {createRoot} from 'react-dom/client';
import React, {Component} from 'react';
import Modal from 'Modal';
import PropTypes from 'prop-types';

import i18n from 'I18nSetup';

import {withTranslation} from 'react-i18next';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import fetchDataStream from 'jslib/fetchDataStream';

import AddIdentifierForm from './addIdentifierForm';
import EditIdentifierForm from './editIdentifierForm';

import frStrings from '../locale/fr/LC_MESSAGES/candidate_identifiers.json';

/**
 * Candidate Identifiers
 *
 * Displays candidate identifiers in a filterable table.
 */
class CandidateIdentifiersIndex extends Component {
  /**
   * @constructor
   * @param {object} props - React component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoaded: false,
      showAddForm: false,
      identifierTypes: [],
      editingIdentifier: null,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formatColumn = this.formatColumn.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  /**
   * Load candidate identifiers.
   */
  componentDidMount() {
    this.fetchData();

    fetch(`${loris.BaseURL}/candidate_identifiers/?format=json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load identifier types');
        }
        return response.json();
      })
      .then((result) => {
        this.setState({
          identifierTypes: result.fieldOptions.identifierTypes || [],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /**
   * Retrieve identifier rows from the data framework.
   */
  fetchData() {
    const data = [];

    this.setState({isLoaded: false});

    fetchDataStream(
      this.props.dataURL,
      (row) => data.push(row),
      () => this.setState({data: [...data]}),
      () => this.setState({
        data: [...data],
        isLoaded: true,
      })
    );
  }

  /**
   * Format candidate links and date values.
   *
   * @param {string} column Column name
   * @param {*} cell Cell value
   * @param {object} row Table row
   * @return {object} Formatted table cell
   */
  formatColumn(column, cell, row) {
    if (column === 'PSCID') {
      const url = this.props.baseURL + '/' + row.CandID + '/';

      return <td><a href={url}>{cell}</a></td>;
    }

    if (column === this.props.t('Identifier Value',
      {ns: 'candidate_identifiers'})) {
      return (
        <td>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              this.setState({editingIdentifier: row});
            }}
          >
            {cell}
          </a>
        </td>
      );
    }

    if (column === this.props.t('Delete', {ns: 'candidate_identifiers'})) {
      const identifierType = this.state.identifierTypes.find(
        (type) => Number(type.value) === Number(row.CandidateIdentifierTypeID)
      );

      return (
        <td>
          {identifierType && !identifierType.isRequired && (
            <a
              style={{cursor: 'pointer'}}
              onClick={() => this.confirmDelete(row)}
            >
              {this.props.t('Delete', {ns: 'candidate_identifiers'})}
            </a>
          )}
        </td>
      );
    }

    return <td>{cell}</td>;
  }

  /**
   * Confirm and delete a candidate identifier.
   *
   * @param {object} row Identifier row
   */
  confirmDelete(row) {
    const {t} = this.props;
    swal.fire({
      title: t('Are you sure?', {ns: 'loris'}),
      text: `Delete identifier "${row.IdentifierValue}"?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: t('Yes, delete it!', {ns: 'candidate_identifiers'}),
      cancelButtonText: t('Cancel', {ns: 'loris'}),
    }).then((result) => {
      if (!result.value) {
        return;
      }

      fetch(
        `${loris.BaseURL}/api/v0.0.4-dev/candidates/` +
        `${encodeURIComponent(row.CandID)}/identifiers`,
        {
          method: 'DELETE',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Identifier: {
              CandidateIdentifierID: Number(row.CandidateIdentifierID),
            },
          }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Unable to delete identifier');
          }
          return response.json();
        })
        .then((data) => {
          if (!data.success) {
            throw new Error('Unable to delete identifier');
          }

          this.fetchData();
          swal.fire('Deleted!', 'Identifier deleted successfully.', 'success');
        })
        .catch((error) => {
          console.error(error);
          swal.fire('Error', 'Unable to delete identifier.', 'error');
        });
    });
  }

  /**
   * Render the candidate identifiers table.
   *
   * @return {object} React component
   */
  render() {
    const {t} = this.props;

    if (!this.state.isLoaded) {
      return <Loader />;
    }

    const fields = [
      {
        label: 'CandID',
        show: true,
        filter: {name: 'CandID', type: 'text'},
      },
      {
        label: 'PSCID',
        show: true,
        filter: {name: 'PSCID', type: 'text'},
      },
      {
        label: t('Identifier Type', {ns: 'candidate_identifiers'}),
        show: true,
        filter: {name: 'IdentifierType', type: 'text'},
      },
      {
        label: t('Identifier Value', {ns: 'candidate_identifiers'}),
        show: true,
        filter: {name: 'IdentifierValue', type: 'text'},
      },
      {
        label: t('Date Added', {ns: 'candidate_identifiers'}),
        show: true,
        filter: {name: 'DateAdded', type: 'date'},
      },
      {
        label: t('Date Edited', {ns: 'candidate_identifiers'}),
        show: true,
        filter: {name: 'DateEdited', type: 'date'},
      },
      {
        label: 'CandidateIdentifierID',
        show: false,
      },
      {
        label: 'CandidateIdentifierTypeID',
        show: false,
      },
      {
        label: t('Delete', {ns: 'candidate_identifiers'}),
        show: true,
      },
    ];

    const actions = [
      {
        label: t('Add Identifier', {ns: 'candidate_identifiers'}),
        action: () => this.setState({showAddForm: true}),
        name: 'addIdentifier',
      },
    ];

    return (
      <div>
        <Modal
          title={t('Add Identifier', {ns: 'candidate_identifiers'})}
          label={t('Add Identifier', {ns: 'candidate_identifiers'})}
          show={this.state.showAddForm}
          onClose={() => this.setState({showAddForm: false})}
        >
          <AddIdentifierForm
            identifierTypes={this.state.identifierTypes}
            onSuccess={() => {
              this.setState({showAddForm: false});
              this.fetchData();
            }}
          />
        </Modal>
        <Modal
          title={t('Edit Identifier', {ns: 'candidate_identifiers'})}
          label={t('Edit Identifier', {ns: 'candidate_identifiers'})}
          show={this.state.editingIdentifier !== null}
          onClose={() => this.setState({editingIdentifier: null})}
        >
          {this.state.editingIdentifier && (
            <EditIdentifierForm
              key={this.state.editingIdentifier.CandidateIdentifierID}
              identifier={this.state.editingIdentifier}
              identifierTypes={this.state.identifierTypes}
              onSuccess={() => {
                this.setState({editingIdentifier: null});
                this.fetchData();
              }}
            />
          )}
        </Modal>

        <FilterableDataTable
          name="candidateIdentifiers"
          data={this.state.data}
          fields={fields}
          actions={actions}
          getFormattedCell={this.formatColumn}
        />
      </div>
    );
  }
}

CandidateIdentifiersIndex.propTypes = {
  dataURL: PropTypes.string.isRequired,
  baseURL: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

i18n.addResourceBundle('fr', 'candidate_identifiers', frStrings);

window.addEventListener('load', () => {
  const TranslatedCandidateIdentifiersIndex = withTranslation()(
    CandidateIdentifiersIndex
  );

  createRoot(document.getElementById('lorisworkspace')).render(
    <TranslatedCandidateIdentifiersIndex
      dataURL={`${loris.BaseURL}/candidate_identifiers/?format=binary`}
      baseURL={loris.BaseURL}
    />
  );
});
