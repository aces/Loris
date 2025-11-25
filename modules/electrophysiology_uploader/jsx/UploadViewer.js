import React from 'react';
import PropTypes from 'prop-types';
import FilterableDataTable from 'jsx/FilterableDataTable';

/**
 * UploadViewer
 *
 * @param {array} props
 * @return {JSX}
 */
export default function UploadViewer(props) {
  /**
   * Modify behaviour of specified column cells in the Data Table component
   *
   * @param {string} column - column name
   * @param {string} cell - cell content
   * @param {object} row - row content indexed by column
   * @return {JSX} a formated table cell for a given column
   */
  const {t} = props;
  const formatColumn = (column, cell, row) => {
    switch (column) {
    case t('Upload Location', {ns: 'electrophysiology_uploader'}):
      const downloadURL =
          loris.BaseURL
          + '/electrophysiology_uploader/upload?'
          + `upload_id=${row['Upload ID']}`;
      return (
        <td>
          <a href={downloadURL} target="_blank"
            download={row[t('File Name',
              {ns: 'electrophysiology_uploader'})]}>
            {cell}
          </a>
        </td>
      );
    default:
      return <td>{cell}</td>;
    }
  };

  const fields = [
    {
      label: t('Upload ID', {ns: 'electrophysiology_uploader'}),
      show: true,
    },
    {
      label: t('Site', {ns: 'loris', count: 1}),
      show: true,
      filter: {
        name: 'site',
        type: 'multiselect',
        options: props.fieldOptions.sites,
      },
    },
    {
      label: t('PSCID', {ns: 'loris'}),
      show: true,
      filter: {
        name: 'pscid',
        type: 'text',
      },
    },
    {
      label: t('Visit Label', {ns: 'loris'}),
      show: true,
      filter: {
        name: 'visitLabel',
        type: 'select',
        options: props.fieldOptions.visitLabel,
      },
    },
    {
      label: t('Upload Location', {ns: 'electrophysiology_uploader'}),
      show: true,
    },
    {
      label: t('Upload Time', {ns: 'electrophysiology_uploader'}),
      show: false,
    },
    {
      label: t('Status', {ns: 'electrophysiology_uploader'}),
      show: true,
    },
    {
      label: t('Uploaded By', {ns: 'electrophysiology_uploader'}),
      show: true,
    },
  ];

  return (
    <FilterableDataTable
      name='eeg_upload_viewer'
      data={props.data}
      fields={fields}
      getFormattedCell={formatColumn}
    />
  );
}

UploadViewer.propTypes = {
  data: PropTypes.array.isRequired,
  fieldOptions: PropTypes.object.isRequired,
  t: PropTypes.func,
};