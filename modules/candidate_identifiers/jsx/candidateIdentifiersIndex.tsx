import {createRoot} from 'react-dom/client';
import React, {useEffect, useState} from 'react';
import Modal from 'Modal';
import swal from 'sweetalert2';

import i18n from 'I18nSetup';

import {
  withTranslation,
  WithTranslation,
} from 'react-i18next';

import {client} from 'jslib/http';

import Loader from 'Loader';
import FilterableDataTable from 'FilterableDataTable';

import fetchDataStream from 'jslib/fetchDataStream';

import AddIdentifierForm from './addIdentifierForm';
import EditIdentifierForm from './editIdentifierForm';

import frStrings from '../locale/fr/LC_MESSAGES/candidate_identifiers.json';

declare const loris: {
  BaseURL: string;
};

type CandidateIdentifier = {
  CandID: string;
  PSCID: string;
  IdentifierType: string;
  IdentifierValue: string;
  DateAdded: string;
  DateEdited: string;
  CandidateIdentifierID: number | string;
  CandidateIdentifierTypeID: number | string;
  [key: string]: string | number;
};

type IdentifierType = {
  value: string | number;
  label: string;
  isRequired: boolean;
  autoGenerate: boolean;
};

type IdentifierTypesResponse = {
  fieldOptions: {
    identifierTypes: IdentifierType[];
  };
};

type CandidateIdentifiersIndexProps = {
  dataURL: string;
  baseURL: string;
  t: WithTranslation['t'];
};

/**
 * Candidate Identifiers
 *
 * Displays candidate identifiers in a filterable table.
 *
 * @param props Component properties
 */
function CandidateIdentifiersIndex(
  props: CandidateIdentifiersIndexProps
): React.ReactElement {
  const [data, setData] = useState<string[][]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [identifierTypes, setIdentifierTypes] = useState<IdentifierType[]>([]);
  const [editingIdentifier, setEditingIdentifier] =
    useState<CandidateIdentifier | null>(null);

  /**
   * Load candidate identifiers.
   */
  useEffect(() => {
    fetchData();

    client.get<IdentifierTypesResponse>('candidate_identifiers/?format=json')
      .then((result) => {
        setIdentifierTypes(result.fieldOptions.identifierTypes || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  /**
   * Retrieve identifier rows from the data framework.
   */
  const fetchData = () => {
    const rows: string[][] = [];

    setIsLoaded(false);

    fetchDataStream(
      props.dataURL,
      (row: string[]) => {
        rows.push(row);
      },
      () => setData([...rows]),
      () => {
        setData([...rows]);
        setIsLoaded(true);
      },
      'GET'
    );
  };

  /**
   * Format candidate links and date values.
   *
   * @param column Column name
   * @param cell Cell value
   * @param row Candidate identifier row
   * @return Formatted table cell
   */
  const formatColumn = (
    column: string,
    cell: React.ReactNode,
    row: CandidateIdentifier,
  ): React.ReactElement => {
    if (column === 'PSCID') {
      const url = props.baseURL + '/' + row.CandID + '/';

      return <td><a href={url}>{cell}</a></td>;
    }

    if (column === props.t('Identifier Value',
      {ns: 'candidate_identifiers'})) {
      return (
        <td>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              setEditingIdentifier({
                ...row,
                IdentifierType: String(
                  row[props.t('Identifier Type', {
                    ns: 'candidate_identifiers',
                  })] ?? ''
                ),
                IdentifierValue: String(
                  row[props.t('Identifier Value', {
                    ns: 'candidate_identifiers',
                  })] ?? ''
                ),
              });
            }}
          >
            {cell}
          </a>
        </td>
      );
    }

    if (column === props.t('Delete', {ns: 'candidate_identifiers'})) {
      const identifierType = identifierTypes.find(
        (type) => Number(type.value) === Number(row.CandidateIdentifierTypeID)
      );

      return (
        <td>
          {identifierType && !identifierType.isRequired && (
            <a
              style={{cursor: 'pointer'}}
              onClick={() => confirmDelete(row)}
            >
              {props.t('Delete', {ns: 'candidate_identifiers'})}
            </a>
          )}
        </td>
      );
    }

    return <td>{cell}</td>;
  };

  /**
   * Confirm and delete a candidate identifier.
   *
   * @param row Identifier row
   */
  const confirmDelete = (row: CandidateIdentifier) => {
    const {t} = props;
    swal.fire({
      title: t('Are you sure?', {ns: 'loris'}),
      text: t('Delete identifier "{{value}}"?', {
        ns: 'candidate_identifiers',
        value: row[props.t('Identifier Value', {ns: 'candidate_identifiers'})],
      }),
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: t('Yes, delete it!', {ns: 'candidate_identifiers'}),
      cancelButtonText: t('Cancel', {ns: 'loris'}),
    }).then((result) => {
      if (!result.value) {
        return;
      }

      client.request<{success: boolean}>(
        `api/v0.0.4-dev/candidates/` +
        `${encodeURIComponent(row.CandID)}/identifiers`,
        {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            Identifier: {
              CandidateIdentifierID: Number(row.CandidateIdentifierID),
            },
          }),
        }
      ).then((data) => {
        if (!data.success) {
          throw new Error('Unable to delete identifier');
        }

        fetchData();
        swal.fire(
          t('Deleted!', {ns: 'candidate_identifiers'}),
          t('Identifier deleted successfully.', {ns: 'candidate_identifiers'}),
          'success'
        );
      })
        .catch((error) => {
          console.error(error);
          swal.fire(
            t('Error', {ns: 'loris'}),
            t('Unable to delete identifier.', {ns: 'candidate_identifiers'}),
            'error'
          );
        });
    });
  };

  /**
   * Render the candidate identifiers table.
   *
   * @return {object} React component
   */
  const {t} = props;

  if (!isLoaded) {
    return <Loader />;
  }

  const fields: React.ComponentProps<typeof FilterableDataTable>['fields'] = [
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
      /**
       *
       */
      action: () => setShowAddForm(true),
      name: 'addIdentifier',
    },
  ];

  return (
    <div>
      <Modal
        title={t('Add Identifier', {ns: 'candidate_identifiers'})}
        show={showAddForm}
        onClose={() => setShowAddForm(false)}
      >
        <AddIdentifierForm
          identifierTypes={identifierTypes}
          onSuccess={() => {
            setShowAddForm(false);
            fetchData();
          }}
        />
      </Modal>
      <Modal
        title={t('Edit Identifier', {ns: 'candidate_identifiers'})}
        show={editingIdentifier !== null}
        onClose={() => setEditingIdentifier(null)}
      >
        {editingIdentifier && (
          <EditIdentifierForm
            key={editingIdentifier.CandidateIdentifierID}
            identifier={editingIdentifier}
            onSuccess={() => {
              setEditingIdentifier(null);
              fetchData();
            }}
          />
        )}
      </Modal>

      <FilterableDataTable
        name="candidateIdentifiers"
        title={t('Candidate Identifiers', {ns: 'candidate_identifiers'})}
        data={data}
        fields={fields}
        actions={actions as unknown as React.ComponentProps<
          typeof FilterableDataTable
        >['actions']}
        getFormattedCell={formatColumn as unknown as React.ComponentProps<
          typeof FilterableDataTable
        >['getFormattedCell']}
      />
    </div>
  );
}

i18n.addResourceBundle('fr', 'candidate_identifiers', frStrings);

window.addEventListener('load', () => {
  const TranslatedCandidateIdentifiersIndex = withTranslation()(
    CandidateIdentifiersIndex
  );

  createRoot(document.getElementById('lorisworkspace') as HTMLElement).render(
    <TranslatedCandidateIdentifiersIndex
      dataURL={`${loris.BaseURL}/candidate_identifiers/?format=binary`}
      baseURL={loris.BaseURL}
    />
  );
});
